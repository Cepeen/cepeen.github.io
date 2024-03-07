//THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    // do nothing
} else {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

document.getElementById("container3D").addEventListener("click", onMouseClick);


function onMouseClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([object], true);

  if (intersects.length > 0) {
    targetPosition.copy(intersects[0].point);
  }
}

//Keep the 3D object on a global variable
let object;


//Set which object to render
let objToRender = 'asteroid';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `assets/models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.position.set(200, 130, 300); // Adjust x, y, z as needed
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true = transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "scene" ? 25 : 400;

//Add lights to the scene
var directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(-1, 0, 0); 
scene.add(directionalLight);




//Render the scene
function animate() {
  requestAnimationFrame(animate);

 // Make the object move from left to center
if (object && objToRender === "asteroid") {

  // Adjust the speed 
  object.position.x -= 0.32; 
  object.position.z -= 0.4; 
  object.position.y -= 0.04;

}
// Render distance
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.far = 5000; 
  camera.updateProjectionMatrix();
  
  if (object && objToRender === "asteroid") {
    object.rotation.y += 0.0008;
    object.rotation.z -= 0.002; // Rotation speed
  }

  renderer.render(scene, camera);
}




//Start the 3D rendering
animate();
}