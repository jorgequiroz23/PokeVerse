// src/componentes/BarraBusqueda.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Campo de texto para buscar Pokémon por nombre. Es un "TextInput
// controlado": no guarda ningún estado propio, sino que recibe el texto
// actual (value) y una función para actualizarlo (onChangeText) por props.
// Esto lo hace reutilizable: quien lo use decide DÓNDE vive el estado del
// texto de búsqueda (en nuestro caso, en PantallaInicio).
//
// También incluye:
// - Un ícono de lupa fijo a la izquierda.
// - Un spinner mientras "buscando" es true (petición a la API en curso).
// - Un botón "✕" para limpiar el texto, que solo aparece si hay texto
//   escrito y no se está buscando en ese momento.
// -----------------------------------------------------------------------------

import { View, TextInput, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colores } from '../estilos/colores';

/**
 * @param {{
 *   valor: string,
 *   onCambiarTexto: (texto: string) => void,
 *   onLimpiar: () => void,
 *   buscando?: boolean,
 *   placeholder?: string,
 * }} props
 * @param {string} props.valor - texto actual del input (viene de useState del padre)
 * @param {(texto: string) => void} props.onCambiarTexto - se llama con cada
 *        letra que el usuario escribe
 * @param {() => void} props.onLimpiar - se llama al tocar el botón "✕"
 * @param {boolean} [props.buscando] - true mientras hay una búsqueda en curso
 * @param {string} [props.placeholder] - texto de ayuda cuando el input está vacío
 */
export default function BarraBusqueda({
  valor,
  onCambiarTexto,
  onLimpiar,
  buscando = false,
  placeholder = 'Buscar pokemon...',
}) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.icono}>🔍</Text>

      <TextInput
        style={estilos.input}
        // Los dos props siguientes son OBLIGATORIOS juntos para que el
        // TextInput sea "controlado": value dice qué mostrar, onChangeText
        // escucha cada tecla. Si solo pusiéramos "value" sin
        // "onChangeText", el campo se vería de solo lectura.
        value={valor}
        onChangeText={onCambiarTexto}
        placeholder={placeholder}
        placeholderTextColor={colores.textoClaro}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Mientras se está buscando, mostramos un spinner pequeño en vez del
          botón de limpiar (para no mostrar los dos elementos a la vez). */}
      {buscando && <ActivityIndicator size="small" color={colores.principal} />}

      {!buscando && valor.length > 0 && (
        <Pressable onPress={onLimpiar} hitSlop={8}>
          <Text style={estilos.limpiar}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.tarjeta,
    borderRadius: 25,
    paddingHorizontal: 14,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icono: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colores.texto,
  },
  limpiar: {
    fontSize: 16,
    color: colores.textoClaro,
    padding: 4,
  },
});
