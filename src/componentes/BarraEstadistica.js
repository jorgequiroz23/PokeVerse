// src/componentes/BarraEstadistica.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Dibuja UNA fila de estadística de combate (por ejemplo "hp: 45"), con el
// nombre de la stat a la izquierda, una barra de progreso horizontal en el
// medio (más larga cuanto mayor sea el valor) y el número exacto a la
// derecha. El color de la barra cambia según qué tan alto sea el valor:
// verde si es alto, dorado si es medio, rojo si es bajo.
//
// ¿POR QUÉ ES UN COMPONENTE APARTE?
// PantallaDetalle necesita pintar 6 estadísticas (hp, ataque, defensa,
// ataque especial, defensa especial, velocidad). En vez de repetir el mismo
// bloque de JSX seis veces dentro de PantallaDetalle.js, lo extraemos aquí
// como un componente reutilizable: PantallaDetalle solo tiene que hacer un
// .map() sobre la lista de stats y renderizar <BarraEstadistica /> por cada
// una. Esto respeta el principio de que "cada componente tiene un único
// propósito": este solo sabe pintar una barra de stat, nada más.
// -----------------------------------------------------------------------------

import { View, Text, StyleSheet } from 'react-native';
import { colores } from '../estilos/colores';

// El valor máximo teórico que usamos para calcular el porcentaje de la
// barra. 150 es un techo razonable para la mayoría de stats base de la
// PokeAPI (algunas legendarias pueden superarlo, por eso limitamos el
// porcentaje a 100% con Math.min más abajo).
const VALOR_MAXIMO_REFERENCIA = 150;

/**
 * @param {{ nombre: string, valor: number }} props
 * @param {string} props.nombre - nombre de la estadística (ej: "hp", "attack")
 * @param {number} props.valor - valor numérico de la estadística (base_stat)
 */
export default function BarraEstadistica({ nombre, valor }) {
  // Calculamos qué porcentaje del ancho debe ocupar la barra de color.
  // Math.min(..., 100) evita que la barra se salga del contenedor si algún
  // Pokémon tiene una stat mayor a nuestro valor de referencia.
  const porcentaje = Math.min((valor / VALOR_MAXIMO_REFERENCIA) * 100, 100);

  // Elegimos el color de la barra según qué tan buena sea la estadística.
  // Esto le da al usuario una lectura visual rápida sin tener que leer el
  // número: verde = fuerte, dorado = intermedio, rojo = débil.
  let colorBarra = colores.peligro;
  if (valor >= 80) {
    colorBarra = colores.exito;
  } else if (valor >= 50) {
    colorBarra = colores.advertencia;
  }

  return (
    <View style={estilos.fila}>
      <Text style={estilos.nombre}>{nombre}</Text>
      <View style={estilos.contenedorBarra}>
        {/* El "width" en porcentaje se calcula dinámicamente arriba y se
            pasa como estilo en línea, combinado con el estilo fijo de la
            barra (altura, bordes redondeados). */}
        <View
          style={[
            estilos.barra,
            { width: `${porcentaje}%`, backgroundColor: colorBarra },
          ]}
        />
      </View>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  nombre: {
    width: 90,
    fontSize: 12,
    color: colores.textoClaro,
    textTransform: 'capitalize',
  },
  contenedorBarra: {
    flex: 1,
    height: 8,
    backgroundColor: colores.borde,
    borderRadius: 4,
    // overflow: 'hidden' hace que la barra interna (el "relleno" de color)
    // nunca sobresalga de las esquinas redondeadas del contenedor.
    overflow: 'hidden',
  },
  barra: {
    height: '100%',
    borderRadius: 4,
  },
  valor: {
    width: 32,
    fontSize: 12,
    fontWeight: 'bold',
    color: colores.texto,
    textAlign: 'right',
  },
});
