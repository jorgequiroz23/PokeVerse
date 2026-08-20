// src/componentes/SelectorHorizontal.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Pinta una fila de botones tipo "píldora" (pill) que se puede desplazar
// horizontalmente, donde solo uno puede estar seleccionado a la vez. Es
// GENÉRICO: no sabe si las opciones son tipos de Pokémon o generaciones, solo
// recibe una lista de opciones y pinta botones.
//
// ¿POR QUÉ EXISTE COMO COMPONENTE APARTE?
// PokeVerse necesita este mismo patrón visual en DOS lugares distintos:
// - PantallaInicio: selector de generación (Gen 1, Gen 2, Gen 3...).
// - PantallaFavoritos: selector de tipo (todos, fuego, agua, planta...).
// En vez de escribir el mismo ScrollView horizontal con Pressables dos
// veces, lo extraemos aquí UNA sola vez y cada pantalla le pasa sus propias
// opciones. Esto es justamente lo que pediste: "todos los componentes deben
// ser reutilizables".
// -----------------------------------------------------------------------------

import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { colores } from '../estilos/colores';

/**
 * @param {{
 *   opciones: { valor: string, etiqueta: string }[],
 *   valorSeleccionado: string,
 *   onSeleccionar: (valor: string) => void,
 * }} props
 * @param {{valor:string,etiqueta:string}[]} props.opciones - lista de
 *        opciones a mostrar. "valor" es el identificador interno (ej: "fuego")
 *        y "etiqueta" es el texto legible que ve el usuario (ej: "Fuego").
 * @param {string} props.valorSeleccionado - el "valor" de la opción activa
 * @param {(valor: string) => void} props.onSeleccionar - se llama con el
 *        "valor" de la opción que el usuario tocó
 */
export default function SelectorHorizontal({
  opciones,
  valorSeleccionado,
  onSeleccionar,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={estilos.scroll}
      contentContainerStyle={estilos.contenedor}
    >
      {opciones.map((opcion) => {
        const activo = opcion.valor === valorSeleccionado;
        return (
          <Pressable
            key={opcion.valor}
            // Cuando "style" es una función, Pressable le pasa un objeto con
            // { pressed }, lo que nos permite dar feedback visual (opacidad)
            // mientras el usuario mantiene el dedo sobre el botón.
            style={({ pressed }) => [
              estilos.boton,
              activo && estilos.botonActivo,
              pressed && estilos.botonPresionado,
            ]}
            onPress={() => onSeleccionar(opcion.valor)}
          >
            <Text style={[estilos.texto, activo && estilos.textoActivo]}>
              {opcion.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    // Antes: 50. Con paddings + el alto real de línea del texto, 50 dejaba
    // muy poco margen y en algunos dispositivos Android recortaba la parte
    // de arriba o de abajo de las letras. 56 da aire suficiente.
    maxHeight: 56,
    backgroundColor: colores.tarjeta,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  contenedor: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
    // alignItems: 'center' asegura que cada píldora se centre verticalmente
    // dentro de la fila, en vez de estirarse y comprimir el texto.
    alignItems: 'center',
  },
  boton: {
    paddingHorizontal: 14,
    // Antes: 6. Se sube a 8 para que el texto tenga más espacio vertical
    // dentro del botón y no quede pegado al borde superior/inferior.
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colores.fondo,
    borderWidth: 1,
    borderColor: colores.borde,
    justifyContent: 'center',
  },
  botonActivo: {
    backgroundColor: colores.principal,
    borderColor: colores.principal,
  },
  botonPresionado: {
    opacity: 0.7,
  },
  texto: {
    fontSize: 12,
    // lineHeight explícito: sin esto, algunos dispositivos Android calculan
    // una altura de línea menor a la que el texto realmente necesita, y el
    // resultado visual es exactamente el que describiste (letras cortadas
    // a la mitad). 16 le da a cada línea espacio suficiente.
    lineHeight: 16,
    color: '#555555',
    textTransform: 'capitalize',
  },
  textoActivo: {
    color: colores.textoSobreOscuro,
    fontWeight: 'bold',
  },
});
