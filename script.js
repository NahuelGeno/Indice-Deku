// Función central de tu metodología
function calcularTecho(anio) {
  const anioBase = 2000;
  const techoBase = 100;
  return techoBase + (anio - anioBase);
}

// Datos iniciales de prueba
const catalogoInicial = [
  { titulo: "Super Mario World", anio: 1990, puntaje: 88 },
  { titulo: "Unreal Tournament", anio: 1999, puntaje: 97 },
  { titulo: "Half-Life 2", anio: 2004, puntaje: 102 },
  { titulo: "Elden Ring", anio: 2022, puntaje: 118 }
];

const gamesList = document.getElementById("games-list");
const form = document.getElementById("game-form");
const yearInput = document.getElementById("year");
const scoreHint = document.getElementById("score-hint");

// Actualizar indicador dinámico del techo en el formulario
yearInput.addEventListener("input", (e) => {
  const anio = parseInt(e.target.value);
  if (!isNaN(anio) && anio >= 1970) {
    const techo = calcularTecho(anio);
    scoreHint.textContent = `Para el año ${anio}, el techo máximo es de ${techo} puntos.`;
  } else {
    scoreHint.textContent = "El techo para este año se calculará automáticamente.";
  }
});

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

// Cargar catálogo inicial
catalogoInicial.forEach(agregarFila);

// Manejar el formulario para agregar nuevos juegos
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