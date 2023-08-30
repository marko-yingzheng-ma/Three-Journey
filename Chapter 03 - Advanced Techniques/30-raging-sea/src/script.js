import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import fragmentShader from './shaders/fragmentShader.glsl';
import vertexShader from './shaders/vertexShader.glsl';
import { generateUUID } from 'three/src/math/MathUtils';

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const config = {
  depthColor: '#0000ff',
  surfaceColor: '#8888ff'
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(10, 10, 128, 128)

// Material
const waterMaterial = new THREE.ShaderMaterial({
  fragmentShader: fragmentShader,
  vertexShader: vertexShader,
  uniforms: {
    uTime: { value: 0.0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4.0, 2.0) },
    uBigWavesSpeed: { value: 1.0 },

    uDepthColor: { value: new THREE.Color(config.depthColor) },
    uSurfaceColor: { value: new THREE.Color(config.surfaceColor) },
    uColorOffSet: { value: 0.25 },
    uColorMultipler: { value: 5.0 }
  },
  side: THREE.DoubleSide
});

// debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0.0, 1.0, 0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0.0, 10.0, 0.01).name('uBigWavesFrequencyX');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0.0, 10.0, 0.01).name('uBigWavesFrequencyZ');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0.0, 10.0, 0.01).name('uBigWavesSpeed');
gui.addColor(config, 'depthColor').onChange(() => waterMaterial.uniforms.uDepthColor.value = new THREE.Color(config.depthColor))
gui.addColor(config, 'surfaceColor').onChange(() => waterMaterial.uniforms.uSurfaceColor.value = new THREE.Color(config.surfaceColor))
gui.add(waterMaterial.uniforms.uColorOffSet, 'value', 0.0, 1.0, 0.001).name("uColorOffSet");
gui.add(waterMaterial.uniforms.uColorMultipler, 'value', 0.0, 10.0, 0.001).name("colorMultipler");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

// Helper
const axesHelper = new THREE.AxesHelper(10);
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
camera.position.set(1, 1, 1)
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

  // update uTime for vertex shader
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()