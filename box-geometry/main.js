import * as  THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// console.log(cube);
scene.add(cube);
renderer.render(scene, camera)
const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    cube.rotation.x += 0.1
}
animate()


