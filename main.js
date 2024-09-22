import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI as lil } from "lil-gui";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

const highIntensityDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
highIntensityDirectionalLight.position.set(1, 2, 3);
scene.add(highIntensityDirectionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

let textureLoader = new THREE.TextureLoader();
let color = textureLoader.load("./text/color.jpg");
let roughness = textureLoader.load("./text/roughness.jpg");
let normal = textureLoader.load("./text/normal.png");
let height = textureLoader.load("./text/height.png");

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({
  map: color,
  roughnessMap: roughness,
  normalMap: normal,
  displacementMap: height,
  displacementScale: 0.01,
});

function createLight(type, color, intensity, x, y, z) {
  let light;
  switch (type) {
    case "directional":
      light = new THREE.DirectionalLight(color, intensity);
      break;
    case "ambient":
      light = new THREE.AmbientLight(color, intensity);
      break;
    case "point":
      light = new THREE.PointLight(color, intensity);
      break;
    default:
      console.error("Invalid light type");
      return;
  }
  light.position.set(x, y, z);
  scene.add(light);
  return light;
}

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);

// Position the camera
camera.position.z = 5;

// Initialize lil-gui (use 'lil')
const gui = new lil();

// Add position controls
const positionFolder = gui.addFolder("Position");
positionFolder.add(cube.position, "x", -5, 101);
positionFolder.add(cube.position, "y", -5, 5);
positionFolder.add(cube.position, "z", -5, 5);
positionFolder.open();

// material settings
const materialFolder = gui.addFolder("Material");
materialFolder.add(material, "roughness", 0, 1, 0.001).name("Roughness");
materialFolder.add(material, "metalness", 0, 1, 0.001).name("Metalness");
materialFolder
  .add(material, "displacementScale", 0, 1, 0.001)
  .name("Displacement Scale");
materialFolder.addColor(material, "color").name("Color");

materialFolder.open();

// Add color control
const params = { color: cube.material.color.getHex() };
gui.addColor(params, "color").onChange((value) => {
  cube.material.color.set(value);
});

//Scale
const scaleFolder = gui.addFolder("Scale");
scaleFolder.add(cube.scale, "x", 0, 10, 0.01).name("X");
scaleFolder.add(cube.scale, "y", 0, 10, 0.01).name("Y");
scaleFolder.add(cube.scale, "z", 0, 10, 0.01).name("Z");
scaleFolder.open();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
//   cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();
