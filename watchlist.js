const watchlist =
  JSON.parse(localStorage.getItem("watchlist")) || [];

const grid =
  document.querySelector(".watchlist-grid");

if(watchlist.length === 0){
  grid.innerHTML = "<p>No asteroids added yet.</p>";
}

watchlist.forEach(name => {

  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h3>${name}</h3>
    <button onclick="removeAsteroid('${name}')">
      Remove
    </button>
  `;

  grid.appendChild(card);

});

function removeAsteroid(name){

  let list =
    JSON.parse(localStorage.getItem("watchlist")) || [];

  list = list.filter(item => item !== name);

  localStorage.setItem("watchlist", JSON.stringify(list));

  location.reload();
}
