// src/componentes/FilaFavorito.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// A diferencia de TarjetaPokemon (una tarjeta cuadrada pensada para una
// grilla de 2 columnas), FilaFavorito pinta una FILA horizontal: imagen a la
// izquierda, nombre/tipos en el medio y un botón "✕" a la derecha para
// quitar el Pokémon de favoritos. Es el formato típico de una lista de
// "guardados" (como una lista de reproducción).
//
// ¿POR QUÉ NO REUTILIZAR TarjetaPokemon AQUÍ?
// Aunque ambos muestran un Pokémon, la disposición visual y la interacción
// son distintas (una tarjeta cuadrada tocable completa vs. una fila con dos
// zonas tocables independientes: la fila en sí para ver el detalle, y el
// botón "✕" para quitarlo). Forzar un solo componente con muchas props
// condicionales sería más confuso que tener dos componentes simples, cada
// uno con un único propósito claro.
// -----------------------------------------------------------------------------

import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import InsigniasTipo from './InsigniasTipo';
import { colores } from '../estilos/colores';

/**
 * @param {{
 *   pokemon: object,
 *   onPress: () => void,
 *   onQuitar: () => void,
 * }} props
 * @param {object} props.pokemon - objeto Pokémon transformado
 * @param {() => void} props.onPress - se llama al tocar la fila (ver detalle)
 * @param {() => void} props.onQuitar - se llama al tocar el botón "✕"
 */
export default function FilaFavorito({ pokemon, onPress, onQuitar }) {
  return (
    <Pressable style={estilos.tarjeta} onPress={onPress}>
      <Image
        source={{ uri: pokemon.imagen }}
        style={estilos.imagen}
        resizeMode="contain"
      />
      <View style={estilos.info}>
        <Text style={estilos.numero}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={estilos.nombre}>{pokemon.nombre}</Text>
        <View style={estilos.tipos}>
          {pokemon.tipos.map((tipo, indice) => (
            <InsigniasTipo key={indice} tipo={tipo} />
          ))}
        </View>
      </View>
      {/* Este Pressable está DENTRO del Pressable de la fila. React Native
          maneja bien los toques anidados: tocar el botón "✕" solo dispara
          onQuitar, no también onPress de la fila completa. */}
      <Pressable style={estilos.botonQuitar} onPress={onQuitar} hitSlop={8}>
        <Text style={estilos.textoQuitar}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.tarjeta,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imagen: {
    width: 70,
    height: 70,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  numero: {
    fontSize: 11,
    color: colores.principal,
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    textTransform: 'capitalize',
    marginVertical: 4,
  },
  tipos: {
    flexDirection: 'row',
    gap: 4,
  },
  botonQuitar: {
    backgroundColor: colores.favorito,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoQuitar: {
    color: colores.principal,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
