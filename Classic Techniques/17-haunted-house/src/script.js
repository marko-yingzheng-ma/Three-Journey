import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Sizes
 */
const sizes = {
  canvas: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  floor: {
    width: 20,
    height: 20
  },
  house: {
    width: 4,
    height: 2.5,
    depth: 4
  },
  roof: {
    radius: 3.5,
    height: 1,
    radiusSegment: 4
  },
  door: {
    width: 2.2,
    height: 2.2
  },
  bush: {
    radius: 1,
    widthSegments: 16,
    heightSegments: 16
  },
  grave: {
    width: 0.6,
    height: 0.8,
    depth: 0.2
  }
}

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Fog
const fog = new THREE.Fog('#262837', 1, 15)

// Scene
const scene = new THREE.Scene()
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');


const wallColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const wallAmbientTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const wallNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const wallRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

grassColorTexture.repeat.set(8, 8);
grassAmbientTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Group
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(sizes.house.width, sizes.house.height, sizes.house.depth),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallAmbientTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture
  })
)
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv, 2)
)
walls.position.y = sizes.house.height * 0.5;
house.add(walls);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(sizes.door.width, sizes.door.height, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    aoMapIntensity: 2,
    displacementScale: 0.1,
    displacementMap: doorHeightTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
)
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv, 2)
)
door.position.y = sizes.door.height * 0.5;
door.position.z = sizes.house.depth * 0.5 + 0.01;
house.add(door);


// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(sizes.roof.radius, sizes.roof.height, sizes.roof.radiusSegment),
  new THREE.MeshStandardMaterial({
    color: '#b35f45'
  })
)
roof.position.y = sizes.house.height + sizes.roof.height * 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof)

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(sizes.floor.width, sizes.floor.height),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture
  })
)

floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// Bushes 
const bushGeometry = new THREE.SphereGeometry(
  sizes.bush.radius,
  sizes.bush.widthSegments,
  sizes.bush.heightSegments
)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#89c854'
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1.5, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(2.2, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-2, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.7, 0.7, 0.7);
bush4.position.set(3, -0.1, -4);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
}
const generateGaves = (geometry, material, gravesGroup, numberOfGraves) => {
  if (!geometry || !material || !gravesGroup) {
    return;
  }

  for (let i = 0; i < numberOfGraves; i++) {
    const grave = new THREE.Mesh(geometry, material);

    const angle = Math.random() * Math.PI * 2;
    const radius = getRandomArbitrary(sizes.house.width, sizes.floor.width * 0.45);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    grave.position.set(x, geometry.parameters.height * 0.5, z);
    grave.rotation.y = (Math.random() - 0.5) * Math.PI * 0.25;
    grave.rotation.z = (Math.random() - 0.5) * Math.PI * 0.25;

    grave.castShadow = true;

    gravesGroup.add(grave);
  }
}

const graveGeometry = new THREE.BoxGeometry(
  sizes.grave.width,
  sizes.grave.height,
  sizes.grave.depth
)

const graveMaterial = new THREE.MeshStandardMaterial({
  color: '#b2b6b1'
})

generateGaves(graveGeometry, graveMaterial, graves, 30);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);


/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
ghost1.position.set(4, 2, 0);
scene.add(ghost1);


const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
ghost2.position.set(-4, 2, -3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
ghost3.position.set(-4, 2, 0);
scene.add(ghost3);


// const ghostHelper = new THREE.PointLightHelper(ghost3, 0.5);
// scene.add(ghostHelper);
/**
 * Helpers
 */

const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

const moonLightHelper = new THREE.DirectionalLightHelper(moonLight, 0.5);
scene.add(moonLightHelper);

const doorLightHelper = new THREE.PointLightHelper(doorLight, 0.5);
scene.add(doorLightHelper);

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
const camera = new THREE.PerspectiveCamera(75, sizes.canvas.width / sizes.canvas.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setSize(sizes.canvas.width, sizes.canvas.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Shadows
 */

renderer.shadowMap.enabled = true;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;
walls.receiveShadow = true;

// NOTE: normally we need to create light helpers and find these values manually
moonLight.shadow.mapSize.set(256, 256);
moonLight.shadow.camera.far = 15;

doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.set(256, 256);
ghost1.shadow.camera.far = 7;

ghost3.shadow.mapSize.set(256, 256);
ghost3.shadow.camera.far = 7;

doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 7;

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

  const ghos1Angle = elapsedTime * 0.3;
  ghost1.position.x = Math.cos(ghos1Angle) * 6;
  ghost1.position.z = Math.sin(ghos1Angle) * 6;
  ghost1.position.y = Math.cos(elapsedTime * 3);

  const ghos2Angle = elapsedTime * 0.3;
  ghost2.position.x = Math.cos(ghos2Angle) * 5;
  ghost2.position.z = Math.sin(-ghos2Angle) * 5;
  ghost2.position.y = Math.cos(elapsedTime * 3) + Math.cos(elapsedTime * 2)

  const ghos3Angle = elapsedTime * 0.1;
  ghost3.position.x = Math.cos(ghos3Angle) * 6;
  ghost3.position.z = Math.sin(-ghos3Angle * 6) * 7 + Math.sin(-ghos3Angle) * 7;
  ghost3.position.y = Math.cos(elapsedTime * 3);

  // ghostHelper.update();
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()