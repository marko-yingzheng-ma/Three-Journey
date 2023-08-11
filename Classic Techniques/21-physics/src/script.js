import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON, { Vec3 } from 'cannon';

THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Debug
const debugParams = {
  floorWidth: 50,
  floorHeight: 50
}

debugParams.createObject = () => {
  const getRandomVertexPosition = () => {
    return (Math.random() - 0.5) * debugParams.floorWidth + 1
  }
  createSphere(
    Math.random() * 2 + 0.5,
    {
      x: getRandomVertexPosition(),
      y: Math.abs(getRandomVertexPosition()),
      z: getRandomVertexPosition()
    })
}

gui.add(debugParams, 'createObject')
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */

// world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Physics material (a reference to our 3D material) - maybe we could apply a rubber physics material to a brick 3D material so that a brick will physically behaves like a rubber..
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.5,
    restitution: 0.8,
  }
) // Defines what happens when two materials meet.
world.defaultContactMaterial = defaultContactMaterial


// sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   material: defaultMaterial
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(200, 300, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody);

// Add multiple objects...


// Floor
const floorShape = new CANNON.Plane() // infinite
const floorBody = new CANNON.Body({
  mass: 0, // static and won't move 
  shape: floorShape,
  material: defaultMaterial
})
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
)
world.addBody(floorBody);


// /**
//  * Test sphere
//  */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.5,
//     roughness: 0.5,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5
//   })
// )
// sphere.castShadow = true
// sphere.position.y = 3
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(debugParams.floorWidth, debugParams.floorHeight),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.5,
    roughness: 0.3,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// combine creating physics and 3js object together

let objectsToSync = [];
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.5,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5
})

const createSphere = (radius = 0.5, position) => {
  if (!radius || !position) {
    return
  }

  // 3Js Mesh
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh.scale.set(radius, radius, radius);
  sphereMesh.castShadow = true
  sphereMesh.position.copy(position)
  scene.add(sphereMesh)

  // Physics sphere
  const sphereShape = new CANNON.Sphere(radius)
  const sphereBody = new CANNON.Body({
    mass: 1,
    shape: sphereShape,
    material: defaultMaterial
  })
  sphereBody.position.copy(position);

  // track objects
  objectsToSync.push({
    mesh: sphereMesh,
    body: sphereBody
  })

  world.addBody(sphereBody);
}

createSphere(0.5, { x: 0, y: 5, z: 0 });

const syncObjects = () => {
  for (let objectPair of objectsToSync) {
    const { mesh, body } = objectPair;
    mesh.position.copy(body.position)
  }
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(directionalLightHelper);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 7, 7, 7)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update()

  // apply force
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

  // update physics world
  world.step(1 / 60, deltaTime, 3)

  // sync physics world with 3JS world
  syncObjects()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()