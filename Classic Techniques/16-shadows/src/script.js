import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture Loader
const textureLoader = new THREE.TextureLoader();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Intensity');
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.position.set(2, 2, - 1)
directionalLight.visible = false;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(512, 512);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
// directionalLight.shadow.radius = 4; // radius doesn't work with PCFSoftShadowMap

const directLightFolderUI = gui.addFolder('Direct Light')
directLightFolderUI.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('intensity')
directLightFolderUI.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
directLightFolderUI.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
directLightFolderUI.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
directLightFolderUI.add(directionalLight, 'visible')
scene.add(directionalLight)

// Spotlight
const spotlight = new THREE.SpotLight(0xffffff, 0.2);
spotlight.castShadow = true;
spotlight.visible = false;
spotlight.position.set(0, 2, 2);
spotlight.shadow.mapSize.set(1024, 1024);
spotlight.shadow.camera.near = 2;
spotlight.shadow.camera.far = 5;
spotlight.shadow.camera.top = 2;
spotlight.shadow.camera.right = 2;
spotlight.shadow.camera.bottom = -2;
spotlight.shadow.camera.left = -2;
spotlight.shadow.camera.fov = 30;
scene.add(spotlight);

const spotlightFolderUI = gui.addFolder('Spot Light');
spotlightFolderUI.add(spotlight, 'intensity').min(0).max(1).step(0.001).name('Spot Intensity')
spotlightFolderUI.add(spotlight.position, 'x').min(- 5).max(5).step(0.001)
spotlightFolderUI.add(spotlight.position, 'y').min(- 5).max(5).step(0.001)
spotlightFolderUI.add(spotlight.position, 'z').min(- 5).max(5).step(0.001)
spotlightFolderUI.add(spotlight, 'visible')

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.2);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
pointLight.shadow.camera.top = 2;
pointLight.shadow.camera.right = 2;
pointLight.shadow.camera.bottom = -2;
pointLight.shadow.camera.left = -2;
scene.add(pointLight)

const pointlightFolderUI = gui.addFolder('Point Light');
pointlightFolderUI.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('Spot Intensity')
pointlightFolderUI.add(pointLight.position, 'x').min(- 5).max(5).step(0.001)
pointlightFolderUI.add(pointLight.position, 'y').min(- 5).max(5).step(0.001)
pointlightFolderUI.add(pointLight.position, 'z').min(- 5).max(5).step(0.001)
pointlightFolderUI.add(pointLight, 'visible')

// Helpers
const directionalLightHelper = new THREE.DirectionalLightHelper
  (directionalLight, 0.5);
directionalLightHelper.visible = false
scene.add(directionalLightHelper);

const directionalLightShadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera, 0.5);
directionalLightShadowCameraHelper.visible = false;
scene.add(directionalLightShadowCameraHelper);

const spotlightShadowCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera, 0.5);
spotlightShadowCameraHelper.visible = false
scene.add(spotlightShadowCameraHelper);

const pointlightShadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera, 0.5);
pointlightShadowCameraHelper.visible = false
scene.add(pointlightShadowCameraHelper);

spotlightFolderUI.add(spotlightShadowCameraHelper, 'visible').name('shadow cam helper');
directLightFolderUI.add(directionalLightHelper, 'visible').name('light helper');
pointlightFolderUI.add(pointlightShadowCameraHelper, 'visible').name('light helper');

/**
 * Texture: Baking shadow
 */
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)

plane.receiveShadow = true;
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow
  })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, plane, sphereShadow)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer.shadowMap, 'enabled').onChange((enabled) => {
  directionalLight.castShadow = enabled;
  spotlight.castShadow = enabled;
  pointLight.castShadow = enabled;
});
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  directionalLightHelper.update();
  directionalLightShadowCameraHelper.update();
  spotlightShadowCameraHelper.update();
  pointlightShadowCameraHelper.update();

  // update the sphere 
  sphere.position.set(
    Math.cos(elapsedTime) * 1.5,
    Math.abs(Math.sin(elapsedTime * 3)),
    Math.sin(elapsedTime) * 1.5
  )
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = 1 - sphere.position.y;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()