// src/componentes/TarjetaPokemon.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Es la "tarjeta" individual que representa un Pokémon dentro de una grilla
// (lo usa ListaPokemon.js dentro de un FlatList). Muestra: el número de
// Pokédex, la imagen oficial, el nombre, sus insignias de tipo y, si
// corresponde, un corazón en la esquina indicando que es favorito.
//
// ¿CÓMO RECIBE LOS DATOS?
// TarjetaPokemon NO sabe nada de la PokeAPI ni de cómo se cargan los datos:
// solo recibe un objeto "pokemon" ya listo por props (ver
// utils/transformadores.js) y una función "onPress" que se ejecuta cuando el
// usuario toca la tarjeta. Esto la hace 100% reutilizable: a este componente
// le da igual si el pokemon viene de la lista principal, de una búsqueda o
// de favoritos.
// -----------------------------------------------------------------------------

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import InsigniasTipo from './InsigniasTipo';
import { FONDOS_TIPO } from '../utils/constantes';
import { colores } from '../estilos/colores';

/**
 * @param {{
 *   pokemon: object,
 *   onPress: () => void,
 *   esFavorito?: boolean,
 * }} props
 * @param {object} props.pokemon - objeto Pokémon transformado (ver
 *        utils/transformadores.js): { id, nombre, imagen, tipos, ... }
 * @param {() => void} props.onPress - función que se llama al tocar la
 *        tarjeta (normalmente navega a PantallaDetalle)
 * @param {boolean} [props.esFavorito] - si es true, muestra un corazón en la
 *        esquina superior derecha de la tarjeta
 */
export default function TarjetaPokemon({ pokemon, onPress, esFavorito = false }) {
  // El "tipo principal" (el primero del array) define el color de fondo de
  // toda la tarjeta, igual que en los juegos oficiales de Pokémon.
  const tipoPrincipal = pokemon.tipos[0];
  const colorFondo = FONDOS_TIPO[tipoPrincipal] || colores.fondo;

  return (
    <TouchableOpacity
      style={[estilos.tarjeta, { backgroundColor: colorFondo }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* El corazón solo se pinta si esFavorito es true. La expresión
          "esFavorito && (<Text>...)" es un truco muy común en React: si
          esFavorito es false, no se renderiza nada. */}
      {esFavorito && <Text style={estilos.iconoFavorito}>❤️</Text>}

      <Text style={estilos.numero}>#{String(pokemon.id).padStart(3, '0')}</Text>

      <Image
        source={{ uri: pokemon.imagen }}
        style={estilos.imagen}
        resizeMode="contain"
      />

      <Text style={estilos.nombre}>{pokemon.nombre}</Text>

      <View style={estilos.tipos}>
        {/* Un Pokémon puede tener 1 o 2 tipos: recorremos el array con .map()
            y pintamos una InsigniasTipo por cada uno. La prop "key" es
            obligatoria en React cuando se genera una lista de elementos: le
            ayuda a identificar cuál elemento cambió entre renders. */}
        {pokemon.tipos.map((tipo, indice) => (
          <InsigniasTipo key={indice} tipo={tipo} />
        ))}
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    // flex: 1 hace que, dentro de una fila de 2 columnas de FlatList, cada
    // tarjeta ocupe la mitad disponible del ancho.
    flex: 1,
    borderRadius: 12,
    margin: 6,
    padding: 12,
    alignItems: 'center',
    // "elevation" es la sombra en Android; el resto de propiedades "shadow*"
    // son la sombra en iOS. Hay que declarar los dos sistemas por separado.
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  iconoFavorito: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 14,
  },
  numero: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colores.principal,
    alignSelf: 'flex-start',
  },
  imagen: {
    width: 90,
    height: 90,
    marginVertical: 8,
  },
  nombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  tipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
});
