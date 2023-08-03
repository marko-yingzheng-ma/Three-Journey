import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const loadingManager = new THREE.LoadingManager(
  () => {
    console.log("Loading Manager: all texture loaded");
  },
  (url) => {
    console.log(`Loading Manager: Texture ${url} loading in progress`);
  },
  (url) => {
    console.log(`Loading Manager: Error loading: ${url}}`)
  }
);

const textureLoader = new THREE.TextureLoader(loadingManager);

// The color texture (also known as albedo texture or diffuse texture) represents the base color of the material. It defines the visual appearance and color of the surface. In simple terms, it's the texture that gives the surface its color or pattern.
const colorTexture = textureLoader.load('/textures/door/color.jpg');

// The alpha texture (also called transparency texture) is used to control the transparency or opacity of the material. It determines which parts of the surface are fully visible, partially visible, or completely transparent.
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');

// The normal texture (also known as bump map or normal map) is used to add surface detail and create the illusion of small bumps and crevices on the surface. It encodes the normal direction of the surface at each texel, allowing for more realistic lighting calculations without adding actual geometric complexity.
const normalTexture = textureLoader.load('/textures/door/normal.jpg');

// The ambient occlusion texture defines the amount of ambient light that reaches each point on the surface. It is used to simulate soft shadows and darkening in areas where light is less likely to reach, such as corners, crevices, and tight spaces between objects.

const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');

// The roughness texture controls the surface roughness or smoothness of the material. It determines how shiny or glossy the surface appears. A black area in this texture will make the surface highly reflective and smooth, while white areas will make it rough and less reflective.
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// The metalness texture defines whether a material is metallic or non-metallic. In PBR workflows, materials are often separated into metal and dielectric (non-metal) types. This texture is used to control which parts of the surface behave like metals, reflecting light in a certain way, and which parts behave like dielectrics with a different reflectance model.
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');

// The height texture (also called displacement map) is used to add geometric detail to the surface. It allows you to simulate actual bumps and displacements by altering the surface geometry based on the texture values. This is different from the normal texture, which only simulates lighting effects without changing the actual shape of the surface.
const heightTexture = textureLoader.load('/textures/door/height.jpg');

// Texture repeating....

// colorTexture.repeat.x = 4;
// colorTexture.repeat.y = 4;
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// Texture rotation....

// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;


// Filtering and Mipmapping
// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture.magFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;


THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  aoMap: ambientOcclusionTexture
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()