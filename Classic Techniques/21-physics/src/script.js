import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon';

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

const getRandomVertexPosition = () => {
  return (Math.random() - 0.5) * debugParams.floorWidth * 0.5 + 2
}

debugParams.createObjectSphere = () => {
  createSphere(
    Math.random() * 2 + 0.5,
    {
      x: getRandomVertexPosition(),
      y: Math.abs(getRandomVertexPosition()),
      z: getRandomVertexPosition()
    })
}

gui.add(debugParams, 'createObjectSphere')

debugParams.createObjectBox = () => {
  createBox(
    Math.random() * 2 + 0.5,
    Math.random() * 2 + 0.5,
    Math.random() * 2 + 0.5,
    {
      x: getRandomVertexPosition(),
      y: Math.abs(getRandomVertexPosition()),
      z: getRandomVertexPosition()
    })
}

gui.add(debugParams, 'createObjectBox')
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
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = (collision) => {
  const velocity = collision.contact.getImpactVelocityAlongNormal();
  if (velocity > 3) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
}

/**
 * Physics
 */

// world
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Physics material (a reference to our 3D material) - maybe we could apply a rubber physics material to a brick 3D material so that a brick will physically behaves like a rubber..
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.2,
    restitution: 0.5,
  }
) // Defines what happens when two materials meet.
world.defaultContactMaterial = defaultContactMaterial

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

/**
 * 3JS Floor
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

/**
 * Combine creating physics and 3js object together both 3js and physics objects
 */
let objectsToSync = [];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.5,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5
})

const boxGeometry = new THREE.BoxGeometry(1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.5,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5
})

const createBox = (width, height, depth, position) => {
  // Mesh
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.scale.set(width, height, depth);
  boxMesh.castShadow = true;
  boxMesh.position.copy(position);
  scene.add(boxMesh);

  // Body
  const boxShape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
  const boxBody = new CANNON.Body({
    mass: 1,
    shape: boxShape,
    material: defaultMaterial
  })
  boxBody.position.copy(position);
  boxBody.addEventListener('collide', playHitSound)
  world.addBody(boxBody);

  objectsToSync.push({
    mesh: boxMesh,
    body: boxBody
  })
}

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
  sphereBody.addEventListener('collide', playHitSound)
  world.addBody(sphereBody);

  // track objects
  objectsToSync.push({
    mesh: sphereMesh,
    body: sphereBody
  })
}

// createSphere(0.5, { x: 0, y: 5, z: 0 });
createBox(1, 1, 1, { x: 0, y: 5, z: 0 })

const syncObjects = () => {
  for (let objectPair of objectsToSync) {
    const { mesh, body } = objectPair;
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
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