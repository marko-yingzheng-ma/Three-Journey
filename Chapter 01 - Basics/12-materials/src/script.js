import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui';

THREE.ColorManagement.enabled = false
const gui = new GUI();

/**
 * Textures 
 */

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const ambientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const metalTexture = textureLoader.load('/textures/door/metalness.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const roughTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * 
 * Materials
 */



// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// material.color = new THREE.Color('rgb(66,13,111)');
// material.wireframe = true;
// material.opacity = 0.5
// material.transparent = true;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;
// material.flatShading = true;



// const material = new THREE.MeshNormalMaterial() // A material that maps the normal vectors to RGB colors.



// const material = new THREE.MeshMatcapMaterial(); // MeshMatcapMaterial is defined by a MatCap (or Lit Sphere) texture, which encodes the material color and shading.
// material.matcap = matcapTexture;



// const material = new THREE.MeshDepthMaterial(); // A material for drawing geometry by depth. Depth is based off of the camera near and far plane. White is nearest, black is farthest.



// const material = new THREE.MeshLambertMaterial();  // A material for non-shiny surfaces, without specular highlights.



// const material = new THREE.MeshPhongMaterial(); // A material for shiny surfaces with specular highlights.
// material.shininess = 100
// material.specular = new THREE.Color(0x33E9FF)



// const material = new THREE.MeshToonMaterial({ color: 'orange' }); // A material implementing cartoonish shading.
// material.gradientMap = gradientTexture;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;



// const material = new THREE.MeshStandardMaterial();
// // const material = new THREE.MeshPhysicalMaterial(); // An extension of the MeshStandardMaterial, providing more advanced physically-based rendering properties:
// // material.metalness = 0.5
// // material.roughness = 0.2 // don't combine these two with roughtness texture 
// material.map = colorTexture;
// material.aoMap = ambientTexture;

// material.aoMapIntensity = 2;

// material.displacementMap = heightTexture;
// material.displacementScale = 0.05;

// material.metalnessMap = metalTexture;
// material.roughnessMap = roughTexture;

// material.normalMap = normalTexture;
// material.normalScale.set(1, 1);


// material.alphaMap = alphaTexture;
// material.transparent = true;
// // material.wireframe = true;



// ENVIRONMENT MAP:
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.5
material.roughness = 0.2 // don't combine these two with roughtness texture 

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/1/px.jpg', // positive x
  '/textures/environmentMaps/1/nx.jpg', // negative x
  '/textures/environmentMaps/1/py.jpg',
  '/textures/environmentMaps/1/ny.jpg',
  '/textures/environmentMaps/1/pz.jpg',
  '/textures/environmentMaps/1/nz.jpg',
])
material.envMap = environmentMapTexture;

/**
 *  Debug materials
*/
gui
  .add(material, 'metalness')
  .max(1)
  .min(0)
  .step(0.0001)

gui
  .add(material, 'roughness')
  .max(1)
  .min(0)
  .step(0.0001)

gui
  .add(material, 'aoMapIntensity')
  .max(10)
  .min(0)
  .step(0.0001)

gui
  .add(material, 'displacementScale')
  .max(1)
  .min(0)
  .step(0.0001)

/**
 * 
 * Objects
*/
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material
);
sphere.position.x = - 1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 *  Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(-2, 0, 2);
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(lightHelper);


const axesHelper = new THREE.AxesHelper(5); // Specify the size of the axes
scene.add(axesHelper);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(120, sizes.width / sizes.height, 0.1, 2000)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()