import * as itowns from 'itowns'
import * as THREE from '../itowns/node_modules/three/build/three.module.js'
import GuiTools from './gui/GuiTools'
import DARK from './layers/DARK'
import {roads, materialLiness} from './layers/roads'
import {bati, ShadMatRoof, ShadMatWalls, ShadMatEdges} from './layers/bati'

var viewerDiv = document.getElementById('viewerDiv');
var position = new itowns.Coordinates('WGS84', 2.352787, 48.858595 , 1500);
var view = new itowns.GlobeView(viewerDiv, position);
const menuGlobe = new GuiTools('menuDiv', view);
/*
var orthoSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    name: 'ORTHOIMAGERY.ORTHOPHOTOS',
    tileMatrixSet: 'PM',
    format: 'image/jpeg',
});

var orthoLayer = new itowns.ColorLayer('Ortho', {
    source: orthoSource,
});

view.addLayer(orthoLayer);
*/
var elevationSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    name: 'ELEVATION.ELEVATIONGRIDCOVERAGE',
    tileMatrixSet: 'WGS84G',
    format: 'image/x-bil;bits=32'
});

var elevationLayer = new itowns.ElevationLayer('MNT_WORLD', {
    source: elevationSource,
});




//view.addLayer(elevationLayer);
view.addLayer(DARK);
view.addLayer(roads);
view.addLayer(bati);

var time = 0;
var buildingTime = 0;

animateThings();

// Animate some shaders uniform (roads, buildings...)
function animateThings() {

  time += 0.04;
  buildingTime = time / 4;
  // Roads
  materialLiness.uniforms.time.value = time;
  
  // Buildings
  var wallColor = ShadMatWalls.uniforms.color.value.getHex();
  //ShadMatWalls.uniforms.color.value = new THREE.Color(Math.sin(time),Math.cos(time),Math.sin(time));
  ShadMatWalls.uniforms.time.value = buildingTime;
  ShadMatRoof.uniforms.time.value = buildingTime;
  ShadMatEdges.uniforms.time.value = buildingTime;
  //globeView.notifyChange(true);
  view.notifyChange(true);
  requestAnimationFrame(animateThings);
};





menuGlobe.addImageryLayersGUI(view.getLayers(l => l.type === 'color'));
menuGlobe.addGeometryLayersGUI(view.getLayers(l => l.type === 'geometry' && l.id != 'globe'), ShadMatRoof, ShadMatWalls, ShadMatEdges);

menuGlobe.gui.add({wallMode : ShadMatWalls.uniforms.mode.value}, 'wallMode').min(0).max(2).step(1).onChange(
  function updateWallMode(value){
        ShadMatWalls.uniforms.mode.value = value;
        view.notifyChange(true);
  }
);


menuGlobe.gui.add({roofMode : ShadMatRoof.uniforms.mode.value}, 'roofMode').min(0).max(2).step(1).onChange(
  function updateRoofMode(value){
        ShadMatRoof.uniforms.mode.value = value;
        view.notifyChange(true);
  }
);


menuGlobe.gui.add({edgesMode : ShadMatEdges.uniforms.mode.value}, 'edgesMode').min(0).max(2).step(1).onChange(
  function updateEdgesMode(value){
        ShadMatEdges.uniforms.mode.value = value;
        view.notifyChange(true);
  }
);


menuGlobe.gui.add({wallScale : 0.1}, 'wallScale').min(0.01).max(1).onChange(
  function updateScaleWallTexture(value){
        ShadMatWalls.uniforms.texture_scale.value = value;
        view.notifyChange(true);
  }
);

menuGlobe.gui.add({roofScale : 0.1}, 'roofScale').min(0.1).max(1).onChange(
  function updateScaleRoofTexture(value){
        ShadMatRoof.uniforms.texture_scale.value = value;
        view.notifyChange(true);
  }
);

menuGlobe.gui.add({wallOpacity : 1.0}, 'wallOpacity').min(0.1).max(1).onChange(
  function updateOpacityWall(value){
        ShadMatWalls.uniforms.opacity.value = value;
        view.notifyChange(true);
  }
);

menuGlobe.gui.add({roofOpacity : 1.0}, 'roofOpacity').min(0.1).max(1).onChange(
  function updateOpacityRoof(value){
        ShadMatRoof.uniforms.opacity.value = value;
        view.notifyChange(true);
  }
);

menuGlobe.gui.add({edgeOpacity : 1.0}, 'edgeOpacity').min(0.1).max(1).onChange(
  function updateOpacityEdge(value){
        ShadMatEdges.uniforms.opacity.value = value;
        view.notifyChange(true);
  }
);

menuGlobe.gui.addColor({wallColor : ShadMatWalls.uniforms.color.value.getHex()}, 'wallColor').onChange(
  function updateColorWall(value){
        ShadMatWalls.uniforms.color.value = new THREE.Color(value);
        view.notifyChange(true);
  }
);

menuGlobe.gui.addColor({roofColor : ShadMatRoof.uniforms.color.value.getHex()}, 'roofColor').onChange(
  function updateColorRoof(value){
        ShadMatRoof.uniforms.color.value = new THREE.Color(value);
        view.notifyChange(true);
  }
);

menuGlobe.gui.addColor({edgeColor : ShadMatEdges.uniforms.color.value.getHex()}, 'edgeColor').onChange(
  function updateColorEdge(value){
        ShadMatEdges.uniforms.color.value = new THREE.Color(value);
        view.notifyChange(true);
  }
);

