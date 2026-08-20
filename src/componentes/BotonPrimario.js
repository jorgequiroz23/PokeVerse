// src/componentes/BotonPrimario.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Botón genérico con el estilo de marca de PokeVerse (fondo rojo, texto
// blanco), con feedback visual al presionar (se atenúa un poco). Se usa en
// varios lugares: "Reintentar" cuando falla la carga de la API, "Agregar/
// Quitar de favoritos" en el detalle, etc.
//
// ¿POR QUÉ EXISTE?
// Para no repetir el mismo StyleSheet de botón rojo en cada pantalla que
// necesite un botón de acción principal. Además centraliza el comportamiento
// de "variante": puede verse como botón sólido (variante="solido", el uso
// normal) o como botón de contorno (variante="contorno", útil para el botón
// de favorito cuando todavía NO es favorito).
// -----------------------------------------------------------------------------

import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colores } from '../estilos/colores';

/**
 * @param {{
 *   texto: string,
 *   onPress: () => void,
 *   variante?: 'solido' | 'contorno',
 *   cargando?: boolean,
 *   estiloContenedor?: object,
 * }} props
 * @param {string} props.texto - texto a mostrar dentro del botón
 * @param {() => void} props.onPress - función a ejecutar al tocar el botón
 * @param {'solido'|'contorno'} [props.variante] - estilo visual del botón
 * @param {boolean} [props.cargando] - si es true, muestra un spinner y
 *        deshabilita el botón (evita doble toque mientras algo carga)
 * @param {object} [props.estiloContenedor] - estilos extra opcionales, por
 *        si la pantalla que lo usa necesita ajustar márgenes puntuales
 */
export default function BotonPrimario({
  texto,
  onPress,
  variante = 'solido',
  cargando = false,
  estiloContenedor,
}) {
  const esContorno = variante === 'contorno';

  return (
    <Pressable
      disabled={cargando}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.boton,
        esContorno ? estilos.botonContorno : estilos.botonSolido,
        pressed && estilos.botonPresionado,
        estiloContenedor,
      ]}
    >
      {cargando ? (
        <ActivityIndicator
          size="small"
          color={esContorno ? colores.principal : colores.textoSobreOscuro}
        />
      ) : (
        <Text
          style={[
            estilos.texto,
            esContorno ? estilos.textoContorno : estilos.textoSolido,
          ]}
        >
          {texto}
        </Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSolido: {
    backgroundColor: colores.principal,
  },
  botonContorno: {
    backgroundColor: colores.tarjeta,
    borderWidth: 2,
    borderColor: colores.principal,
  },
  botonPresionado: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  texto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoSolido: {
    color: colores.textoSobreOscuro,
  },
  textoContorno: {
    color: colores.principal,
  },
});
