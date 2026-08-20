// src/pantallas/PantallaInicio.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTA PANTALLA?
// Es la pantalla principal de PokeVerse (historia de usuario #1: "ver lista
// de pokemon"). Reúne tres funcionalidades:
//   1) Cargar y mostrar Pokémon de la PokeAPI en una grilla (Sprint 2).
//   2) Filtrar por generación con un selector horizontal (Sprint 5).
//   3) Buscar cualquier Pokémon por nombre en tiempo real, con debounce, para
//      no saturar la API con una petición por cada letra escrita (Sprint 4).
//
// Además muestra un botón con el contador de favoritos que navega a
// PantallaFavoritos, y al tocar una tarjeta navega a PantallaDetalle pasando
// el Pokémon completo por parámetros de navegación.
//
// ¿DE DÓNDE VIENEN LOS FAVORITOS?
// Del hook useFavoritos() (ver src/contexto/FavoritosContext.js). Esta
// pantalla NO guarda su propio estado de favoritos: solo lo LEE del contexto
// global, para poder pintar el corazón en las tarjetas y el contador.
// -----------------------------------------------------------------------------

import { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ListaPokemon from '../componentes/ListaPokemon';
import BarraBusqueda from '../componentes/BarraBusqueda';
import SelectorHorizontal from '../componentes/SelectorHorizontal';
import EstadoCarga from '../componentes/EstadoCarga';
import EstadoError from '../componentes/EstadoError';

import { useFavoritos } from '../contexto/FavoritosContext';
import { obtenerListaPokemon, obtenerPokemonPorNombre } from '../servicios/pokeApi';
import { GENERACIONES, TIEMPO_DEBOUNCE_MS } from '../utils/constantes';
import { colores } from '../estilos/colores';

// Convertimos GENERACIONES (que está en utils/constantes.js con offset/limit)
// al formato { valor, etiqueta } que espera el componente genérico
// SelectorHorizontal. Lo hacemos una sola vez, fuera del componente, porque
// no depende de ningún estado.
const OPCIONES_GENERACION = GENERACIONES.map((gen, indice) => ({
  valor: String(indice),
  etiqueta: gen.label,
}));

export default function PantallaInicio({ navigation }) {
  // --- Estados de la lista principal ---
  const [listaPokemon, setListaPokemon] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [generacionSeleccionada, setGeneracionSeleccionada] = useState('0');

  // --- Estados de búsqueda ---
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [enModoBusqueda, setEnModoBusqueda] = useState(false);

  // useRef guarda el identificador del temporizador del debounce SIN causar
  // un nuevo render cada vez que cambia (a diferencia de useState).
  const referenciaDebounce = useRef(null);

  // Leemos del contexto global: la lista de favoritos, la función para saber
  // si un Pokémon ya es favorito y las funciones para modificar la lista (se
  // pasan a PantallaDetalle vía navegación... en realidad no hace falta
  // pasarlas: PantallaDetalle también puede usar useFavoritos() directamente).
  const { favoritos, esFavorito } = useFavoritos();

  // ---------------------------------------------------------------------
  // cargarPagina: pide a la PokeAPI el bloque de Pokémon correspondiente a
  // la generación seleccionada. Se declara con useCallback para que su
  // referencia sea estable entre renders (la usa el useEffect de abajo).
  // ---------------------------------------------------------------------
  const cargarPagina = useCallback(async (offset, limit) => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerListaPokemon(offset, limit);
      setListaPokemon(datos);
    } catch (err) {
      setError('No se pudo cargar la lista de pokemon. Revisa tu conexión.');
    } finally {
      setCargando(false);
    }
  }, []);

  // ---------------------------------------------------------------------
  // Cada vez que cambia la generación seleccionada, salimos del modo
  // búsqueda y recargamos la lista con el offset de esa generación.
  // ---------------------------------------------------------------------
  useEffect(() => {
    setTextoBusqueda('');
    setEnModoBusqueda(false);
    const indice = Number(generacionSeleccionada);
    const { offset, limit } = GENERACIONES[indice];
    cargarPagina(offset, limit);
  }, [generacionSeleccionada, cargarPagina]);

  // ---------------------------------------------------------------------
  // Debounce de la búsqueda: cada vez que "textoBusqueda" cambia, esperamos
  // TIEMPO_DEBOUNCE_MS antes de llamar a la API, y si el usuario escribe
  // otra letra antes de que pase ese tiempo, cancelamos el temporizador
  // anterior y empezamos de nuevo. Así evitamos una petición por cada
  // pulsación de tecla.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (referenciaDebounce.current) {
      clearTimeout(referenciaDebounce.current);
    }

    const texto = textoBusqueda.trim();

    // Si el campo quedó vacío, salimos del modo búsqueda y mostramos de
    // nuevo la lista de la generación actual (sin llamar a la API otra vez
    // si ya la teníamos cargada).
    if (texto.length === 0) {
      if (enModoBusqueda) {
        setEnModoBusqueda(false);
        const indice = Number(generacionSeleccionada);
        const { offset, limit } = GENERACIONES[indice];
        cargarPagina(offset, limit);
      }
      return;
    }

    // Esperamos al menos 3 letras para no buscar con textos demasiado cortos.
    if (texto.length < 3) return;

    referenciaDebounce.current = setTimeout(async () => {
      try {
        setBuscando(true);
        setEnModoBusqueda(true);
        setError(null);
        const resultado = await obtenerPokemonPorNombre(texto.toLowerCase());
        setListaPokemon([resultado]);
      } catch (err) {
        setListaPokemon([]);
        setError(`No se encontró "${texto}" en la Pokédex.`);
      } finally {
        setBuscando(false);
      }
    }, TIEMPO_DEBOUNCE_MS);

    // Función de limpieza: si el componente cambia de valor de nuevo (o se
    // desmonta) antes de que se cumpla el tiempo, cancelamos el temporizador
    // pendiente para no disparar una búsqueda "vieja".
    return () => clearTimeout(referenciaDebounce.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textoBusqueda]);

  const irADetalle = (pokemon) => {
    navigation.navigate('Detalle', { pokemon });
  };

  const irAFavoritos = () => {
    navigation.navigate('Favoritos');
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda('');
  };

  return (
    <SafeAreaView style={estilos.contenedor} edges={['bottom', 'left', 'right']}>
      {/* El selector de generación se oculta mientras se está en modo
          búsqueda, porque en ese momento la lista no representa una
          generación sino un resultado de búsqueda. */}
      {!enModoBusqueda && (
        <SelectorHorizontal
          opciones={OPCIONES_GENERACION}
          valorSeleccionado={generacionSeleccionada}
          onSeleccionar={setGeneracionSeleccionada}
        />
      )}

      <View style={estilos.barraAcciones}>
        <BarraBusqueda
          valor={textoBusqueda}
          onCambiarTexto={setTextoBusqueda}
          onLimpiar={limpiarBusqueda}
          buscando={buscando}
        />
        <Pressable style={estilos.botonFavoritos} onPress={irAFavoritos}>
          <Text style={estilos.textoBotonFavoritos}>❤️ {favoritos.length}</Text>
        </Pressable>
      </View>

      {cargando && <EstadoCarga mensaje="Cargando Pokédex..." />}

      {!cargando && error && (
        <EstadoError
          mensaje={error}
          onReintentar={() => {
            if (enModoBusqueda) {
              // Reintenta la misma búsqueda forzando el useEffect: como el
              // texto no cambió, disparamos manualmente el mismo flujo.
              setTextoBusqueda((actual) => actual);
            } else {
              const indice = Number(generacionSeleccionada);
              const { offset, limit } = GENERACIONES[indice];
              cargarPagina(offset, limit);
            }
          }}
        />
      )}

      {!cargando && !error && (
        <ListaPokemon
          listaPokemon={listaPokemon}
          onPressPokemon={irADetalle}
          esFavorito={esFavorito}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  barraAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
  },
  botonFavoritos: {
    backgroundColor: colores.principal,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 25,
  },
  textoBotonFavoritos: {
    color: colores.textoSobreOscuro,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
