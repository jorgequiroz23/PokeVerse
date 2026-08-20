// src/utils/transformadores.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE ARCHIVO?
// La PokeAPI devuelve los datos de un Pokémon en un formato muy grande y con
// nombres de propiedades en inglés (types, stats, abilities, height, weight...
// y anidados dentro de objetos más complejos de lo que necesitamos). Este
// archivo tiene UNA sola función, "transformarPokemon", que toma ese objeto
// "crudo" y devuelve un objeto simple y en español con solo lo que PokeVerse
// usa en pantalla.
//
// ¿POR QUÉ EXISTE?
// Sin esta función, tendríamos que repetir la misma lógica de transformación
// dentro de PantallaInicio (al cargar la lista) y dentro de cualquier otro
// lugar donde pidamos un Pokémon (por ejemplo, al buscar por nombre). Al
// tenerla en un solo archivo, evitamos duplicar código y si la PokeAPI
// cambiara su formato, solo tendríamos que arreglar este archivo.
// -----------------------------------------------------------------------------

import { BASE_IMG, TRADUCCION_TIPOS } from './constantes';

/**
 * traducirTipo
 * -----------------------------------------------------------------------
 * Traduce el nombre de un tipo tal como lo entrega la PokeAPI (en inglés,
 * ej: "fire") a su equivalente en español (ej: "fuego"), usando la tabla
 * TRADUCCION_TIPOS de utils/constantes.js. Si apareciera un tipo que no
 * está en la tabla (no debería pasar, pero por seguridad), devolvemos el
 * texto original en vez de romper la app.
 *
 * @param {string} tipoIngles - nombre de tipo en inglés, ej: "fire"
 * @returns {string} nombre de tipo en español, ej: "fuego"
 */
function traducirTipo(tipoIngles) {
  return TRADUCCION_TIPOS[tipoIngles] || tipoIngles;
}

/**
 * transformarPokemon
 * -----------------------------------------------------------------------
 * Recibe el objeto "detalle" tal cual lo devuelve la PokeAPI en el endpoint
 * GET /pokemon/{id o nombre} y devuelve un objeto plano con la forma que usa
 * PokeVerse en toda la app:
 *
 * {
 *   id: number,
 *   nombre: string,
 *   imagen: string (URL),
 *   tipos: string[],
 *   stats: { nombre: string, valor: number }[],
 *   habilidades: string[],
 *   altura: number (decímetros, tal como lo entrega la API),
 *   peso: number (hectogramos, tal como lo entrega la API),
 * }
 *
 * @param {object} detalle - objeto crudo devuelto por la PokeAPI
 * @returns {object} objeto Pokémon en el formato interno de PokeVerse
 */
export function transformarPokemon(detalle) {
  return {
    id: detalle.id,
    nombre: detalle.name,
    // Formamos la URL de la imagen oficial usando el id del Pokémon.
    imagen: `${BASE_IMG}/${detalle.id}.png`,
    // detalle.types es un array de objetos { type: { name: 'fire' } }.
    // Con .map() nos quedamos solo con el nombre de cada tipo Y lo
    // traducimos al español con traducirTipo(), para que todo el resto de
    // la app (colores, filtros, insignias) trabaje siempre en español.
    tipos: detalle.types.map((t) => traducirTipo(t.type.name)),
    // detalle.stats es un array de objetos { base_stat, stat: { name } }.
    // Lo convertimos a un array más simple: { nombre, valor }.
    stats: detalle.stats.map((s) => ({
      nombre: s.stat.name,
      valor: s.base_stat,
    })),
    // detalle.abilities es un array de objetos { ability: { name } }.
    // Nos quedamos solo con el nombre de cada habilidad.
    habilidades: detalle.abilities.map((a) => a.ability.name),
    altura: detalle.height,
    peso: detalle.weight,
  };
}
