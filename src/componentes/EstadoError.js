// src/componentes/EstadoError.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Muestra un mensaje de error centrado junto con un botón "Reintentar". Se
// usa cuando falla una petición a la PokeAPI (sin conexión, servidor caído,
// etc.), para que el usuario pueda intentar de nuevo sin cerrar la app.
// -----------------------------------------------------------------------------

import { View, Text, StyleSheet } from 'react-native';
import BotonPrimario from './BotonPrimario';
import { colores } from '../estilos/colores';

/**
 * @param {{ mensaje: string, onReintentar: () => void }} props
 * @param {string} props.mensaje - descripción del error para el usuario
 * @param {() => void} props.onReintentar - función que se llama al tocar
 *        el botón "Reintentar" (normalmente vuelve a pedir los datos)
 */
export default function EstadoError({ mensaje, onReintentar }) {
  return (
    <View style={estilos.centrado}>
      <Text style={estilos.emoji}>⚠️</Text>
      <Text style={estilos.texto}>{mensaje}</Text>
      <BotonPrimario texto="Reintentar" onPress={onReintentar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: colores.fondo,
  },
  emoji: {
    fontSize: 40,
  },
  texto: {
    fontSize: 16,
    color: colores.principal,
    textAlign: 'center',
  },
});
