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

// Loader
const textureLoader = new THREE.TextureLoader()

/**
 * Galaxy
 */

const galaxyConfig = {
  count: 5000, // number of particles
  size: 0.05,
  radius: 5,
  branches: 3,
  texture: 1,
}

let geometry, material, points;

const generateGalaxy = () => {
  /**
   * Destroy old galaxy
   */
  const resetGalaxy = () => {
    if (points) {
      geometry.dispose()
      material.dispose()
      scene.remove(points);
    }
  }

  resetGalaxy()

  // Geometry
  const { count, texture } = galaxyConfig;
  geometry = new THREE.BufferGeometry();

  const generateStars = () => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * galaxyConfig.radius;
      const branchAngle = (i % galaxyConfig.branches) * (2 * Math.PI / galaxyConfig.branches)
      if (i < 10) {
        console.log(branchAngle);
      }
      positions[i3] = radius * Math.cos(branchAngle);
      positions[i3 + 1] = 0
      positions[i3 + 2] = radius * Math.sin(branchAngle);
    }
    return positions;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(generateStars(count), 3))

  // Material
  material = new THREE.PointsMaterial({
    size: galaxyConfig.size,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  points = new THREE.Points(geometry, material);

  scene.add(points);

}
generateGalaxy();

gui
  .add(galaxyConfig, 'size').max(0.2).min(0.01)
  .onFinishChange(generateGalaxy)

gui
  .add(galaxyConfig, 'count').max(50000).min(500).step(100)
  .onFinishChange(generateGalaxy)

gui
  .add(galaxyConfig, 'radius').max(20).min(0.01).step(0.001)
  .onFinishChange(generateGalaxy)

gui
  .add(galaxyConfig, 'branches').max(20).min(2).step(1)
  .onFinishChange(generateGalaxy)

const axesHelper = new THREE.AxesHelper();
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
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

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()