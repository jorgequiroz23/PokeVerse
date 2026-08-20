// src/componentes/CabeceraComparacion.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Muestra la "ficha resumida" de un Pokémon dentro de PantallaComparacion:
// su imagen, nombre e insignias de tipo. Se pinta dos veces en esa pantalla
// (una para cada Pokémon comparado), lado a lado.
//
// Si todavía no se ha elegido un Pokémon para ese lado (pokemon === null),
// en su lugar muestra un botón/placeholder invitando a seleccionarlo.
// -----------------------------------------------------------------------------

import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import InsigniasTipo from './InsigniasTipo';
import { colores } from '../estilos/colores';

/**
 * @param {{ pokemon: object | null, onPressElegir: () => void }} props
 * @param {object|null} props.pokemon - Pokémon a mostrar, o null si aún no
 *        se ha elegido ninguno para esta posición
 * @param {() => void} props.onPressElegir - se llama al tocar el placeholder
 *        cuando todavía no hay Pokémon elegido, para abrir el selector
 */
export default function CabeceraComparacion({ pokemon, onPressElegir }) {
  if (!pokemon) {
    return (
      <Pressable style={estilos.placeholder} onPress={onPressElegir}>
        <Text style={estilos.iconoMas}>+</Text>
        <Text style={estilos.textoPlaceholder}>Elegir pokemon</Text>
      </Pressable>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Image source={{ uri: pokemon.imagen }} style={estilos.imagen} resizeMode="contain" />
      <Text style={estilos.nombre}>{pokemon.nombre}</Text>
      <View style={estilos.tipos}>
        {pokemon.tipos.map((tipo, indice) => (
          <InsigniasTipo key={indice} tipo={tipo} />
        ))}
      </View>
      <Pressable onPress={onPressElegir} hitSlop={8}>
        <Text style={estilos.cambiar}>Cambiar</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  imagen: {
    width: 100,
    height: 100,
  },
  nombre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colores.texto,
    textTransform: 'capitalize',
    marginTop: 4,
  },
  tipos: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 4,
  },
  cambiar: {
    marginTop: 8,
    fontSize: 12,
    color: colores.principal,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: colores.borde,
    borderStyle: 'dashed',
    borderRadius: 12,
    minHeight: 160,
  },
  iconoMas: {
    fontSize: 32,
    color: colores.textoClaro,
    marginBottom: 4,
  },
  textoPlaceholder: {
    fontSize: 12,
    color: colores.textoClaro,
    textAlign: 'center',
  },
});
