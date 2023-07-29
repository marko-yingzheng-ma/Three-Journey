import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load('/textures/matcaps/1.png');

/**
 * Font
*/
const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Marko Ma', {
    font: font,
    size: 0.5,
    height: 0.5,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 20
  });
  // textGeometry.computeBoundingBox();
  // const boundingBox = textGeometry.boundingBox;
  // textGeometry.translate(
  //   - (boundingBox.max.x - 0.02) * 0.5,
  //   - (boundingBox.max.y - 0.02) * 0.5,
  //   - (boundingBox.max.z - 0.03) * 0.5
  // )
  textGeometry.center() // same as the 6 lines above


  const material = new THREE.MeshNormalMaterial();

  const textMesh = new THREE.Mesh(textGeometry, material);
  scene.add(textMesh);

  const box = new THREE.BoxHelper(textMesh, 0xffff00);
  box.visible = false;
  scene.add(box)

  gui.add(box, 'visible').name('box')

  setupBackground(100, material)
}, () => {

}, () => {
  console.log('error loading font');
})

const setupBackground = (size = 100, material) => {
  if (!size || size < 0 || !material) {
    return
  }

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < size; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 12
    donut.position.y = (Math.random() - 0.5) * 12
    donut.position.z = (Math.random() - 0.5) * 12

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random()
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
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
camera.position.x = 0
camera.position.y = 0.5
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper(5); // Specify the size of the axes
axesHelper.visible = false;
scene.add(axesHelper);

gui.add(axesHelper, 'visible').name('axes')
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