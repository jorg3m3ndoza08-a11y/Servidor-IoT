window.addEventListener("load", () => {

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const estado = document.getElementById("estado");
const nombreHTML = document.getElementById("nombre");
const distanciaHTML = document.getElementById("distancia");
const rangoHTML = document.getElementById("rango");
const latHTML = document.getElementById("latitud");
const lonHTML = document.getElementById("longitud");


// NOMBRE DEL ALUMNO
const nombreAlumno = "Tu Nombre";


// COORDENADAS DEL AULA
const LAT_AULA = 19.978875960395033;
const LON_AULA = -98.68597997638054;


// VARIABLES
let rostroDetectado = false;
let alumnoDescriptor = null;


// CAMARA
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {

video.srcObject = stream;

});


// VOZ
function hablar(texto){

const msg = new SpeechSynthesisUtterance(texto);

msg.lang = "es-MX";
msg.rate = 0.9;
msg.pitch = 0.8;

speechSynthesis.speak(msg);

}


// GPS
function obtenerUbicacion(){

return new Promise((resolve,reject)=>{

navigator.geolocation.getCurrentPosition(
pos => resolve(pos.coords),
err => reject(err),
{ enableHighAccuracy:true }
);

});

}


// DISTANCIA GPS
function calcularDistancia(lat1,lon1,lat2,lon2){

const R = 6371000;

const dLat = (lat2-lat1)*Math.PI/180;
const dLon = (lon2-lon1)*Math.PI/180;

const a =
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*Math.sin(dLon/2);

const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return R*c;

}


// CARGAR IA
async function iniciarIA(){

await faceapi.nets.tinyFaceDetector.loadFromUri(
"https://justadudewhohacks.github.io/face-api.js/models"
);

await faceapi.nets.faceLandmark68Net.loadFromUri(
"https://justadudewhohacks.github.io/face-api.js/models"
);

await faceapi.nets.faceRecognitionNet.loadFromUri(
"https://justadudewhohacks.github.io/face-api.js/models"
);


// FOTO DEL ALUMNO
const img = await faceapi.fetchImage("alumno.jpg");

const alumno = await faceapi
.detectSingleFace(
img,
new faceapi.TinyFaceDetectorOptions()
)
.withFaceLandmarks()
.withFaceDescriptor();

if(!alumno){

console.log("No se detectó rostro en alumno.jpg");
return;

}

alumnoDescriptor = alumno.descriptor;

console.log("Modelo alumno cargado");

detectar();

}


// INICIAR IA
video.addEventListener("play", iniciarIA);


// DETECCION
async function detectar(){

const detections = await faceapi
.detectAllFaces(
video,
new faceapi.TinyFaceDetectorOptions({
inputSize:320,
scoreThreshold:0.6
})
)
.withFaceLandmarks()
.withFaceDescriptors();


// LIMPIAR
ctx.clearRect(0,0,canvas.width,canvas.height);


// SI HAY ROSTRO
if(detections.length > 0){

const det = detections[0];
const box = det.detection.box;


// DIBUJAR CUADRO
ctx.strokeStyle = "#00ff00";
ctx.lineWidth = 3;

ctx.strokeRect(
box.x,
box.y,
box.width,
box.height
);


// COMPARAR ROSTRO
const distanciaCara = faceapi.euclideanDistance(
det.descriptor,
alumnoDescriptor
);

console.log("Distancia rostro:",distanciaCara);


// SI ES EL ALUMNO
if(distanciaCara < 0.6 && !rostroDetectado){

rostroDetectado = true;

nombreHTML.innerText = nombreAlumno;

try{

const coords = await obtenerUbicacion();

latHTML.innerText = coords.latitude;
lonHTML.innerText = coords.longitude;

const distanciaGPS = calcularDistancia(
coords.latitude,
coords.longitude,
LAT_AULA,
LON_AULA
);

distanciaHTML.innerText =
Math.round(distanciaGPS) + " metros";


// RANGO
const RANGO = 0.00006;

if(
coords.latitude >= LAT_AULA - RANGO &&
coords.latitude <= LAT_AULA + RANGO &&
coords.longitude >= LON_AULA - RANGO &&
coords.longitude <= LON_AULA + RANGO
){

estado.innerText =
"Alumno detectado dentro del aula";

rangoHTML.innerText = "SI";

hablar("Alumno verificado");

fetch("/Comando?texto=prende verde");

}else{

estado.innerText =
"Fuera del rango de 6 metros";

rangoHTML.innerText = "NO";

}

}catch(e){

console.log("Error GPS");

}

}

}


// SIN ROSTRO
else{

if(rostroDetectado){

rostroDetectado = false;

estado.innerText =
"Rostro perdido";

nombreHTML.innerText = "---";
distanciaHTML.innerText = "---";
rangoHTML.innerText = "---";
latHTML.innerText = "---";
lonHTML.innerText = "---";

hablar("Usuario ausente");

fetch("/Comando?texto=apaga verde");

}

}


// LOOP
setTimeout(detectar,300);

}

});
