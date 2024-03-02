import * as  THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)
const geometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const material = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide, flatShading: THREE.FlatShading });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
// console.log(plane.geometry.attributes.position);
// to use phong material you must add light
const { array } = plane.geometry.attributes.position
for (let i = 0; i < array.length; i++) {
  const x = array[i]
  const y = array[i + 1]
  const z = array[i + 2]
  array[i + 2] = z + Math.random()


}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1)
scene.add(light);
renderer.render(scene, camera)