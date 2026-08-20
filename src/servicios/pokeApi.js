// src/servicios/pokeApi.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE ARCHIVO?
// Es la ÚNICA parte de PokeVerse que sabe hablar con la PokeAPI (la red, las
// URLs, el fetch, el manejo de la respuesta). Las pantallas (PantallaInicio,
// PantallaDetalle, etc.) NUNCA llaman a "fetch" directamente: en su lugar,
// llaman a las funciones que exportamos aquí.
//
// ¿POR QUÉ EXISTE? (separación de responsabilidades)
// Si mañana la PokeAPI cambiara de dirección, o quisiéramos agregar caché, o
// cambiar de PokeAPI a otra fuente de datos, solo tendríamos que tocar ESTE
// archivo. Ninguna pantalla necesitaría cambiar, porque ellas solo conocen
// funciones como "obtenerListaPokemon(...)", no los detalles de cómo se
// consiguen esos datos. Esto es lo que en arquitectura de software se llama
// una "capa de servicios".
// -----------------------------------------------------------------------------

import { API_URL, LIMITE_POR_PAGINA } from '../utils/constantes';
import { transformarPokemon } from '../utils/transformadores';

/**
 * obtenerListaPokemon
 * -----------------------------------------------------------------------
 * Pide a la PokeAPI un "bloque" de Pokémon (útil para la lista principal y
 * para el filtro de generación, que solo cambia el offset).
 *
 * Internamente hace dos pasos, porque así funciona la PokeAPI:
 *   1) Pide la lista resumida (solo nombre + url de cada Pokémon).
 *   2) Por cada uno, pide su detalle completo (imagen, tipos, stats...).
 * Usamos Promise.all para lanzar todas las peticiones del paso 2 en paralelo
 * y esperar a que todas terminen antes de continuar (más rápido que pedirlas
 * una por una).
 *
 * @param {number} offset - desde qué posición empezar (0 = el primer Pokémon)
 * @param {number} limit - cuántos Pokémon traer
 * @returns {Promise<object[]>} array de Pokémon ya transformados
 */
export async function obtenerListaPokemon(offset = 0, limit = LIMITE_POR_PAGINA) {
  const respuestaLista = await fetch(
    `${API_URL}/pokemon?offset=${offset}&limit=${limit}`
  );

  if (!respuestaLista.ok) {
    throw new Error('No se pudo obtener la lista de pokemon.');
  }

  const datosLista = await respuestaLista.json();

  // Por cada elemento de la lista resumida, pedimos su detalle completo.
  const detalles = await Promise.all(
    datosLista.results.map(async (pokemonResumido) => {
      const respuestaDetalle = await fetch(pokemonResumido.url);
      const detalle = await respuestaDetalle.json();
      return transformarPokemon(detalle);
    })
  );

  return detalles;
}

/**
 * obtenerPokemonPorNombre
 * -----------------------------------------------------------------------
 * Busca UN pokemon exacto por su nombre (o id) directamente en la PokeAPI.
 * Se usa en la búsqueda en tiempo real de PantallaInicio (Sprint 4).
 *
 * @param {string} nombre - nombre (en minúsculas) o id del Pokémon
 * @returns {Promise<object>} el Pokémon transformado
 * @throws {Error} si el Pokémon no existe (la API responde 404)
 */
export async function obtenerPokemonPorNombre(nombre) {
  const respuesta = await fetch(`${API_URL}/pokemon/${nombre}`);

  if (!respuesta.ok) {
    throw new Error(`No se encontró "${nombre}" en la Pokédex.`);
  }

  const detalle = await respuesta.json();
  return transformarPokemon(detalle);
}
