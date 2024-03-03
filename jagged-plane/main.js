import * as  THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import * as dat from "dat.gui"
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js"



const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)



const geometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const material = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide, flatShading: THREE.FlatShading });
const plane = new THREE.Mesh(geometry, material);
const gui = new dat.GUI()
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegment: 10,
    heightSegment: 10,

  }
}
gui.add(world.plane, "width", 1, 20).onChange(() => { generatePlane() })
gui.add(world.plane, "height", 1, 20).onChange(() => { generatePlane() })
gui.add(world.plane, "widthSegment", 1, 50).onChange(() => { generatePlane() })
gui.add(world.plane, "heightSegment", 1, 50).onChange(() => { generatePlane() })




const generatePlane = () => {
  plane.geometry.dispose()

  plane.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegment, world.plane.heightSegment)
  savechanges()
}


const savechanges = () => {
  scene.add(plane)
  const { array } = plane.geometry.attributes.position
  for (let i = 0; i < array.length; i++) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    array[i + 2] = z + Math.random()
  }
  renderer.render(scene, camera)

}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1)
scene.add(light);
const Backlight = new THREE.DirectionalLight(0xffffff, 1);
Backlight.position.set(0, 0, -1)
scene.add(Backlight);

savechanges()
function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);

}
animate()