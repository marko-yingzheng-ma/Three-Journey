import * as THREE from 'three'
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// create group
const group = new THREE.Group();

const cube1Axes = new THREE.AxesHelper();
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1,),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.add(cube1Axes);

const cube2Axes = new THREE.AxesHelper();
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1,),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.add(cube2Axes);

const groupAxes = new THREE.AxesHelper();
group.add(groupAxes);

cube1.position.set(-1, -1, 0);
cube2.position.set(1, -1, 0)

group.position.set(-2, -1, 0)

group.add(cube1, cube2);
scene.add(group);

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

mesh.position.set(1, 1, -0.5);
mesh.scale.set(2, 0.5, 0.5);

// rotation without quaternion
mesh.rotation.reorder("YXZ"); // make sure we reorder how the rotation is applied or else the behavior of rotation is messed up because after each axes rotation, other axes might change. Or use quaternion!!
mesh.rotation.x = Math.PI / 4;
mesh.rotation.y = Math.PI / 4;

// rotation with quaternion!! TODO:

scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 8;
// camera.position.x = -1;
camera.position.y = 2;
scene.add(camera)
// camera.lookAt(mesh.position);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// mesh.position.normalize();
console.log("object distance: " + mesh.position.length())
console.log("object distance from camera: " + mesh.position.distanceTo(camera.position))

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)