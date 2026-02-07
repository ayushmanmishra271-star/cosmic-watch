async function fetchAsteroids(){

  const res = await fetch(
    "https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY"
  );

  const data = await res.json();

  const objects = data.near_earth_objects;

  let asteroidList = [];

  for (let date in objects){
    asteroidList = asteroidList.concat(objects[date]);
  }

  displayAsteroids(asteroidList);
}

function calculateRisk(hazardous, distance){

  let score = 0;

  if(hazardous) score += 50;
  if(distance < 1000000) score += 30;

  if(score >= 70) return "CRITICAL";
  if(score >= 40) return "HIGH";
  if(score >= 20) return "MEDIUM";

  return "LOW";
}

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

    const hazardous =
      asteroid.is_potentially_hazardous_asteroid;

    const risk = calculateRisk(hazardous, distance);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${name}</h3>
      <p>Velocity: ${Math.round(velocity)} km/h</p>
      <p>Distance: ${Math.round(distance)} km</p>

      <span class="risk ${risk.toLowerCase()}">${risk}</span>

      <button onclick="watchAsteroid('${name}')">
        Watch
      </button>
    `;

    grid.appendChild(card);
  });
}

function watchAsteroid(name){
  alert(name + " added to watchlist");
}

fetchAsteroids();
