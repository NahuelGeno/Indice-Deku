function calcularTecho(anio) {
  const anioBase = 2000;
  const techoBase = 100;
  return techoBase + (anio - anioBase);
}

const gamesList = document.getElementById("games-list");
const form = document.getElementById("game-form");
const yearInput = document.getElementById("year");
const scoreHint = document.getElementById("score-hint");

// Elementos de filtrado
const filterSearch = document.getElementById("filter-search");
const filterEra = document.getElementById("filter-era");
const filterPlatform = document.getElementById("filter-platform");

// Cálculo dinámico en el formulario
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

// Renderizar la tabla con soporte de filtros
function renderizarTabla() {
  if (!gamesList) return;
  gamesList.innerHTML = "";

  const busqueda = filterSearch ? filterSearch.value.toLowerCase().trim() : "";
  const eraSeleccionada = filterEra ? filterEra.value : "all";
  const plataformaSeleccionada = filterPlatform ? filterPlatform.value : "all";

  const juegosFiltrados = catalogoJuegos.filter((juego) => {
    // Filtro por texto
    const coincideNombre = juego.titulo.toLowerCase().includes(busqueda);

    // Filtro por plataforma
    const coincidePlataforma =
      plataformaSeleccionada === "all" || juego.plataforma === plataformaSeleccionada;

    // Filtro por época
    let coincideEra = true;
    if (eraSeleccionada === "retro") coincideEra = juego.anio < 1990;
    else if (eraSeleccionada === "90s") coincideEra = juego.anio >= 1990 && juego.anio <= 1999;
    else if (eraSeleccionada === "00s") coincideEra = juego.anio >= 2000 && juego.anio <= 2009;
    else if (eraSeleccionada === "10s") coincideEra = juego.anio >= 2010 && juego.anio <= 2019;
    else if (eraSeleccionada === "20s") coincideEra = juego.anio >= 2020;

    return coincideNombre && coincidePlataforma && coincideEra;
  });

  if (juegosFiltrados.length === 0) {
    gamesList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No se encontraron juegos con esos filtros.</td></tr>`;
    return;
  }

  juegosFiltrados.forEach((juego) => {
    const techo = calcularTecho(juego.anio);
    const porcentaje = ((juego.puntaje / techo) * 100).toFixed(1);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${juego.titulo}</strong></td>
      <td>${juego.anio}</td>
      <td><span class="badge-platform">${juego.plataforma || "N/A"}</span></td>
      <td>${juego.puntaje} / ${techo}</td>
      <td>${techo} pts</td>
      <td><span class="badge-percent">${porcentaje}%</span></td>
    `;
    gamesList.appendChild(tr);
  });
}

// Event Listeners para los filtros en tiempo real
if (filterSearch) filterSearch.addEventListener("input", renderizarTabla);
if (filterEra) filterEra.addEventListener("change", renderizarTabla);
if (filterPlatform) filterPlatform.addEventListener("change", renderizarTabla);

// Carga inicial
renderizarTabla();

// Manejo del formulario manual (agrega a catalogoJuegos y vuelve a renderizar)
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevoJuego = {
      titulo: document.getElementById("title").value.trim(),
      anio: parseInt(document.getElementById("year").value),
      puntaje: parseFloat(document.getElementById("score").value),
      plataforma: "Manual",
      genero: "General"
    };

    catalogoJuegos.unshift(nuevoJuego);
    renderizarTabla();
    form.reset();
    scoreHint.textContent = "El techo para este año se calculará automáticamente.";
  });
}
