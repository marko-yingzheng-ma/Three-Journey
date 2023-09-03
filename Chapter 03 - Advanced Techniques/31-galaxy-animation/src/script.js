import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

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
  count: 100000, // number of particles
  size: 10,
  radius: 10,
  branches: 5,
  spin: 0.5,
  randomnessPower: 2,
  insideColor: '#ad36ec',
  outsideColor: '#6abae2',
  texture: 1,
}

let geometry, material, galaxy;

const generateGalaxy = () => {
  /**
   * Destroy old galaxy
   */
  const resetGalaxy = () => {
    if (galaxy) {
      geometry.dispose()
      material.dispose()
      scene.remove(galaxy);
    }
  }

  resetGalaxy()

  // Geometry
  const { count, texture } = galaxyConfig;
  geometry = new THREE.BufferGeometry();

  const generateStars = () => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count * 1);
    const randoms = new Float32Array(count * 3);

    const insideColor = new THREE.Color(galaxyConfig.insideColor);
    const outsideColor = new THREE.Color(galaxyConfig.outsideColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // populate positions
      const radius = Math.random() * galaxyConfig.radius;
      const spinAngle = radius * galaxyConfig.spin;
      const branchAngle = (i % galaxyConfig.branches) * (2 * Math.PI / galaxyConfig.branches)

      // use pow function since the power of smaller value (0 - 1) tend to be even much smaller (e.g comparing 0.1^2 vs. 0.99 ^ 2)which leads to more random deviance close to the original branch line and less far from original
      const randomX = (Math.pow(Math.random(), galaxyConfig.randomnessPower)) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = (Math.pow(Math.random(), galaxyConfig.randomnessPower)) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = (Math.pow(Math.random(), galaxyConfig.randomnessPower)) * (Math.random() < 0.5 ? 1 : -1);

      positions[i3] = radius * Math.cos(branchAngle + spinAngle);
      positions[i3 + 1] = 0;
      positions[i3 + 2] = radius * Math.sin(branchAngle + spinAngle);

      // populate colors
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / galaxyConfig.radius)
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = Math.random();

      randoms[i3] = randomX;
      randoms[i3 + 1] = randomY;
      randoms[i3 + 2] = randomZ;
    }

    return { positions, colors, scales, randoms };
  }

  const { positions, colors, scales, randoms } = generateStars(count);


  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute("random", new THREE.BufferAttribute(randoms, 3))


  // Material
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uPointSize: { value: galaxyConfig.size * renderer.getPixelRatio() },
      uTime: { value: 0.0 }
    }
  })

  galaxy = new THREE.Points(geometry, material);

  scene.add(galaxy);
}

gui
  .add(galaxyConfig, 'size').max(20.0).min(0.01)
  .onFinishChange(() => {
    material.uniforms.uPointSize.value = galaxyConfig.size;
  })

gui
  .add(galaxyConfig, 'count').max(300000).min(500).step(100)
  .onFinishChange(generateGalaxy)

gui
  .add(galaxyConfig, 'radius').max(20).min(0.01).step(0.001)
  .onFinishChange(generateGalaxy)

gui
  .add(galaxyConfig, 'branches').max(20).min(2).step(1)
  .onFinishChange(generateGalaxy)

gui
  .add(galaxyConfig, 'spin').max(5).min(0).step(0.001)
  .onFinishChange(generateGalaxy)

gui
  .add(galaxyConfig, 'randomnessPower').max(10).min(1).step(1)
  .onFinishChange(generateGalaxy)

gui
  .addColor(galaxyConfig, 'insideColor').onChange(generateGalaxy)

gui
  .addColor(galaxyConfig, 'outsideColor').onChange(generateGalaxy)

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

generateGalaxy();

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()