/**
 * Copyright (C) 2011 by Paul Lewis for CreativeJS. We love you all :)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { Library } from '../data/Library';
import Particle from './Particle';
import { FireworkExplosions } from './FireworkExplosions';

let firework_size, color_steps;

export const Fireworks = (function() {

  let particles = [],
      mainCanvas = null,
      mainContext = null,
      fireworkCanvas = null,
      fireworkContext = null,
      viewportWidth = 0,
      viewportHeight = 0;

  function initialize(opts={}) {
    firework_size = isNaN(opts.firework_size) ? 12 : opts.firework_size;
    color_steps = isNaN(opts.color_steps) ? 100 : opts.color_steps;

    window.firework_size = firework_size;
    window.sea_height = 380;

    // メイン（全面）
    mainCanvas = document.getElementById('mainCanvas');
    mainContext = mainCanvas.getContext('2d');

    // パーティクル
    // drawImageに使うだけ DOMにはならない
    fireworkCanvas = document.createElement('canvas');
    fireworkContext = fireworkCanvas.getContext('2d');

    window.addEventListener('resize', onWindowResize, false)
    onWindowResize();

    // color
    createFireworkPalette(firework_size,color_steps);

    document.addEventListener('mouseup', createFirework, false);
    document.addEventListener('touchend', createFirework, false);

    update(); // every frame
  }

  function createFirework(opts={}) {
    createParticle(opts);
  }

  function createFireworkPalette(gridSize,colorSteps) {
    // gridSize = big-glow.pngのサイズ
    const size = gridSize * colorSteps/10;
    const steps = colorSteps || 100;
    fireworkCanvas.width = size;
    fireworkCanvas.height = size;
    fireworkContext.globalCompositeOperation = 'source-over';

    // console.log("size, steps",size, steps);

    // カラフルな大きな１枚のパレットを用意して、
    // 一部分だけを表示することで色がランダムに出ているように見せる
    // スプライトつくって一部を表示している感じ
    for(let c = 0; c < steps; c++) {

      const marker = (c * gridSize);
      const gridX = marker % size;
      const gridY = Math.floor(marker / size) * gridSize;

      fireworkContext.fillStyle = "hsl(" + Math.round(c * 360/steps) + ",100%,60%)";
      fireworkContext.fillRect(gridX, gridY, gridSize, gridSize);
      fireworkContext.drawImage(
        Library.bigGlow,
        gridX,
        gridY);

      // console.log("c, c * 360/steps, marker | gridX, gridY, gridSize");
      // console.log(c, Math.round(c * 360/steps), marker, ' | ', gridX, gridY, gridSize);
    }
  }

  function setMainCanvasDimensions() {
    mainCanvas.width = viewportWidth;
    mainCanvas.height = viewportHeight;
  }

  function update() {
    clearContext();
    requestAnimFrame(update);
    drawFireworks();
  }

  // 背景をリセット
  function clearContext() {
    mainContext.globalAlpha = 0.1; // 薄いほど残像が残る
    drawNightsky(Library.nightsky);
    drawIsland(Library.island);
    drawSea(Library.sea);
    mainContext.fillStyle = "rgba(0,0,0,0.1)";
    mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
    // mainContext.clearRect(0, 0, viewportWidth, viewportHeight);
  }

  function drawNightsky(img) {
    const imgWidth = img.width;
    const imgHeight = img.height;
    let width, height;
    let x = 0, y = 0;
    // 全画面表示
    if (imgWidth / imgHeight > viewportWidth / viewportHeight) {
      height = viewportHeight;
      width = imgWidth * viewportHeight / imgHeight;
      x = (viewportWidth - width) / 2;
    } else {
      width = viewportWidth;
      height = imgHeight * viewportWidth / imgWidth;
      y = (viewportHeight - height) / 2;
    }
    mainContext.drawImage(img, x, y, width, height);
  }

  function drawIsland(img) {
    const width = img.width;
    const height = img.height;
    const x = (viewportWidth - width) / 2;
    const y = viewportHeight - (sea_height + 28);
    mainContext.drawImage(img, x, y, width, height);
  }

  function drawSea(img) {
    const height = img.height;
    const width = img.width * viewportHeight / height;
    const x = (viewportWidth - width) / 2;
    const y = viewportHeight - (height - 30);
    mainContext.drawImage(img, x, y, width, height);
  }

  function drawFireworks() {
    var a = particles.length;

    while(a--) {
      // particlesの最後尾は最新の火種
      var firework = particles[a];
      if(firework.update()) {
        // 上昇中のパーティクルを削除して、
        particles.splice(a, 1);
        // 爆発用のパーティクルをつくる
        if(!firework.usePhysics) {
          switch (firework.shape) {
            case "circle": FireworkExplosions.circle(firework); break;
            case "star": FireworkExplosions.star(firework,firework.points,firework.jump); break;
            case "shidare": FireworkExplosions.shidare(firework); break;
            case "underwater": FireworkExplosions.underwater(firework); break;
            default:
              // 2つ打つ
              FireworkExplosions.circle(firework);
              FireworkExplosions.star(firework);
          }
        }
      }
      firework.render(mainContext, fireworkCanvas);
    }
  }

  function createParticle(opts={}) {

    // 打ち上げ時は引数なし
    const pos = opts.pos || {};
    const target = opts.target || {};
    const vel = opts.vel || {};

    particles.push(
      new Particle({
        pos: {
          x: pos.x || viewportWidth * (Math.random() * 0.6 + 0.2),
          y: pos.y || viewportHeight + 10
        },
        target: {
          y: target.y || 100 + Math.random() * 100
        },
        vel: {
          x: vel.x || Math.random() * 1 - 0.5,
          y: vel.y || 0
        },
        marker: opts.color || Math.floor(Math.random() * color_steps) * firework_size,
        usePhysics: opts.usePhysics || false,
        // user
        firework_size: firework_size || 12,
        color_steps: color_steps || 100,
        name: opts.name || "",
        shape: opts.shape || "",
        particle_scale: opts.particle_scale || 1,
        fade: opts.fade || 0.01,
        gravity: opts.gravity || 0.02,
        lifespan: opts.lifespan || 1500,
        time_difference: opts.time_difference || 500,
        random_color: opts.random_color || 0,
        gradation_color: opts.gradation_color || 0,
        points: opts.points,
        jump: opts.jump,
      })
    );

  }

  function onWindowResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    setMainCanvasDimensions();
  }

  return {
    initialize: initialize,
    createParticle: createParticle,
    createFirework: createFirework
  };

})();
