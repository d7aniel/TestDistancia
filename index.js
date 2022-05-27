var texto = document.createElement("div");
var titulo = document.createElement("h1");
var subtitulo = document.createElement("h2");
texto.style.position = "absolute";
texto.style.top = "10px";
texto.style.left = "50%";
texto.style.transform = "translate(-50%,0%)";

titulo.style.color = "#ffffff";
subtitulo.style.color = "#ffffff";
titulo.style.textAlign = "center";
subtitulo.style.textAlign = "center";

titulo.innerText = "Version v0.14";
subtitulo.innerText = "espere";

texto.append(titulo);
texto.append(subtitulo);
document.body.append(texto);

function isMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    return true;
  }
  return false;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#canvas1") });

const geom = new THREE.BoxGeometry(20, 20, 20);

const threex = new THREEx.LocationBased(scene, camera);

// You can change the minimum GPS accuracy needed to register a position - by default 1000m
//const threex = new THREEx.LocationBased(scene, camera. { gpsMinAccuracy: 30 } );
const cam = new THREEx.WebcamRenderer(renderer, "#video1");

const oneDegAsRad = THREE.Math.degToRad(1);

let orientationControls;

if (isMobile()) {
  orientationControls = new THREEx.DeviceOrientationControls(camera);
}

let fake = null;
let first = true;

threex.on("gpsupdate", (pos) => {
  console.log("gpsupdate");
  if (first) {
    setupObjects(pos.coords.longitude, pos.coords.latitude);
    first = false;
  }
});

threex.on("gpserror", (code) => {
  alert(`GPS error: code ${code}`);
});

// Uncomment to use a fake GPS location
//fake = { lat: 51.05, lon : -0.72 };
if (fake) {
  threex.fakeGps(fake.lon, fake.lat);
} else {
  threex.startGps();
}

requestAnimationFrame(render);

let mousedown = false,
  lastX = 0;

// Mouse events for testing on desktop machine
if (!isMobile()) {
  window.addEventListener("mousedown", (e) => {
    mousedown = true;
  });

  window.addEventListener("mouseup", (e) => {
    mousedown = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!mousedown) return;
    if (e.clientX < lastX) {
      camera.rotation.y -= oneDegAsRad;
      if (camera.rotation.y < 0) {
        camera.rotation.y += 2 * Math.PI;
      }
    } else if (e.clientX > lastX) {
      camera.rotation.y += oneDegAsRad;
      if (camera.rotation.y > 2 * Math.PI) {
        camera.rotation.y -= 2 * Math.PI;
      }
    }
    lastX = e.clientX;
  });
}

function render(time) {
  resizeUpdate();
  if (orientationControls) orientationControls.update();
  cam.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resizeUpdate() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth,
    height = canvas.clientHeight;
  if (width != canvas.width || height != canvas.height) {
    renderer.setSize(width, height, false);
  }
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

function setupObjects(longitude, latitude) {
  // Use position of first GPS update (fake or real)
  if (first) {
    subtitulo.innerText = "";
    subtitulo.innerText += "Longitud: " + longitude + "\n";
    subtitulo.innerText += "Laditude: " + latitude + "\n";
  }
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const material4 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  threex.add(new THREE.Mesh(geom, material), -58.004631025617414, -34.88441873744777); // slightly north
  threex.add(new THREE.Mesh(geom, material2), -58.005845, -34.88645); // slightly south
  threex.add(new THREE.Mesh(geom, material3), -58.004916, -34.887014); // slightly west
  threex.add(new THREE.Mesh(geom, material4), longitude + 0.001, latitude); // slightly east
}
