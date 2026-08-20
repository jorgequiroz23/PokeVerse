// src/componentes/ComparadorEstadisticas.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Pinta UNA fila de la pantalla de comparación (Sprint 1, historia #5:
// "Comparar pokemon"): a la izquierda el valor de la stat del primer
// Pokémon, en el centro el nombre de la stat, a la derecha el valor del
// segundo Pokémon. El valor más alto de los dos se resalta en color de
// éxito (verde) para que sea fácil ver, de un vistazo, cuál Pokémon gana en
// cada estadística.
//
// ¿POR QUÉ ES UN COMPONENTE APARTE?
// PantallaComparacion necesita repetir esta misma fila 6 veces (una por cada
// estadística: hp, ataque, defensa, ataque especial, defensa especial,
// velocidad). Extraerlo evita repetir la lógica de "cuál valor es mayor" y
// mantiene PantallaComparacion enfocada en obtener los datos, no en cómo se
// ve cada fila.
// -----------------------------------------------------------------------------

import { View, Text, StyleSheet } from 'react-native';
import { colores } from '../estilos/colores';

/**
 * @param {{ nombreStat: string, valorA: number, valorB: number }} props
 * @param {string} props.nombreStat - nombre de la estadística comparada
 * @param {number} props.valorA - valor de esa stat para el Pokémon A (izquierda)
 * @param {number} props.valorB - valor de esa stat para el Pokémon B (derecha)
 */
export default function ComparadorEstadisticas({ nombreStat, valorA, valorB }) {
  const aGana = valorA > valorB;
  const bGana = valorB > valorA;

  return (
    <View style={estilos.fila}>
      <Text style={[estilos.valor, aGana && estilos.valorGanador]}>{valorA}</Text>
      <Text style={estilos.nombreStat}>{nombreStat}</Text>
      <Text style={[estilos.valor, bGana && estilos.valorGanador]}>{valorB}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  valor: {
    width: 60,
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    textAlign: 'center',
  },
  valorGanador: {
    color: colores.exito,
  },
  nombreStat: {
    flex: 1,
    fontSize: 13,
    color: colores.textoClaro,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
