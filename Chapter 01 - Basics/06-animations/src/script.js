import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// To make animation independent of the framerate: Option 1 - only render every x second/milliseconds

// let lastRunTimeStamp = null;

// function animate() {
//   if (!lastRunTimeStamp) {
//     lastRunTimeStamp = Date.now();
//   } else if (Date.now() - lastRunTimeStamp > 1000) {

//     console.log("rotate");
//     mesh.position.x += 0.01
//     lastRunTimeStamp = Date.now();
//   }

//   // request the next frame of the animation loop
//   requestAnimationFrame(animate);

//   // render the scene
//   renderer.render(scene, camera);
// } 



// To make animation independent of the framerate: Option 2 - relate position to the elased time directly

// const clock = new THREE.Clock();

// function animate() {
//   const elapsedTime = clock.getElapsedTime()

//   // mesh.rotation.y = Math.sin(elapsedTime);
//   // mesh.position.y = Math.sin(elapsedTime);
//   // mesh.position.x = Math.cos(elapsedTime);

//   camera.position.x = 2 * Math.sin(elapsedTime);
//   camera.position.y = 2 * Math.cos(elapsedTime);
//   camera.lookAt(mesh.position);

//   // request the next frame of the animation loop
//   requestAnimationFrame(animate);

//   // render the scene
//   renderer.render(scene, camera);
// }


// animation with gsap
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2, })
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0, })


function animate() {
  // request the next frame of the animation loop
  requestAnimationFrame(animate);

  // render the scene
  renderer.render(scene, camera);
}

animate()