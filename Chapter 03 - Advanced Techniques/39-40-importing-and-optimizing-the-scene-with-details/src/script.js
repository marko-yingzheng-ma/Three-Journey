import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import fireflyVertexShader from './shaders/fireflies/vertex.glsl';
import fireflyFragmentShader from './shaders/fireflies/fragment.glsl';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

/**
 * Base
 */
// Debug
const config = {
  clearColor: '#38303b',
  fireflySize: 150
}

const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Baked texture
 */
const bakedTexture = textureLoader.load('baked.jpg');
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Baked Matrial
 */
const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture
});

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffe5) });

// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  uniforms: {
    uTime: { value: 0.0 }
  }
})

/**
 * Model
 */

gltfLoader.load(
  'portal-merged.glb',
  (gltf) => {

    const mergedScene = gltf.scene.children.find((child) => child.name === 'raw');
    mergedScene.material = bakedMaterial;

    const lampPoleA = gltf.scene.children.find((child) => child.name === 'lampLightA');
    const lampPoleB = gltf.scene.children.find((child) => child.name === 'lampLightB');
    const portalLight = gltf.scene.children.find((child) => child.name === 'portalLight');

    lampPoleA.material = poleLightMaterial;
    lampPoleB.material = poleLightMaterial;
    portalLight.material = portalLightMaterial;

    scene.add(gltf.scene);
  }
)

/**
 * Firefly - particles
 */

let fireflyGeometry, fireflyMaterial, firefly;

const generateFlyflies = () => {
  fireflyGeometry = new THREE.BufferGeometry()
  const fireflyCount = 50;
  const positionArray = new Float32Array(fireflyCount * 3);
  const scaleArray = new Float32Array(fireflyCount);

  for (let i = 0; i < fireflyCount; i++) {
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
    positionArray[i * 3 + 1] = Math.abs((Math.random() - 0.5) * 4);
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;


    scaleArray[i] = Math.random();
  }

  fireflyGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
  fireflyGeometry.setAttribute("aScale", new THREE.BufferAttribute(scaleArray, 1));

  fireflyMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    // blending: THREE.AdditiveBlending, // bad for performance 
    vertexColors: true,
    transparent: true,
    vertexShader: fireflyVertexShader,
    fragmentShader: fireflyFragmentShader,
    uniforms: {
      uPointSize: { value: config.fireflySize * renderer.getPixelRatio() },
      uTime: { value: 0.0 }
    }
  })

  firefly = new THREE.Points(fireflyGeometry, fireflyMaterial);

  scene.add(firefly)
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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(config.clearColor);


gui
  .addColor(config, 'clearColor')
  .onChange(() => {
    renderer.setClearColor(config.clearColor);
  });

gui.add(config, 'fireflySize', 20, 500, 0.1).onChange(() => {
  fireflyMaterial.uniforms.uPointSize.value = config.fireflySize * renderer.getPixelRatio();
})


generateFlyflies();

/**
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  fireflyMaterial.uniforms.uTime.value = elapsedTime;
  portalLightMaterial.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()