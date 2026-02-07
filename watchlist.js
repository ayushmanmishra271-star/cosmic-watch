document.addEventListener("DOMContentLoaded", () => {

const grid = document.querySelector(".watchlist-grid");

let watchlist =
JSON.parse(localStorage.getItem("watchlist")) || [];

/* ================= EMPTY STATE ================= */

if(watchlist.length === 0){

grid.innerHTML = `
<div class="empty-watchlist">
🚀 No Asteroids Being Monitored
<br>
Track objects from dashboard to begin surveillance.
</div>
`;

return;
}

/* ================= SORT BY RISK ================= */

const riskPriority = {
"CRITICAL": 4,
"HIGH": 3,
"MEDIUM": 2,
"LOW": 1
};

watchlist.sort((a,b) =>
riskPriority[b.risk] - riskPriority[a.risk]
);

/* ================= DISPLAY WATCHLIST ================= */

watchlist.forEach(ast => {

const card = document.createElement("div");
card.classList.add("card");

/* Countdown calculation */
const days = getCountdown(ast.date);

card.innerHTML = `
<h3>${ast.name}</h3>

<p>Velocity: ${Math.round(ast.velocity)} km/h</p>
<p>Distance: ${Math.round(ast.distance)} km</p>

<span class="risk ${ast.risk.toLowerCase()}">
${ast.risk}
</span>

<p class="countdown">${days} days remaining</p>

<button class="remove-btn"
onclick="removeAsteroid('${ast.name}')">
Stop Tracking
</button>
`;

grid.appendChild(card);

});

});

/* ================= REMOVE ASTEROID ================= */

function removeAsteroid(name){

let list =
JSON.parse(localStorage.getItem("watchlist")) || [];

list = list.filter(ast => ast.name !== name);

localStorage.setItem("watchlist", JSON.stringify(list));

showToast(`${name} removed from watchlist`);

setTimeout(() => location.reload(), 800);
}

/* ================= COUNTDOWN ================= */

function getCountdown(date){

const today = new Date();
const approach = new Date(date);

const diff = approach - today;

return Math.ceil(diff / (1000*60*60*24));
}

/* ================= TOAST NOTIFICATION ================= */

function showToast(msg){

const toast = document.createElement("div");
toast.className = "toast";
toast.textContent = msg;

document.body.appendChild(toast);

setTimeout(() => toast.remove(), 3000);
}
