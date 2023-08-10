import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap';

THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
  materialColor: '#ffeded',
  particleColor: '#ffeded'
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Meshes
let meshes = [];
let particles;

// Variables
let objectsDistance = 4;

const geometryPool = [
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  new THREE.ConeGeometry(1, 2, 32),
  new THREE.TorusKnotGeometry(0.6, 0.35, 100, 16),
  new THREE.CapsuleGeometry(1, 0.5, 10, 10),
  new THREE.DodecahedronGeometry(1),
  new THREE.LatheGeometry(),
  new THREE.OctahedronGeometry(1)
]

/**
 * Meshes
 */
const createMeshes = (numOfMeshes = 3) => {
  // Texture
  const textureLoader = new THREE.TextureLoader()
  const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
  gradientTexture.magFilter = THREE.NearestFilter;

  // Material
  const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
  })

  // Mesh
  const newMeshes = [];

  for (let i = 0; i < numOfMeshes; i++) {
    const randomGeometry = geometryPool[Math.floor(Math.random() * geometryPool.length)]

    const mesh = new THREE.Mesh(
      randomGeometry,
      material
    )

    // position
    mesh.position.y = -objectsDistance * i;
    mesh.position.x = (i % 2 === 0) ? 2 : -2
    newMeshes.push(mesh)
  }


  gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
      material.color.set(parameters.materialColor);
    })

  return newMeshes
}

meshes = createMeshes(3)
scene.add(...meshes);

/**
 * Particles
 */
const createParticles = (count = 2000) => {
  // geometry
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 10;
    // objectsDistance * 0.5 - positive y offset 
    positions[i3 + 1] = - (Math.random() * objectsDistance * meshes.length) + objectsDistance * 0.5
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // material
  const material = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
  })

  // particle mesh (points)
  const points = new THREE.Points(
    geometry,
    material
  )

  gui
    .addColor(parameters, 'particleColor')
    .onChange(() => {
      material.color.set(parameters.particleColor);
    })

  return points;
}

particles = createParticles();
scene.add(particles);

/**
 * Lighting
 */
const directionalLight = new THREE.DirectionalLight('#ffffff');
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Scroll
 */
let scrollY = window.scrollY; // current scroll value 
let currentSection = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);
  if (newSection !== currentSection) {
    console.log('new section ' + newSection);

    // animate object when chaning section
    currentSection = newSection;

    gsap.to(meshes[currentSection].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5'
    })
  }
})

const animateCamera = (scrollPositionY, deltaTime) => {
  // vertical animation to follow scrolling
  camera.position.y = - scrollPositionY / sizes.height * objectsDistance

  // parallex animation to follow mouse move
  const parallaxX = cursor.x;
  const parallaxY = - cursor.y;

  // smoothing parallax effect by move camera position towards new parallax position gradually (increase x% the distance each frame)
  // cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.02
  // cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.02

  // make sure the effect is the same for any hz screen
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime
}

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0
}

window.addEventListener("mousemove", (event) => {
  // Normalize the values so x and y range from 0...1 and then future normalize to -0.5...0.5 so that we could use it to move our camera
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
})

/**
 * Animate
 */
const animateMeshes = (deltaTime) => {
  for (const mesh of meshes) {
    console.log(deltaTime);
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.2
  }
}

const clock = new THREE.Clock()
let previousTime = 0.0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Render
  renderer.render(scene, camera)

  animateCamera(scrollY, deltaTime)

  animateMeshes(deltaTime)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()