
import './style.css'
import * as THREE from 'three';
import CloudCover from "./Resources/Earth/Cloud cover.png";
import EarthNightLights from "./Resources/Earth/Earth night lights.jpg";
import EarthNormalMap from "./Resources/Earth/Earth normal map.jpg";
import EarthSpecularMap from "./Resources/Earth/Earth specular map.jpg";
import WorldMap from "./Resources/Earth/World map.jpg";
// import MoonNormalMap from "./Resources/Moon/Moon normal map.jpg";
// import Moon from "./Resources/Moon/Moon.jpg";
// import Saturn from "./Resources/Saturn/Saturn.jpg";
// import SaturnRings from "./Resources/Saturn/Saturn's rings.png";
import StarField from "./Resources/Star field.jpg";

import VertexShader from "./Shaders/earth-surface-vertex-shader.glsl";
import FragmentShader from "./Shaders/earth-surface-fragment-shader.glsl";
import CloudsVertexShader from "./Shaders/clouds-vertex-shader.glsl";
import CloudsFragmentShader from "./Shaders/clouds-fragment-shader.glsl";
import AtmosphereVertexShader from "./Shaders/atmosphere-vertex-shader.glsl";
import AtmosphereFragmentShader from "./Shaders/atmosphere-fragment-shader.glsl";
import SunVertexShader from "./Shaders/sun-vertex-shader.glsl";
import SunFragmentShader from "./Shaders/sun-fragment-shader.glsl";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


//SCENE AND CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

//RENDERER
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("display-canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);

//ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);


// // LIGHT (To be used with saturn's MeshPhysicalMaterial)
// const dirLight = new THREE.DirectionalLight();
// dirLight.position.set(100, 100, 100);
// dirLight.target.position.set(0, 0, 0);
// scene.add(dirLight);



//STARFIELD
const starfieldGeometry = new THREE.SphereGeometry(30, 40, 40);
const starfieldMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(StarField),
  side: THREE.DoubleSide
});

starfieldMaterial.map.colorSpace = THREE.SRGBColorSpace;
const starfield = new THREE.Mesh(
  starfieldGeometry, starfieldMaterial
);
scene.add(starfield);



// //SATURN
// //Sphere
// const saturnSphereGeometry = new THREE.SphereGeometry(1.5, 40, 40);
// const saturnSphereMaterial = new THREE.MeshPhysicalMaterial({
//   map: new THREE.TextureLoader().load(Saturn),
// });

// saturnSphereMaterial.map.colorSpace = THREE.SRGBColorSpace;
// const saturnSphere = new THREE.Mesh(
//   saturnSphereGeometry, saturnSphereMaterial
// );
// saturnSphere.rotation.x = 0.1;
// scene.add(saturnSphere);

// //Rings
// const saturnRingGeo = new THREE.RingGeometry(2, 4, 100, 1);
// let UvsInner = [];
// let UvsOuter = [];
// for (let i = 0; i <= 100; i++) {
//   UvsInner.push(i / 100, 1);
//   UvsOuter.push(i / 100, 0);
// }

// const uvAttribute = new Float32Array([...UvsInner, ...UvsOuter]);
// saturnRingGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvAttribute), 2));

// const saturnRingMaterial = new THREE.MeshPhysicalMaterial({
//   map: new THREE.TextureLoader().load(SaturnRings),
//   side: THREE.DoubleSide,
//   transparent: true,
// });
// const saturnRings = new THREE.Mesh(
//   saturnRingGeo, saturnRingMaterial
// );
// saturnRings.rotation.x = Math.PI / 2;
// scene.add(saturnRings);




// //MOON
// const moonGeometry = new THREE.SphereGeometry(1.5, 40, 40);
// const moonMaterial = new THREE.MeshPhysicalMaterial({
//   map: new THREE.TextureLoader().load(Moon),
//   // normalMap: new THREE.TextureLoader().load(MoonNormalMap)
// });
// moonMaterial.map.colorSpace = THREE.SRGBColorSpace;
// const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// scene.add(moon);






// Sphere for the surface of the earth
const earthGeometry = new THREE.SphereGeometry(1.5, 80, 80);
const earthMaterial = new THREE.ShaderMaterial({
  fragmentShader: FragmentShader,
  vertexShader: VertexShader,
  uniforms: {
    lightDirection: { value: new THREE.Vector3(-1, -1, -1).normalize() },
    worldMap: { value: new THREE.TextureLoader().load(WorldMap) },
    earthNightLights: { value: new THREE.TextureLoader().load(EarthNightLights) },
    earthSpecularMap: { value: new THREE.TextureLoader().load(EarthSpecularMap) },
    earthNormalMap: { value: new THREE.TextureLoader().load(EarthNormalMap) },
    earthCloudCover: { value: new THREE.TextureLoader().load(CloudCover) },
  }
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);


// Sphere for cloud cover
let cloudsGeometry = new THREE.SphereGeometry(1.53, 80, 80);
const cloudsMaterial = new THREE.ShaderMaterial({
  vertexShader: CloudsVertexShader,
  fragmentShader: CloudsFragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    earthCloudCover: { value: new THREE.TextureLoader().load(CloudCover) },
    lightDirection: { value: new THREE.Vector3(-1, -1, -1).normalize() }
  }
});
let clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
scene.add(clouds);



