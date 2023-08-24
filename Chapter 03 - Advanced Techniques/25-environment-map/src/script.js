import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// config
const config = {
  environmentIntensity: 1,
  backgroundBlurriness: 0,
  backgroundIntensity: 1
}

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader()

/**
 * Models
 */
gltfLoader.load(
  '/models/FlightHelmet/glTF/FlightHelmet.gltf',
  (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene)
    updateAllMaterial()
  }
)

/**
 * Environment map: Image Based Lighting
 */

// #1: Using LDR (.jpg/.png) cube images 
// const ldrEnvironmentMapTexture = cubeTextureLoader.load([
//   '/environmentMaps/0/px.png', // positive x
//   '/environmentMaps/0/nx.png', // negative x
//   '/environmentMaps/0/py.png',
//   '/environmentMaps/0/ny.png',
//   '/environmentMaps/0/pz.png',
//   '/environmentMaps/0/nz.png',
// ])

// scene.background = ldrEnvironmentMapTexture;
// scene.environment = ldrEnvironmentMapTexture;



// #2: Using HDR (RGBE encoded/.hdr) equirectangular image
// rgbeLoader.load('/environmentMaps/blender-2k.hdr', (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = environmentMap; // this can be hidden and only show environment for the lighting.
//   scene.environment = environmentMap;
// })


// #3: Using HDR  (EXR/.exr) equirectangular image
// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// })

// #4: Using LDR (.jpg/.png) equirectangular image - 
// textureLoader.load('/environmentMaps/ancient_chinese.png', (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// })

// #5 Optimization: Ground projected skybox
// rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = environmentMap;

//   const skybox = new GroundProjectedSkybox(environmentMap);
//   skybox.scale.setScalar(50);
//   scene.add(skybox);

//   gui.add(skybox, 'radius', 1, 200, 0.1).name('skybox radius')
//   gui.add(skybox, 'height', 1, 100, 0.1).name('skybox height')
// })



/**
 * Realtime Environment map
 */
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg');
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
scene.background = environmentMap;

// holy donut 
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
)
holyDonut.position.y = 3.5
holyDonut.layers.enable(1);
scene.add(holyDonut);

// Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  256,
  {
    type: THREE.HalfFloatType
  }
);
scene.environment = cubeRenderTarget.texture

// Cube camera to populate the cube render target
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);




const updateAllMaterial = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = config.environmentIntensity;
    }
  })
}

gui.add(config, 'environmentIntensity').min(0).max(10).step(0.001).onFinishChange(updateAllMaterial)

gui.add(config, 'backgroundBlurriness').min(0).max(1).step(0.001).onFinishChange(() => {
  scene.backgroundBlurriness = config.backgroundBlurriness;
})

gui.add(config, 'backgroundIntensity').min(0).max(10).step(0.001).onFinishChange(() => {
  scene.backgroundIntensity = config.backgroundIntensity;
})

scene.backgroundBlurriness = config.backgroundBlurriness;
scene.backgroundIntensity = config.backgroundIntensity;


/**
 * Torus Knot
 */

const torusKnotMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 1,
  color: 0xaaaaaa,
  envMapIntensity: config.environmentIntensity
});

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  torusKnotMaterial
)

torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)


/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(3, 3, 3)
// scene.add(directionalLight)

/**
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
camera.position.set(8, 8, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Update Realtime environment Map
  if (holyDonut) {
    holyDonut.rotation.x = elapsedTime * 0.5;
    holyDonut.rotation.y = elapsedTime * 0.5;
    holyDonut.rotation.z = elapsedTime * 0.5;

    cubeCamera.update(renderer, scene)
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()