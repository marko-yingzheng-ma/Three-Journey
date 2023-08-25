import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const rgbeLoader = new RGBELoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader();

const floorARMTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg');
const floorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg');
floorTexture.colorSpace = THREE.SRGBColorSpace;
const floorNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png');



const wallARMTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg');
const wallTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg');
wallTexture.colorSpace = THREE.SRGBColorSpace;
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png');


/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity
      child.castShadow = true;
      child.receiveShadow = true;
    }
  })
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui
  .add(global, 'envMapIntensity')
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

/**
 * Models
 */
// Helmet
gltfLoader.load(
  '/models/burger.glb',
  (gltf) => {
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    scene.add(gltf.scene)

    updateAllMaterials()
  }
)

/**
 * Planes
 */
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  normalMap: floorNormalTexture,
  aoMap: floorARMTexture,
  roughnessMap: floorARMTexture,
  metalnessMap: floorARMTexture
})
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  floorMaterial
)
floor.rotation.x = - Math.PI / 2;
scene.add(floor);


const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallTexture,
  normalMap: wallNormalTexture,
  aoMap: wallARMTexture,
  roughnessMap: wallARMTexture,
  metalnessMap: wallARMTexture
})
const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  wallMaterial
)
wall.position.set(0, 4, -4)
scene.add(wall);


/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.mapSize.set(512, 512);
directionalLight.shadow.normalBias = 0.034;
directionalLight.position.set(-4, 6.5, 2.5);

directionalLight.target.position.set(0, 4, 0)

scene.add(directionalLight);

gui.add(directionalLight, 'intensity', 0, 10, 0.001).name("light intensity")
gui.add(directionalLight.shadow, 'normalBias', -0.05, 0.05, 0.001)
gui.add(directionalLight.shadow, 'bias', -0.05, 0.05, 0.001)
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
camera.position.set(5, 5, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

// Helpers
const axeHelper = new THREE.AxesHelper(10);
scene.add(axeHelper);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(lightHelper);

const directionalLightShadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera, 0.5);
scene.add(directionalLightShadowCameraHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone Mapping
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmicToneMapping: THREE.ACESFilmicToneMapping
})

gui.add(renderer, "toneMappingExposure", 0, 10, 0.01);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()