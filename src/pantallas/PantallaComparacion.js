// src/pantallas/PantallaComparacion.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTA PANTALLA?
// Implementa la historia de usuario #5 del MVP de PokeVerse: "Como usuario
// quiero comparar las estadísticas de dos pokemon para saber cuál es más
// fuerte." Permite elegir dos Pokémon (desde favoritos o buscando por
// nombre en la PokeAPI) y muestra, lado a lado, su imagen, tipos y las 6
// estadísticas de combate, resaltando en verde quién gana cada una.
//
// ¿CÓMO SE ELIGEN LOS DOS POKÉMON?
// - "Pokémon A" puede llegar ya elegido si el usuario tocó "Comparar" desde
//   PantallaDetalle (llega por route.params.pokemonA).
// - Para elegir o cambiar cualquiera de los dos lados, se toca su
//   CabeceraComparacion, lo que abre un selector modal con: los favoritos
//   guardados listos para tocar, o un campo de búsqueda que consulta la
//   PokeAPI en vivo (reutilizando el mismo servicio que PantallaInicio).
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { View, Text, ScrollView, Modal, StyleSheet, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CabeceraComparacion from '../componentes/CabeceraComparacion';
import ComparadorEstadisticas from '../componentes/ComparadorEstadisticas';
import BarraBusqueda from '../componentes/BarraBusqueda';
import EstadoCarga from '../componentes/EstadoCarga';

import { useFavoritos } from '../contexto/FavoritosContext';
import { obtenerPokemonPorNombre } from '../servicios/pokeApi';
import { colores } from '../estilos/colores';

export default function PantallaComparacion({ route }) {
  // Si venimos desde PantallaDetalle con un pokemon preseleccionado, lo
  // usamos como valor inicial de pokemonA. El operador "?." evita un error
  // si route.params no existe (por ejemplo, si se entra sin parámetros).
  const pokemonInicial = route?.params?.pokemonA ?? null;

  const [pokemonA, setPokemonA] = useState(pokemonInicial);
  const [pokemonB, setPokemonB] = useState(null);

  // "ladoSeleccionando" indica cuál de los dos lados ('A' o 'B') se está
  // eligiendo en este momento; null significa que el selector está cerrado.
  const [ladoSeleccionando, setLadoSeleccionando] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  const { favoritos } = useFavoritos();

  const abrirSelector = (lado) => {
    setLadoSeleccionando(lado);
    setTextoBusqueda('');
    setErrorBusqueda(null);
  };

  const cerrarSelector = () => {
    setLadoSeleccionando(null);
  };

  const elegirPokemon = (pokemon) => {
    if (ladoSeleccionando === 'A') {
      setPokemonA(pokemon);
    } else if (ladoSeleccionando === 'B') {
      setPokemonB(pokemon);
    }
    cerrarSelector();
  };

  const buscarEnApi = async () => {
    const texto = textoBusqueda.trim().toLowerCase();
    if (texto.length === 0) return;
    try {
      setBuscando(true);
      setErrorBusqueda(null);
      const resultado = await obtenerPokemonPorNombre(texto);
      elegirPokemon(resultado);
    } catch (err) {
      setErrorBusqueda(`No se encontró "${texto}" en la Pokédex.`);
    } finally {
      setBuscando(false);
    }
  };

  // Solo mostramos la tabla comparativa cuando YA hay dos Pokémon elegidos.
  const listoParaComparar = pokemonA !== null && pokemonB !== null;

  return (
    <SafeAreaView style={estilos.contenedor} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={estilos.scroll}>
        <View style={estilos.filaCabeceras}>
          <CabeceraComparacion pokemon={pokemonA} onPressElegir={() => abrirSelector('A')} />
          <Text style={estilos.vs}>VS</Text>
          <CabeceraComparacion pokemon={pokemonB} onPressElegir={() => abrirSelector('B')} />
        </View>

        {listoParaComparar ? (
          <View style={estilos.tabla}>
            <Text style={estilos.tituloTabla}>Estadísticas</Text>
            {/* Recorremos las stats del primer pokemon y buscamos la stat
                correspondiente en el segundo por nombre, para asegurarnos de
                comparar "hp" con "hp", "attack" con "attack", etc. */}
            {pokemonA.stats.map((statA) => {
              const statB = pokemonB.stats.find((s) => s.nombre === statA.nombre);
              return (
                <ComparadorEstadisticas
                  key={statA.nombre}
                  nombreStat={statA.nombre}
                  valorA={statA.valor}
                  valorB={statB ? statB.valor : 0}
                />
              );
            })}
          </View>
        ) : (
          <View style={estilos.ayuda}>
            <Text style={estilos.textoAyuda}>
              Elige dos pokemon para comparar sus estadísticas de combate lado a lado.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de selección: se abre al tocar cualquiera de las dos
          cabeceras cuando todavía no tienen un pokemon asignado (o al tocar
          "Cambiar" si ya lo tienen). */}
      <Modal
        visible={ladoSeleccionando !== null}
        animationType="slide"
        onRequestClose={cerrarSelector}
      >
        <SafeAreaView style={estilos.modal}>
          <View style={estilos.modalHeader}>
            <Text style={estilos.modalTitulo}>
              Elegir pokemon {ladoSeleccionando === 'A' ? 'A' : 'B'}
            </Text>
            <Pressable onPress={cerrarSelector} hitSlop={8}>
              <Text style={estilos.modalCerrar}>✕</Text>
            </Pressable>
          </View>

          <View style={estilos.modalBusqueda}>
            <BarraBusqueda
              valor={textoBusqueda}
              onCambiarTexto={setTextoBusqueda}
              onLimpiar={() => setTextoBusqueda('')}
              buscando={buscando}
              placeholder="Buscar en la PokeAPI..."
            />
            <Pressable style={estilos.botonBuscar} onPress={buscarEnApi}>
              <Text style={estilos.textoBotonBuscar}>Buscar</Text>
            </Pressable>
          </View>

          {errorBusqueda && <Text style={estilos.errorBusqueda}>{errorBusqueda}</Text>}
          {buscando && <EstadoCarga mensaje="Buscando..." />}

          {!buscando && (
            <>
              <Text style={estilos.subtituloModal}>Tus favoritos</Text>
              <FlatList
                data={favoritos}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={estilos.listaModal}
                renderItem={({ item }) => (
                  <Pressable style={estilos.filaModal} onPress={() => elegirPokemon(item)}>
                    <Text style={estilos.nombreFilaModal}>
                      #{String(item.id).padStart(3, '0')} · {item.nombre}
                    </Text>
                  </Pressable>
                )}
                ListEmptyComponent={() => (
                  <Text style={estilos.textoAyuda}>
                    Aún no tienes favoritos guardados. Usa el buscador de arriba.
                  </Text>
                )}
              />
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  scroll: {
    padding: 16,
  },
  filaCabeceras: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.tarjeta,
    borderRadius: 12,
    padding: 8,
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.principal,
    marginHorizontal: 4,
  },
  tabla: {
    backgroundColor: colores.tarjeta,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tituloTabla: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 8,
    textAlign: 'center',
  },
  ayuda: {
    marginTop: 24,
    padding: 20,
    alignItems: 'center',
  },
  textoAyuda: {
    fontSize: 14,
    color: colores.textoClaro,
    textAlign: 'center',
    lineHeight: 20,
  },
  modal: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colores.principal,
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colores.textoSobreOscuro,
  },
  modalCerrar: {
    fontSize: 20,
    color: colores.textoSobreOscuro,
  },
  modalBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
  },
  botonBuscar: {
    backgroundColor: colores.principal,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },
  textoBotonBuscar: {
    color: colores.textoSobreOscuro,
    fontWeight: 'bold',
    fontSize: 13,
  },
  errorBusqueda: {
    color: colores.peligro,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  subtituloModal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colores.textoClaro,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  listaModal: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  filaModal: {
    backgroundColor: colores.tarjeta,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  nombreFilaModal: {
    fontSize: 14,
    color: colores.texto,
    textTransform: 'capitalize',
  },
});
