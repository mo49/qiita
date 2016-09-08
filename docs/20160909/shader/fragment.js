uniform float time;
varying vec2 vUv;
void main(void){
    vec2 position = -1.0 + 2.0 * vUv;
    float r = abs( sin( position.x * position.y + time / 3.0 ) );
    float g = abs( sin( position.x * position.y + time / 2.0 ) );
    float b = abs( sin( position.x * position.y + time / 1.0 ) );
        vec3 color = time == 0.0 ? vec3( 1.0, 0.0, 0.0 ) : vec3( r, g, b ) ;
        gl_FragColor = vec4( color, 1.0 );
}
