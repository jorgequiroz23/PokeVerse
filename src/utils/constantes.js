// src/utils/constantes.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE ARCHIVO?
// Reúne en un solo lugar todos los valores "fijos" que varias pantallas y
// componentes de PokeVerse necesitan: las URLs de la PokeAPI, los colores
// oficiales de cada tipo de Pokémon y la lista de generaciones.
//
// ¿POR QUÉ EXISTE?
// Si estos valores estuvieran copiados dentro de cada componente, cambiar un
// color o una URL implicaría editar muchos archivos y sería muy fácil que se
// nos olvidara alguno. Al centralizarlos aquí, cualquier cambio se hace UNA
// sola vez y se refleja en toda la aplicación (principio DRY: "Don't Repeat
// Yourself" / "No te repitas").
// -----------------------------------------------------------------------------

// URL base de la PokeAPI (documentación oficial: https://pokeapi.co/docs/v2).
// A partir de esta URL construimos todas las llamadas de red de la app.
export const API_URL = 'https://pokeapi.co/api/v2';

// URL base de las imágenes oficiales de cada Pokémon (arte oficial en alta
// calidad). Se le agrega el id del Pokémon + ".png" para formar la URL final.
export const BASE_IMG =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// Cuántos Pokémon se piden a la PokeAPI cada vez que cargamos una "página"
// de la lista principal (lo usa PantallaInicio en el Sprint 2).
export const LIMITE_POR_PAGINA = 20;

// Tiempo en milisegundos que la búsqueda espera después de que el usuario
// deja de escribir, antes de llamar a la PokeAPI (ver Sprint 4, "debounce").
export const TIEMPO_DEBOUNCE_MS = 600;

// Clave que usamos para guardar y leer los favoritos en AsyncStorage.
// Usar un prefijo ("pokeverse_") evita choques con otras apps que usen
// el mismo dispositivo/simulador durante el desarrollo con Expo Go.
export const CLAVE_FAVORITOS = 'pokeverse_favoritos';

// -----------------------------------------------------------------------------
// TRADUCCION_TIPOS
// -----------------------------------------------------------------------------
// La PokeAPI siempre devuelve los tipos de cada Pokémon EN INGLÉS (fire,
// water, grass...), sin importar el idioma de tu app. Como el resto de
// PokeVerse (COLORES_TIPO, FONDOS_TIPO, TIPOS_DISPONIBLES, los filtros de
// PantallaFavoritos) está escrito en español, necesitamos traducir cada tipo
// justo cuando llega de la API, en utils/transformadores.js. Así, para el
// resto de la app, un Pokémon SIEMPRE tiene sus tipos en español y nunca hay
// que volver a pensar en el idioma original.
//
// Antes de esta traducción, tipos como "fire" o "water" no coincidían con
// ninguna clave de COLORES_TIPO/FONDOS_TIPO (que están en español), por eso
// se veían con el color gris de respaldo y no aparecían al filtrar por tipo
// en PantallaFavoritos. Solo "normal" y "dragon" funcionaban, porque esas
// dos palabras se escriben igual en inglés y en español.
// -----------------------------------------------------------------------------
export const TRADUCCION_TIPOS = {
  normal: 'normal',
  fire: 'fuego',
  water: 'agua',
  electric: 'electrico',
  grass: 'planta',
  ice: 'hielo',
  fighting: 'lucha',
  poison: 'veneno',
  ground: 'tierra',
  flying: 'volador',
  psychic: 'psiquico',
  bug: 'bicho',
  rock: 'roca',
  ghost: 'fantasma',
  dragon: 'dragon',
  dark: 'siniestro',
  steel: 'acero',
  fairy: 'hada',
};

