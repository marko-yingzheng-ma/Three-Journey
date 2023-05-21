import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const loader = new GLTFLoader();

let scene, camera, renderer, controls;

function init() {
  // create a new scene
  scene = new THREE.Scene();

  // create a new camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // create a renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // add a directional light to the scene
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 1);
  scene.add(light);

  // add an axes helper to the scene
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);


  // load the 3D model
  loader.load(
    // path to the .gltf file
    './assets/swamp_location/scene.gltf',
    // called when the resource is loaded
    function (gltf) {
      // get the first object in the scene
      const object = gltf.scene.children[0];
      // add the object to the scene
      scene.add(object);

      // add a horizontal surface to the scene
      const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);


      // the bounding box of the object
      const box = new THREE.Box3().setFromObject(object);
      // get the center of the bounding box
      const center = box.getCenter(new THREE.Vector3());
      // get the size of the bounding box
      const size = box.getSize(new THREE.Vector3());

      // set the camera position and target
      camera.position.copy(center);
      camera.position.z = Math.max(size.x, size.y, size.z);
      camera.lookAt(center);

      // add orbit controls to the scene
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 0;
      controls.maxDistance = Infinity;
      controls.maxPolarAngle = Math.PI / 2;
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
      console.error('An error happened', error);
    }
  );
}

function animate() {
  // request the next frame of the animation loop
  requestAnimationFrame(animate);

  // update the controls
  if (controls) {
    controls.update();
  }

  // render the scene
  renderer.render(scene, camera);
}

// initialize the scene, camera, renderer, and controls
init();

// start the animation loop
animate();
