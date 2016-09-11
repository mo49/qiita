uniform float time;
varying vec2 vUv;
void main(void){
  float alpha = time == 0.0 ? 1.0 : cos(time) ;
    gl_FragColor = vec4( vec3( 1.0, 1.0, 1.0 ), alpha );
}
