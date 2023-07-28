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

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
ambientLight.visible = false;
scene.add(ambientLight)

const hemisphereLight = new THREE.HemisphereLight(0xfffb00, 0x00ffc8, 0.5) // Similar to ambient light but with a different color coming from sky vs from ground; 
hemisphereLight.visible = false;
scene.add(hemisphereLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionLight.position.set(-1.8, 0.6, -1.8);
directionLight.visible = false;
scene.add(directionLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 10)
pointLight.visible = false;
pointLight.position.set(-1.8, 0.6, -1.8);
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 5, 3, 1)
rectAreaLight.position.set(0, 0.6, -1);
rectAreaLight.visible = false;
rectAreaLight.lookAt(0, 0, 0)
scene.add(rectAreaLight);

// Light helpers
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 0.2);
scene.add(directionLightHelper);

gui.add(pointLight.position, 'x').max(10).min(-10).step(0.001).name('point x')
gui.add(pointLight.position, 'y').max(10).min(-10).step(0.001).name('point y')
gui.add(pointLight.position, 'z').max(10).min(-10).step(0.001).name('point z')

gui.add(directionLight.position, 'x').max(10).min(-10).step(0.001).name('Direction x')
gui.add(directionLight.position, 'y').max(10).min(-10).step(0.001).name('Direction y')
gui.add(directionLight.position, 'z').max(10).min(-10).step(0.001).name('Direction z')

gui.add(rectAreaLight.position, 'x').max(10).min(-10).step(0.001).name('Rect x')
gui.add(rectAreaLight.position, 'y').max(10).min(-10).step(0.001).name('Rect y')
gui.add(rectAreaLight.position, 'z').max(10).min(-10).step(0.001).name('Rect z')


gui.add(ambientLight, 'visible').name('Ambient Light')
gui.add(hemisphereLight, 'visible').name('Hemisphere Light')
gui.add(directionLight, 'visible').name('Direction Light');
gui.add(pointLight, 'visible').name('Point Light');
gui.add(rectAreaLight, 'visible').name('Rect Light');
/**
 * Objects
 */
// Textures 
const texture = textureLoader.load('/textures/door/color.jpg');

// Material
const material = new THREE.MeshStandardMaterial({ color: 'cccccc' })
material.roughness = 0.4
material.metalness = 0.5


gui.add(material, 'roughness').max(1).min(0);
gui.add(material, 'metalness').max(1).min(0);

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()