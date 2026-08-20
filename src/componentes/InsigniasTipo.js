// src/componentes/InsigniasTipo.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Muestra una pequeña "píldora" de color con el nombre de un tipo de Pokémon
// (por ejemplo: "fuego", "agua", "planta"). El color de fondo cambia según el
// tipo, usando la tabla COLORES_TIPO de utils/constantes.js.
//
// ¿DÓNDE SE USA?
// Dentro de TarjetaPokemon (la lista) y dentro de PantallaDetalle (la ficha
// completa de un Pokémon). Cualquier Pokémon puede tener 1 o 2 tipos, así que
// este componente normalmente se pinta dentro de un .map() por cada tipo.
// -----------------------------------------------------------------------------

import { View, Text, StyleSheet } from 'react-native';
import { COLORES_TIPO } from '../utils/constantes';

/**
 * @param {{ tipo: string }} props
 * @param {string} props.tipo - nombre del tipo de Pokémon en español y en
 *        minúsculas (ej: "fuego"). Si no coincide con ningún color conocido,
 *        se usa un gris genérico como respaldo.
 */
export default function InsigniasTipo({ tipo = 'normal' }) {
  // Buscamos el color oficial del tipo. Si no existe en la tabla (por
  // ejemplo, un tipo mal escrito), usamos un gris de respaldo para que la
  // app nunca se vea "rota".
  const colorFondo = COLORES_TIPO[tipo?.toLowerCase()] || '#999999';

  return (
    // Combinamos DOS estilos con un array: el estilo fijo (forma, padding) y
    // el color dinámico que depende de la prop "tipo". React Native fusiona
    // ambos objetos, y el segundo (el color) tiene prioridad si se repite
    // alguna propiedad.
    <View style={[estilos.insignia, { backgroundColor: colorFondo }]}>
      <Text style={estilos.texto}>{tipo}</Text>
    </View>
  );
}

// StyleSheet.create no cambia el comportamiento del objeto de estilos, pero
// permite que React Native lo optimice internamente (lo trata como una
// referencia fija en vez de un objeto nuevo en cada render).
const estilos = StyleSheet.create({
  insignia: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 4,
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    // textTransform "capitalize" pone en mayúscula solo la primera letra,
    // sin necesidad de tocar el texto original.
    textTransform: 'capitalize',
  },
});