// Sphere for atmosphere
let atmosphereGeometry = new THREE.SphereGeometry(1.55, 80, 80);
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: AtmosphereVertexShader,
  fragmentShader: AtmosphereFragmentShader,
  transparent: true,
  uniforms: {
    lightDirection: { value: new THREE.Vector3(-1, -1, -1).normalize() }
  }
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);


// Sun
const sunGeometry = new THREE.BufferGeometry();
const position = [0, 0, 0];
sunGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(position), 3));
let sunMaterial = new THREE.ShaderMaterial({
  vertexShader: SunVertexShader,
  fragmentShader: SunFragmentShader,
  transparent: true,
});
let sun = new THREE.Points(sunGeometry, sunMaterial);
sun.position.set(5, 5, 5);
scene.add(sun);



//ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001
  clouds.rotation.y += 0.001
  renderer.render(scene, camera);
}
animate();



function updateCameraAspectAndRenderSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", () => { updateCameraAspectAndRenderSize(); });



























// import MoonNormalMap from "./Resources/Moon/Moon.Normal_8192x4096.jpg";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const controls = new OrbitControls(camera, document.getElementById("display-canvas"));

// let sphereGeometry = new THREE.SphereGeometry(1.75, 40, 40);
// let sphereMaterial = new THREE.MeshPhysicalMaterial({
//   map: new THREE.TextureLoader().load("./Resources/Saturn/2k_saturn.jpg"),
//   side: THREE.DoubleSide,
//   transparent: true,
// })
// let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.rotation.x = 0.1
// scene.add(sphere);




// let sphereGeometry = new THREE.SphereGeometry(3, 40, 40);
// let sphereMaterial = new THREE.MeshPhysicalMaterial({
//   map: new THREE.TextureLoader().load("./Resources/Moon/8k_moon.jpg"),
//   normalMap: new THREE.TextureLoader().load("./Resources/Moon/Moon.Normal_8192x4096.jpg"),
//   transparent: true,
// })
// let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphere);


// let sphereGeometry = new THREE.SphereGeometry(20, 40, 40);
// let sphereMaterial = new THREE.MeshPhysicalMaterial({
//   map: new THREE.TextureLoader().load("./Resources/8k_stars_milky_way.jpg"),
//   // normalMap: new THREE.TextureLoader().load("./Resources/Moon/Moon.Normal_8192x4096.jpg"),
//   // normalScale: new THREE.Vector2(0.25, 0.25),
//   side: THREE.DoubleSide,
//   transparent: true,
// })
// let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphere);



// const geometry = new THREE.RingGeometry(2, 4, 100, 1);
// let UvsInner = [];
// let UvsOuter = [];
// for (let i = 0; i <= 100; i++) {
//   UvsInner.push(i / 100, 1);
//   UvsOuter.push(i / 100, 0);
// }

// const uvAttribute = new Float32Array([...UvsInner, ...UvsOuter]);
// geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvAttribute), 2));
// const material = new THREE.MeshPhysicalMaterial({
//   map: new THREE.TextureLoader().load("./Resources/Saturn/2k_saturn_ring_alpha.png"),
//   side: THREE.DoubleSide,
//   transparent: true,
// });
// const rings = new THREE.Mesh(geometry, material);
// scene.add(rings);







// // CONSTRUCTING A TRIANGLE
// const pos = new Float32Array([
//   -1, 0, 0,  // vertex 1 (X:-1, Y:0, Z:0)
//   1, 0, 0,  // vertex 2 (X: 1, Y:0, Z:0)
//   0, 1, 0,  // vertex 3 (X: 0, Y:1, Z:0)
// ]);

// const colors = new Float32Array([
//   1, 0, 0,  // vertex 1 (red)
//   0, 1, 0,  // vertex 2 (green)
//   0, 0, 1,  // vertex 3 (blue)
// ]);

// const normals = new Float32Array([
//   0, 0, 1,  // vertex 1 normal
//   0, 0, 1,  // vertex 2 normal
//   0, 0, 1,  // vertex 3 normal
// ]);

// const uvs = new Float32Array([
//   0, 0,  // vertex 1
//   1, 0,  // vertex 2
//   0.5, 1,  // vertex 3
// ]);




// const posBufferAttribute = new THREE.BufferAttribute(pos, 3);
// const colorAttribute = new THREE.BufferAttribute(colors, 3);
// const normalAttribute = new THREE.BufferAttribute(normals, 3);
// const uvAttribute = new THREE.BufferAttribute(uvs, 2);


// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', posBufferAttribute);
// geometry.setAttribute('color', colorAttribute);
// geometry.setAttribute('normal', normalAttribute);
// geometry.setAttribute('uv', uvAttribute);

// const indices = new Uint16Array([
//   0, 1, 2,  // face 1
// ]);

// geometry.setIndex(new THREE.BufferAttribute(indices, 1));


// const material = new THREE.MeshBasicMaterial({
//   map: new THREE.TextureLoader().load(WorldMap)
// });

// const triangle = new THREE.Mesh(geometry, material);
// scene.add(triangle);