// -----------------------------------------------------------------------------
// COLORES_TIPO
// -----------------------------------------------------------------------------
// Objeto que asocia cada tipo de Pokémon (la clave, en español porque toda la
// app usa nombres en español) con su color oficial de los juegos. Lo usan:
// - InsigniasTipo.js: para pintar el fondo de la insignia.
// - TarjetaPokemon.js: para el color de fondo suave de la tarjeta.
// - PantallaDetalle.js: para el color del encabezado.
// -----------------------------------------------------------------------------
export const COLORES_TIPO = {
  normal: '#A8A878',
  fuego: '#F08030',
  agua: '#6890F0',
  electrico: '#F8D030',
  planta: '#78C850',
  hielo: '#98D8D8',
  lucha: '#C03028',
  veneno: '#A040A0',
  tierra: '#E0C068',
  volador: '#A890F0',
  psiquico: '#F85888',
  bicho: '#A8B820',
  roca: '#B8A038',
  fantasma: '#705898',
  dragon: '#7038F8',
  siniestro: '#705848',
  acero: '#B8B8D0',
  hada: '#EE99AC',
};

// -----------------------------------------------------------------------------
// FONDOS_TIPO
// -----------------------------------------------------------------------------
// Igual que COLORES_TIPO, pero en tonos pastel/claros. Se usa como fondo de
// las tarjetas de la lista, para que se vean vistosas sin perder legibilidad
// del texto oscuro que va encima.
// -----------------------------------------------------------------------------
export const FONDOS_TIPO = {
  normal: '#F0F0F0',
  fuego: '#FDEBD0',
  agua: '#D6EAF8',
  electrico: '#FEF9E7',
  planta: '#D5F5E3',
  hielo: '#D6EAF8',
  lucha: '#FADBD8',
  veneno: '#E8DAEF',
  tierra: '#FDEBD0',
  volador: '#EBF5FB',
  psiquico: '#FDEDEC',
  bicho: '#EAFAF1',
  roca: '#F5EEF8',
  fantasma: '#EBF5FB',
  dragon: '#EAF2FF',
  siniestro: '#F2F3F4',
  acero: '#EAF2FF',
  hada: '#FDEEF9',
};

// -----------------------------------------------------------------------------
// TIPOS_DISPONIBLES
// -----------------------------------------------------------------------------
// Lista de tipos que se muestra en el selector horizontal de filtros de
// PantallaFavoritos (Sprint 5). Empieza con "todos" porque ese es el filtro
// por defecto (muestra todos los favoritos sin filtrar).
// -----------------------------------------------------------------------------
export const TIPOS_DISPONIBLES = [
  'todos',
  'fuego',
  'agua',
  'planta',
  'electrico',
  'psiquico',
  'hielo',
  'dragon',
  'siniestro',
  'hada',
  'normal',
  'lucha',
  'veneno',
  'tierra',
  'volador',
  'bicho',
  'roca',
  'fantasma',
  'acero',
];

// -----------------------------------------------------------------------------
// GENERACIONES
// -----------------------------------------------------------------------------
// Cada generación de Pokémon corresponde a un rango de ids consecutivos en la
// PokeAPI. "offset" es desde qué posición empezamos a pedir Pokémon y "limit"
// es cuántos pedimos. Lo usa el selector de generación de PantallaInicio
// (Sprint 5) para recargar la lista cuando el usuario cambia de generación.
// -----------------------------------------------------------------------------
export const GENERACIONES = [
  { label: 'Gen 1', offset: 0,   limit: 151 }, // 1-151 (Kanto)
  { label: 'Gen 2', offset: 151, limit: 100 }, // 152-251 (Johto)
  { label: 'Gen 3', offset: 251, limit: 135 }, // 252-386 (Hoenn)
  { label: 'Gen 4', offset: 386, limit: 107 }, // 387-493 (Sinnoh)
  { label: 'Gen 5', offset: 493, limit: 156 }, // 494-649 (Unova)
  { label: 'Gen 6', offset: 649, limit: 72  }, // 650-721 (Kalos)
  { label: 'Gen 7', offset: 721, limit: 88  }, // 722-809 (Alola)
  { label: 'Gen 8', offset: 809, limit: 96  }, // 810-905 (Galar)
];
