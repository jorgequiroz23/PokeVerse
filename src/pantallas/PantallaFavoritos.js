// src/pantallas/PantallaFavoritos.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTA PANTALLA?
// Muestra todos los Pokémon guardados como favoritos (historia de usuario
// #4: "guardar favoritos"), permite quitarlos directamente desde aquí y
// filtrarlos por tipo con un selector horizontal (Sprint 5).
//
// Toda la información de favoritos sale del contexto global (useFavoritos):
// esta pantalla no guarda ningún estado propio de favoritos, solo el estado
// LOCAL del filtro de tipo seleccionado (que es una preferencia de esta
// pantalla en particular, no algo que otras pantallas necesiten conocer).
// -----------------------------------------------------------------------------

import { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FilaFavorito from '../componentes/FilaFavorito';
import SelectorHorizontal from '../componentes/SelectorHorizontal';

import { useFavoritos } from '../contexto/FavoritosContext';
import { TIPOS_DISPONIBLES } from '../utils/constantes';
import { colores } from '../estilos/colores';

// Igual que en PantallaInicio: convertimos la lista simple de strings a la
// forma { valor, etiqueta } que espera SelectorHorizontal.
const OPCIONES_TIPO = TIPOS_DISPONIBLES.map((tipo) => ({
  valor: tipo,
  etiqueta: tipo === 'todos' ? 'Todos' : tipo,
}));

export default function PantallaFavoritos({ navigation }) {
  const { favoritos, quitarFavorito } = useFavoritos();
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // useMemo evita recalcular el filtrado en CADA render: solo se vuelve a
  // calcular cuando "favoritos" o "filtroTipo" cambian de verdad.
  const favoritosFiltrados = useMemo(() => {
    if (filtroTipo === 'todos') return favoritos;
    return favoritos.filter((pokemon) => pokemon.tipos.includes(filtroTipo));
  }, [favoritos, filtroTipo]);

  const irADetalle = (pokemon) => {
    navigation.navigate('Detalle', { pokemon });
  };

  return (
    <SafeAreaView style={estilos.contenedor} edges={['bottom', 'left', 'right']}>
      <SelectorHorizontal
        opciones={OPCIONES_TIPO}
        valorSeleccionado={filtroTipo}
        onSeleccionar={setFiltroTipo}
      />

      <Text style={estilos.contador}>
        {favoritosFiltrados.length} de {favoritos.length} pokemon
        {filtroTipo !== 'todos' ? ` · tipo ${filtroTipo}` : ''}
      </Text>

      <FlatList
        data={favoritosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <FilaFavorito
            pokemon={item}
            onPress={() => irADetalle(item)}
            onQuitar={() => quitarFavorito(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={estilos.vacio}>
            <Text style={estilos.emojiVacio}>{favoritos.length === 0 ? '🤍' : '🔍'}</Text>
            <Text style={estilos.tituloVacio}>
              {favoritos.length === 0 ? 'Sin favoritos' : `Sin pokemon de tipo ${filtroTipo}`}
            </Text>
            <Text style={estilos.textoVacio}>
              {favoritos.length === 0
                ? 'Toca el corazón en el detalle de cualquier pokemon para agregarlo aquí.'
                : 'Prueba con otro tipo o selecciona "Todos".'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contador: {
    fontSize: 12,
    color: colores.textoClaro,
    textAlign: 'center',
    paddingVertical: 8,
  },
  lista: {
    padding: 12,
    flexGrow: 1,
  },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emojiVacio: {
    fontSize: 48,
    marginBottom: 12,
  },
  tituloVacio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 8,
  },
  textoVacio: {
    fontSize: 14,
    color: colores.textoClaro,
    textAlign: 'center',
    lineHeight: 22,
  },
});
