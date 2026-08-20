// src/componentes/ListaPokemon.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Envuelve un FlatList (la forma nativa y eficiente de pintar listas largas
// en React Native) configurado en grilla de 2 columnas. Recibe el array de
// Pokémon a mostrar y una función a ejecutar cuando se toca cada uno.
//
// ¿POR QUÉ FlatList Y NO .map() DENTRO DE UN ScrollView?
// FlatList solo dibuja en memoria los elementos que están visibles en
// pantalla (más un pequeño margen). Si la lista tuviera 1000 Pokémon, un
// ScrollView con .map() los renderizaría TODOS de una vez (lento y consume
// mucha memoria); FlatList solo renderiza los 8-10 que caben en pantalla.
// Además trae gratis funciones como el "ListEmptyComponent" que usamos aquí
// para el caso de una búsqueda sin resultados.
// -----------------------------------------------------------------------------

import { FlatList, View, Text, StyleSheet } from 'react-native';
import TarjetaPokemon from './TarjetaPokemon';
import { colores } from '../estilos/colores';

/**
 * @param {{
 *   listaPokemon: object[],
 *   onPressPokemon: (pokemon: object) => void,
 *   esFavorito?: (id: number) => boolean,
 * }} props
 * @param {object[]} props.listaPokemon - array de Pokémon a mostrar
 * @param {(pokemon: object) => void} props.onPressPokemon - función que se
 *        llama con el Pokémon completo cuando el usuario toca una tarjeta
 * @param {(id: number) => boolean} [props.esFavorito] - función opcional que
 *        indica si un id de Pokémon está en favoritos, para pintar el
 *        corazón en la tarjeta correspondiente
 */
export default function ListaPokemon({ listaPokemon, onPressPokemon, esFavorito }) {
  return (
    <FlatList
      data={listaPokemon}
      // renderItem recibe un objeto { item } por cada elemento del array: es
      // la convención de FlatList. Con destructuring extraemos "item"
      // directamente en los parámetros de la función flecha.
      renderItem={({ item }) => (
        <TarjetaPokemon
          pokemon={item}
          onPress={() => onPressPokemon(item)}
          esFavorito={esFavorito ? esFavorito(item.id) : false}
        />
      )}
      // keyExtractor DEBE devolver un string único por elemento. El id de
      // Pokémon es number, por eso lo convertimos con .toString().
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={estilos.contenedor}
      // Se muestra automáticamente cuando "data" es un array vacío: lo
      // aprovechamos para el caso de "la búsqueda no encontró resultados".
      ListEmptyComponent={() => (
        <View style={estilos.vacio}>
          <Text style={estilos.textoVacio}>No hay pokemon para mostrar</Text>
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    padding: 6,
    // flexGrow: 1 permite que ListEmptyComponent se pueda centrar
    // verticalmente aunque no haya elementos que "empujen" el contenido.
    flexGrow: 1,
  },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  textoVacio: {
    fontSize: 16,
    color: colores.textoClaro,
  },
});
