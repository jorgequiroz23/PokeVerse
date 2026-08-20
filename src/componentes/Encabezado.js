// src/componentes/Encabezado.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Barra superior reutilizable con un título grande y, opcionalmente, un
// subtítulo debajo. Se usa como cabecera decorativa dentro del contenido de
// una pantalla (distinta del header nativo que pone React Navigation, que se
// configura aparte en src/navegacion/AppNavigator.js).
// -----------------------------------------------------------------------------

import { View, Text, StyleSheet } from 'react-native';
import { colores } from '../estilos/colores';

/**
 * @param {{ titulo: string, subtitulo?: string }} props
 * @param {string} props.titulo - texto principal, grande
 * @param {string} [props.subtitulo] - texto secundario, opcional
 */
export default function Encabezado({ titulo, subtitulo }) {
  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {/* Si no llega "subtitulo", esta expresión no renderiza nada (undefined
          o string vacío son "falsy" en JavaScript). */}
      {subtitulo ? <Text style={estilos.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.principal,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colores.textoSobreOscuro,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: colores.acento,
    fontWeight: '600',
  },
});
