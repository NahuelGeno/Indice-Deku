// fetch_games.js
const fs = require('fs');

const API_KEY = '24f506e2265a4f77acbbac1d43c4fd4a'; // Reemplaza con tu API key de RAWG
const TOTAL_PAGINAS = 5; // 40 juegos por página = 200 juegos en total

function calcularTecho(anio) {
  const anioBase = 2000;
  const techoBase = 100;
  return techoBase + (anio - anioBase);
}

async function descargarCatalogo() {
  console.log('Iniciando descarga de juegos desde RAWG...');
  const todosLosJuegos = [];

  for (let pagina = 1; pagina <= TOTAL_PAGINAS; pagina++) {
    console.log(`Consultando página ${pagina} de ${TOTAL_PAGINAS}...`);
    
    // Trae los juegos ordenados por puntuación de Metacritic
    const url = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-metacritic&page_size=40&page=${pagina}`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results) break;

      data.results.forEach((game) => {
        if (!game.released || !game.metacritic) return;

        const anio = new Date(game.released).getFullYear();
        const techo = calcularTecho(anio);
        
        // Conversión a la escala temporal
        const puntajeTemporal = parseFloat(((game.metacritic / 100) * techo).toFixed(1));
        const plataformaPrincipal = game.platforms && game.platforms.length > 0
          ? game.platforms[0].platform.name
          : 'Multiplataforma';
        const generoPrincipal = game.genres && game.genres.length > 0
          ? game.genres[0].name
          : 'General';

        todosLosJuegos.push({
          titulo: game.name,
          anio: anio,
          puntaje: puntajeTemporal,
          metascoreBase: game.metacritic,
          plataforma: plataformaPrincipal,
          genero: generoPrincipal
        });
      });
    } catch (err) {
      console.error(`Error en página ${pagina}:`, err);
    }
  }

  // Generar contenido para games.js
  const contenidoArchivo = `// Base de datos estática generada automáticamente desde RAWG
const catalogoJuegos = ${JSON.stringify(todosLosJuegos, null, 2)};
`;

  fs.writeFileSync('games.js', contenidoArchivo, 'utf-8');
  console.log(`\n¡Listo! Se guardaron ${todosLosJuegos.length} juegos procesados en games.js`);
}

descargarCatalogo();
