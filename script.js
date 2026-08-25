// script.js
function calcularTecho(anio) {
  const anioBase = 2000;
  const techoBase = 100;
  return techoBase + (anio - anioBase);
}

const gamesList = document.getElementById("games-list");
const form = document.getElementById("game-form");
const yearInput = document.getElementById("year");
const scoreHint = document.getElementById("score-hint");

// Indicador dinámico de techo al escribir el año
if (yearInput && scoreHint) {
  yearInput.addEventListener("input", (e) => {
    const anio = parseInt(e.target.value);
    if (!isNaN(anio) && anio >= 1970) {
      scoreHint.textContent = `Para el año ${anio}, el techo máximo es de ${calcularTecho(anio)} puntos.`;
    } else {
      scoreHint.textContent = "El techo para este año se calculará automáticamente.";
    }
  });
}

// Renderizar un juego en la tabla
function agregarFila(juego) {
  const techo = calcularTecho(juego.anio);
  const porcentaje = ((juego.puntaje / techo) * 100).toFixed(1);

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><strong>${juego.titulo}</strong></td>
    <td>${juego.anio}</td>
    <td>${juego.puntaje} / ${techo}</td>
    <td>${techo} pts</td>
    <td><span class="badge-percent">${porcentaje}%</span></td>
  `;
  gamesList.appendChild(tr);
}

// Cargar automáticamente todos los juegos del archivo games.js
if (typeof catalogoJuegos !== "undefined" && Array.isArray(catalogoJuegos)) {
  catalogoJuegos.forEach(agregarFila);
}

// Manejar formulario manual
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevoJuego = {
      titulo: document.getElementById("title").value.trim(),
      anio: parseInt(document.getElementById("year").value),
      puntaje: parseFloat(document.getElementById("score").value)
    };
    agregarFila(nuevoJuego);
    form.reset();
    scoreHint.textContent = "El techo para este año se calculará automáticamente.";
  });
}
