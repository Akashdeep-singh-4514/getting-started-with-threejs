import * as  THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import * as dat from "dat.gui"
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"

//basic objects we need
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
camera.position.z = 10
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

// extra objects
//for hover
const raycaster = new THREE.Raycaster()

//to rotate plane
new OrbitControls(camera, renderer.domElement)


//setting default values for dat.gui
const world = {
  plane: {
    width: 40,
    height: 30,
    widthSegment: 18,
    heightSegment: 18,

  },
  initialcolor: {
    red: 0,
    green: 0.19,
    blue: 0.4
  }

}

//setting up geometry ,material and plane and gui
const geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegment, world.plane.heightSegment);
const material = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
});
const plane = new THREE.Mesh(geometry, material);
const gui = new dat.GUI()


//change plane according to change in gui variables
gui.add(world.plane, "width", 1, 100).onChange(() => { generatePlane() })
gui.add(world.plane, "height", 1, 100).onChange(() => { generatePlane() })
gui.add(world.plane, "widthSegment", 1, 50).onChange(() => { generatePlane() })
gui.add(world.plane, "heightSegment", 1, 50).onChange(() => { generatePlane() })
gui.add(world.initialcolor, "red", 0, 9).onChange(() => { generatePlane() })
gui.add(world.initialcolor, "green", 0, 9).onChange(() => { generatePlane() })
gui.add(world.initialcolor, "blue", 0, 9).onChange(() => { generatePlane() })

// generate new plane according to change in gui 
const generatePlane = () => {
  plane.geometry.dispose()

  plane.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegment, world.plane.heightSegment)
  savechanges()
}

// saving all the changes
const savechanges = () => {
  scene.add(plane)

  // creating jagged feature
  const { array } = plane.geometry.attributes.position
  for (let i = 0; i < array.length; i++) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    array[i + 2] = z + Math.random()
  }
  renderer.render(scene, camera)

  // adding color attribute so color changes on hover
  const color = []
  for (let index = 0; index < plane.geometry.attributes.position.count; index++) {
    color.push(world.initialcolor.red, world.initialcolor.green, world.initialcolor.blue)
  }

  plane.geometry.setAttribute('color',
    new THREE.BufferAttribute(new Float32Array(color), 3)
  )
}

// without light you won't see the phong material
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1)
scene.add(light);
const Backlight = new THREE.DirectionalLight(0xffffff, 1);
Backlight.position.set(0, 0, -1)
scene.add(Backlight);

// rendering plane 
savechanges()


// setting up mouse cordinates for raycaster
const mouse = {
  x: undefined,
  y: undefined
}


//render every change

function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes
    const hovercolor = {
      red: 0.1,
      green: 0.5,
      blue: 1
    }
    // chaging color on hover and reset on mouseleave 
    gsap.to(hovercolor, {
      red: world.initialcolor.red,
      green: world.initialcolor.green,
      blue: world.initialcolor.blue,
      duration: 1,
      onUpdate: () => {
        //coloring vertex 1
        color.setX(intersects[0].face.a, hovercolor.red)
        color.setY(intersects[0].face.a, hovercolor.green)
        color.setZ(intersects[0].face.a, hovercolor.blue)

        //coloring vertex 2
        color.setX(intersects[0].face.b, hovercolor.red)
        color.setY(intersects[0].face.b, hovercolor.green)
        color.setZ(intersects[0].face.b, hovercolor.blue)

        //coloring vertex 3
        color.setX(intersects[0].face.c, hovercolor.red)
        color.setY(intersects[0].face.c, hovercolor.green)
        color.setZ(intersects[0].face.c, hovercolor.blue)
      }
    })




    intersects[0].object.geometry.attributes.color.needsUpdate = true
  }
}
animate()

// dividing window x and y axis into quadrant of 4 parts this is neccesary for raycasting
addEventListener("mousemove", (e) => {

  mouse.x = ((e.clientX / innerWidth) * 2) - 1
  mouse.y = -((e.clientY / innerHeight) * 2) + 1

})