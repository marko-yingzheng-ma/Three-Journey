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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const config = {
  vertexCount: 10000,
  texture: 1
}
/**
 * Particles
 */

const createParticleGeometry = () => {
  const geometry = new THREE.BufferGeometry()
  const count = config.vertexCount
  const positionsArray = new Float32Array(count * 3)

  // Coloring
  const colorsArray = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i++) {
    const randomPosition = 4 * Math.sin(Math.cos(i * 5) - i * 4) - Math.cos(Math.log10(i + 1)) * 2 * Math.sin(i);
    positionsArray[i] = randomPosition;
    colorsArray[i] = Math.random();
  }

  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
  geometry.setAttribute('position', positionsAttribute)

  const colorsAttribute = new THREE.BufferAttribute(colorsArray, 3);
  geometry.setAttribute('color', colorsAttribute);

  return geometry;
}

// Geometry
const particleGeometry = createParticleGeometry()

// Material
const particleMaterial = new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: textureLoader.load(`/textures/particles/${config.texture}.png`) // dark square edge will be transparent
})

// NOTE: 3 ways to remove the dark, square particle edges
// 1. Use set alphaTest value to a small value bigger than 0, this way any pixel with alpha value smaller than the set value will not be drawn
// particleMaterial.alphaTest = 0.05;

// 2. Disable depthTest so that WebGL will not hide any pixel if its behind another, which could potentially mess with the particle transparency. Downside is that when having other object in the scene. particles behind the object will be seen through.
// particleMaterial.depthTest = false;

// 3. Keep depthTest enable but disable depthWrite. WebGL is testing if what's being drawn is closer than what's already drawn (depth test). The depth of what's being drawn is stored in what we call a depth buffer. Instead of not testing if the particle is closer than what's in this depth buffer, we can tell the WebGL not to write particles in that depth buffer 
particleMaterial.depthWrite = false // (NOTE: particle will still do depth test to compare its depth against other object's depth so it can be hidden behind other object, but it will not write its own depth in the buffer so it will not perform depth test against other particle instances)

// Cube for testing 3 methods to remove square edges background.
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()
// )
// scene.add(cube);

// Blending
particleMaterial.blending = THREE.AdditiveBlending; // overlapping pixel will get brighter as it's additiveBlending...this will impact performance.

// Use vertex colors instead of material color
particleMaterial.vertexColors = true;

gui
  .add(config, 'texture', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  .onChange(() => {
    particleMaterial.alphaMap = textureLoader.load(`/textures/particles/${config.texture}.png`);
  })

// Point/Particle Mesh
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// NOTE: this is BAD!!!!!! for performance because we are updating whole position attribute each frame....The right way is to create our own PointMaterial with custom shader... 
const animateParticles = (particles, elapsedTime) => {
  for (let i = 0; i < config.vertexCount; i++) {
    const vertexHeadIndex = i * 3;
    const x = particles.geometry.attributes.position.array[vertexHeadIndex];
    const y = particles.geometry.attributes.position.array[vertexHeadIndex + 1]
    const z = particles.geometry.attributes.position.array[vertexHeadIndex + 2]

    particles.geometry.attributes.position.array[vertexHeadIndex] = x + Math.sin(elapsedTime + x) * 0.01;
    particles.geometry.attributes.position.array[vertexHeadIndex + 1] = y + Math.cos(elapsedTime + y) * 0.01;
    particles.geometry.attributes.position.array[vertexHeadIndex + 2] = z + Math.sin(elapsedTime + z) * 0.01;
  }

  particles.geometry.attributes.position.needsUpdate = true;
}

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
camera.position.z = 3
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

  // Animate Particles
  animateParticles(particles, elapsedTime)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()