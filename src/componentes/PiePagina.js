// src/componentes/PiePagina.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE COMPONENTE?
// Pequeño pie de página con el nombre de la app y el año. Es puramente
// decorativo/informativo, no recibe props ni tiene lógica: es el ejemplo más
// simple de componente de PokeVerse.
// -----------------------------------------------------------------------------

import { View, Text, StyleSheet } from 'react-native';
import { colores } from '../estilos/colores';

export default function PiePagina() {
  return (
    <View style={estilos.pie}>
      <Text style={estilos.texto}>PokeVerse · Datos de PokeAPI · 2026</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pie: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  texto: {
    fontSize: 11,
    color: colores.textoClaro,
  },
});
