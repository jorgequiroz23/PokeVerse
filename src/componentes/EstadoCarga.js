// src/componentes/EstadoCarga.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Pantalla intermedia genérica que se muestra mientras algo está cargando:
// un spinner grande centrado más un mensaje. La usan PantallaInicio (al
// cargar la lista) y podría usarla cualquier otra pantalla que necesite
// esperar una operación asíncrona.
// -----------------------------------------------------------------------------

import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colores } from '../estilos/colores';

/**
 * @param {{ mensaje?: string }} props
 * @param {string} [props.mensaje] - texto que se muestra bajo el spinner
 */
export default function EstadoCarga({ mensaje = 'Cargando...' }) {
  return (
    <View style={estilos.centrado}>
      <ActivityIndicator size="large" color={colores.principal} />
      <Text style={estilos.texto}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: colores.fondo,
  },
  texto: {
    fontSize: 16,
    color: colores.textoClaro,
  },
});
