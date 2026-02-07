// ---------------- SECTION SWITCHING ----------------

function showSection(id){

document.querySelectorAll(".section")
.forEach(sec => sec.classList.remove("active"));

document.getElementById(id).classList.add("active");

}

// ---------------- RISK ENGINE ----------------

function calculateRisk(asteroid){

let score = 0;

const distance =
asteroid.close_approach_data[0].miss_distance.kilometers;

const velocity =
asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;

if(asteroid.is_potentially_hazardous_asteroid) score += 50;
if(distance < 1000000) score += 30;
if(velocity > 30000) score += 20;

if(score >= 70) return "CRITICAL";
if(score >= 40) return "HIGH";
if(score >= 20) return "MEDIUM";

return "LOW";
}

// ---------------- COUNTDOWN ----------------

function getCountdown(date){

const today = new Date();
const approach = new Date(date);

const diff = approach - today;

return Math.ceil(diff / (1000*60*60*24)) + " days remaining";

}

// ---------------- WATCHLIST ----------------

function watchAsteroid(name){

let watchlist =
JSON.parse(localStorage.getItem("watchlist")) || [];

watchlist.push(name);

localStorage.setItem("watchlist", JSON.stringify(watchlist));

alert(name + " added to watchlist");

}

// ---------------- DISPLAY ASTEROID FEED ----------------

function displayAsteroids(list){

const grid = document.querySelector(".asteroid-grid");

grid.innerHTML = "";

list.forEach(asteroid => {

if(!asteroid.close_approach_data.length) return;

const name = asteroid.name;

const velocity =
asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;

const distance =
asteroid.close_approach_data[0].miss_distance.kilometers;

const date =
asteroid.close_approach_data[0].close_approach_date;

const risk = calculateRisk(asteroid);

const card = document.createElement("div");
card.classList.add("card");

if(risk === "CRITICAL"){
card.style.border = "2px solid red";
}

card.innerHTML = `
<h3>${name}</h3>

<p>Velocity: ${Math.round(velocity)} km/h</p>
<p>Distance: ${Math.round(distance)} km</p>

<span class="risk ${risk.toLowerCase()}">${risk}</span>

<p class="countdown">${getCountdown(date)}</p>

<button onclick="watchAsteroid('${name}')">
Watch
</button>
`;

grid.appendChild(card);

});

}

// ---------------- ALERT PANEL ----------------

function showAlerts(list){

const alertBox = document.querySelector(".alert-panel");

alertBox.innerHTML = "";

list.forEach(ast => {

if(!ast.close_approach_data.length) return;

const risk = calculateRisk(ast);

if(risk === "CRITICAL" || risk === "HIGH"){

const alert = document.createElement("p");

alert.textContent =
`${ast.name} → ${risk} threat detected`;

alertBox.appendChild(alert);

}

});

}

// ---------------- RISK PANEL ----------------

function displayRisk(list){

const panel = document.querySelector(".risk-panel");

panel.innerHTML = "";

list.forEach(ast => {

if(!ast.close_approach_data.length) return;

const risk = calculateRisk(ast);

if(risk === "HIGH" || risk === "CRITICAL"){

const p = document.createElement("p");

p.textContent = `${ast.name} classified as ${risk}`;

panel.appendChild(p);

}

});

}

// ---------------- FETCH NASA DATA ----------------

async function fetchAsteroids(){

const res = await fetch(
"https://api.nasa.gov/neo/rest/v1/feed?api_key=L4li04ZSE4Q8RTbYSoKgtt4QdaQ1OcX5BGWVfMbD"
);

const data = await res.json();

const objects = data.near_earth_objects;

let asteroidList = [];

for(let date in objects){
asteroidList = asteroidList.concat(objects[date]);
}

// SERIAL EXECUTION ORDER

displayAsteroids(asteroidList);
showAlerts(asteroidList);
displayRisk(asteroidList);

}

// ---------------- START APP ----------------

fetchAsteroids();
