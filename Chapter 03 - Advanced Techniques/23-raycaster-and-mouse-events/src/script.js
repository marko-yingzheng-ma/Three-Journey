import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2
object1.updateMatrixWorld();

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object2.updateMatrixWorld();

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2
object3.updateMatrixWorld();

scene.add(object1, object2, object3)

/**
 * Models
 */

let model;

const gltfLoader = new GLTFLoader()
gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf) => {
  model = gltf.scene
  scene.add(model);
})

/**
 * Lighting
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
 * Raycasting
 */
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);
/**
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(5)
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
 * mouse events
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width - 0.5) * 2
  mouse.y = - (event.clientY / sizes.height - 0.5) * 2
})

window.addEventListener('click', () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log("clicked on 1");
        break;
      case object2:
        console.log("clicked on 2");
        break;
      case object3:
        console.log("clicked on 3");
        break;
      default:
        break;
    }
  }
})

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect;

const castRay = () => {
  raycaster.setFromCamera(mouse, camera)

  // const rayOrigin = new THREE.Vector3(-3, 0, 0)
  // const rayDirection = new THREE.Vector3(10, 0, 0);
  // rayDirection.normalize()

  // raycaster.set(rayOrigin, rayDirection);


  // test sphere objects
  const objectsToTest = [object1, object2, object3]

  for (const object of objectsToTest) {
    object.material.color.set('#ff0000')
  }

  const intersects = raycaster.intersectObjects(objectsToTest);

  if (intersects.length) {
    if (!currentIntersect) {
      console.log('mouse enter');
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log('mouse left');
    }
    currentIntersect = null;
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set('#0000ff')
  }

  // test model
  if (model) {
    model.scale.set(1, 1, 1);
    const modelIntersects = raycaster.intersectObject(model); // three js raycaster by default test model group and its children meshes recursively. In the old version it only takes a mesh but not group meaning that we would need to take the mesh out of model and intersect it directly. 
    if (modelIntersects.length) {
      model.scale.set(2, 2, 2);
    }
  }
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

  // raycasting
  castRay()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()