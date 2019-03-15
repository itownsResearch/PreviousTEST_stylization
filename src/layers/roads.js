import * as itowns from 'itowns';
//import {THREE} from 'itowns';
//import * as THREE from 'three';
import * as THREE from '../../itowns/node_modules/three/build/three.module.js'
import * as Feature2Mesh from '../Feature2Mesh';

//import GlobeView from 'itowns/lib/Core/Prefab/GlobeView';
//console.log("itownsitownsitownsitownsitownsitowns ",itowns);

//var THREE = itowns.THREE;



var animateOn = false;
var time = 0;



  // ShaderMaterial Points
  const vertexShaderLiness = `
  #include <logdepthbuf_pars_vertex>
  uniform float time;
    attribute vec3 color;
 // uniform vec3 posGPS[139];
    attribute float speed;
 // attribute float indice;
 // varying float vDist;
 // varying float colTeam;
 //  varying vec3 vCol;

  vec4 toBezier(float delta, int i, vec4 P0, vec4 P1, vec4 P2, vec4 P3)
  {
      float t = delta * float(i);
      float t2 = t * t;
      float one_minus_t = 1.0 - t;
      float one_minus_t2 = one_minus_t * one_minus_t;
      return (P0 * one_minus_t2 * one_minus_t + P1 * 3.0 * t * one_minus_t2 + P2 * 3.0 * t2 * one_minus_t + P3 * t2 * t);
  }

  void main(){
    
    /*
      float t = mod (time * 10., 139.);
      int indiceC = int(t);
      vec3 posInterpolated = mix(posGPS[indiceC], posGPS[indiceC + 1], fract(t) );
      float lineTeam = floor(indice / 139.);
      colTeam = lineTeam / 100.;

      vDist = mod(abs( float(indiceC) - indice + speed * 10.), 139.) + mod(lineTeam,t); // (mod(abs( float(indiceC) - indice + speed * 10.), 139.) - t / 139.) / (speed * 10.) + lineTeam;    // min(50., distance(posInterpolated, position)) / 50.;

      vec3 newPos = position + vec3( cos(speed*time), cos(1. - vDist), sin(1. - vDist) );  // position  * (1. + sin(time * indice) / 1000000.);    // 10. * vec3( cos(speed*time), cos(1. - vDist), sin(1. - vDist) );
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    */
/*

    float t = mod (time * 20., 13900);
    int indiceC = int(t / 100);

    int correspondingCoord = int(indice) / 13900
*/
  //  vCol = color;

    vec3 newPos = position + vec3( cos(speed*time));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos /*position*/, 1.0);
    #include <logdepthbuf_vertex>
  }
  `;

    
  const fragmentShaderLiness = `
  #include <logdepthbuf_pars_fragment>
  uniform float time;
 // varying float vDist;
 // varying float colTeam;
// varying vec3 vCol;

  void main(){
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(0.8,0.5,0.9,0.3); // vec4(vCol, 0.4);  vec4(0.,abs(sin(10. * time)),1.,.2);  // vec4(1.,  colTeam, 0., max(1. - vDist, 0.02)); 
  }
  `;
  var time = 0;
  var  uniformsLiness = {
       // posGPS: new THREE.Uniform(arrPosGPS2),       
      //  color: {type: 'c', value: new THREE.Color('white')},      
        time       : {type: 'f', value: time}                      // time to create animation
    };

    let materialLiness = new THREE.ShaderMaterial({
        uniforms: uniformsLiness,
        vertexShader: vertexShaderLiness,
        fragmentShader: fragmentShaderLiness,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        //side: THREE.DoubleSide,
        //depthTest: false
    });
    materialLiness.frustumCulled = false;

function altitudeRoads(properties) {
    // console.log('props ', properties);
    //console.log("z_ini : ", properties.z_ini);
    return - 30 ;
}


function colorRoads(properties){
   // let altiRoads = properties.z_ini;
    //console.log('alti_roads ', altiRoads);
    return new THREE.Color(0xff0000);//colorForWater(altiRoads);
}

function acceptFeature(p) {
    return p.z_min !== 9999;
}

function addShaderRoads(m){

      m.material = materialLiness;
}


let roads = {
    id: 'WFS Roads',
    type: 'geometry',
    
    convert: 
        Feature2Mesh.default.convert({
            //color: colorRoads,
            altitude: altitudeRoads,
        //  extrude: extrudeRoads,
        }),
    update: itowns.FeatureProcessing.update,
    onMeshCreated: addShaderRoads,
    filter: acceptFeature,
    source: {
        url: 'https://wxs.ign.fr/oej022d760omtb9y4b19bubh/geoportail/wfs?',
        protocol: 'wfs',
        version: '2.0.0',
        typeName: 'BDTOPO_BDD_WLD_WGS84G:route',
        projection: 'EPSG:4326',
        ipr: 'IGN',
        format: 'application/json',
        zoom: { min: 14, max: 16 },  // Beware that showing building at smaller zoom than ~16 create some holes as the WFS service can't answer more than n polylines per request
    }
};





export  {roads, materialLiness};
