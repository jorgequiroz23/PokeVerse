// src/contexto/FavoritosContext.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE ARCHIVO?
// Guarda el array de Pokémon favoritos en un solo lugar "central" (esto es lo
// que en React se llama "levantar el estado") y lo pone a disposición de
// CUALQUIER pantalla o componente de la app, sin tener que pasarlo a mano de
// padre a hijo a nieto por medio de props. Además, cada vez que la lista de
// favoritos cambia, la guarda automáticamente en el almacenamiento del
// celular (AsyncStorage) para que sobreviva a cerrar y volver a abrir la app.
//
// ¿QUÉ ES LA CONTEXT API DE REACT?
// Es una herramienta de React (no es una librería externa) que permite crear
// una especie de "caja compartida" de datos. Un componente "Provider" (aquí,
// FavoritosProvider) guarda los datos y las funciones para modificarlos.
// Cualquier componente descendiente puede "engancharse" a esa caja con el
// hook useFavoritos() y leer o modificar los datos, sin importar cuántos
// niveles de componentes haya en el medio. Es la alternativa moderna y más
// limpia a pasar funciones por route.params en cada Stack.Screen.
//
// ¿QUÉ EXPORTA ESTE ARCHIVO?
// - FavoritosProvider: componente que envuelve la app entera en App.js.
// - useFavoritos: hook que cualquier pantalla usa para leer/modificar
//   favoritos, por ejemplo: const { favoritos, agregarFavorito } = useFavoritos()
// -----------------------------------------------------------------------------

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CLAVE_FAVORITOS } from '../utils/constantes';

// Creamos el "contenedor" de contexto. Empieza en null porque todavía no
// tiene ningún valor real: ese valor se lo da FavoritosProvider más abajo.
const FavoritosContext = createContext(null);

/**
 * FavoritosProvider
 * -----------------------------------------------------------------------
 * Componente que debe envolver toda la aplicación (lo hacemos una sola vez,
 * en App.js). Se encarga de:
 *   1) Mantener el array "favoritos" en memoria con useState.
 *   2) Cargarlo desde AsyncStorage la primera vez que la app arranca.
 *   3) Guardarlo en AsyncStorage cada vez que se agrega o se quita un favorito.
 *   4) Exponer funciones simples (agregarFavorito, quitarFavorito, esFavorito)
 *      para que el resto de la app no tenga que saber nada de AsyncStorage.
 *
 * @param {{ children: React.ReactNode }} props - los componentes hijos que
 *        van a poder usar useFavoritos() (en nuestro caso, todo el navegador)
 */
export function FavoritosProvider({ children }) {
  // Estado con el array completo de Pokémon favoritos. Arranca vacío: se
  // llena con lo que haya guardado en AsyncStorage (si hay algo) mediante
  // el useEffect de más abajo.
  const [favoritos, setFavoritos] = useState([]);

  // Bandera para saber si ya terminamos de leer AsyncStorage. Es útil por si
  // alguna pantalla quisiera mostrar un pequeño loading mientras se cargan
  // los favoritos guardados (evita el "parpadeo" de mostrar la lista vacía
  // un instante antes de que aparezcan los favoritos reales).
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true);

  // ---------------------------------------------------------------------
  // Cargar los favoritos guardados cuando el Provider se monta por primera
  // vez (es decir, cuando la app arranca). El array de dependencias vacío
  // [] le dice a React "ejecuta esto una sola vez".
  // ---------------------------------------------------------------------
  useEffect(() => {
    const cargarFavoritosGuardados = async () => {
      try {
        const guardado = await AsyncStorage.getItem(CLAVE_FAVORITOS);
        // AsyncStorage.getItem devuelve null si la clave nunca se guardó
        // (por ejemplo, la primera vez que alguien abre PokeVerse).
        if (guardado !== null) {
          setFavoritos(JSON.parse(guardado));
        }
      } catch (error) {
        console.error('Error al cargar favoritos guardados:', error);
      } finally {
        setCargandoFavoritos(false);
      }
    };

    cargarFavoritosGuardados();
  }, []);

  // ---------------------------------------------------------------------
  // guardarYActualizar
  // Función auxiliar interna: recibe el array NUEVO de favoritos, actualiza
  // el estado de React (para que la pantalla se redibuje) y además lo
  // persiste en AsyncStorage convertido a texto JSON (AsyncStorage solo
  // guarda strings). Tanto agregarFavorito como quitarFavorito terminan
  // llamando a esta función para no repetir la lógica de guardado.
  //
  // Usamos useCallback para que esta función no se vuelva a crear en cada
  // render: así los componentes que dependen de ella (por useEffect, etc.)
  // no se re-ejecutan sin necesidad.
  // ---------------------------------------------------------------------
  const guardarYActualizar = useCallback(async (nuevosFavoritos) => {
    setFavoritos(nuevosFavoritos);
    try {
      await AsyncStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(nuevosFavoritos));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  }, []);

  // ---------------------------------------------------------------------
  // agregarFavorito
  // Agrega un pokemon al array de favoritos, solo si todavía no estaba.
  // Usamos el spread operator (...favoritos) para crear un ARRAY NUEVO en
  // lugar de modificar el array original con .push(): React solo detecta
  // cambios cuando le damos una referencia nueva.
  // ---------------------------------------------------------------------
  const agregarFavorito = useCallback(
    (pokemon) => {
      setFavoritos((favoritosActuales) => {
        const yaExiste = favoritosActuales.some((fav) => fav.id === pokemon.id);
        if (yaExiste) return favoritosActuales;
        const nuevosFavoritos = [...favoritosActuales, pokemon];
        // Guardamos en AsyncStorage "en paralelo" (no bloqueamos el render).
        AsyncStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(nuevosFavoritos)).catch(
          (error) => console.error('Error al guardar favoritos:', error)
        );
        return nuevosFavoritos;
      });
    },
    []
  );

  // ---------------------------------------------------------------------
  // quitarFavorito
  // Quita un pokemon del array de favoritos por su id, usando .filter()
  // (que también devuelve un array NUEVO sin modificar el original).
  // ---------------------------------------------------------------------
  const quitarFavorito = useCallback((idPokemon) => {
    setFavoritos((favoritosActuales) => {
      const nuevosFavoritos = favoritosActuales.filter((fav) => fav.id !== idPokemon);
      AsyncStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(nuevosFavoritos)).catch(
        (error) => console.error('Error al guardar favoritos:', error)
      );
      return nuevosFavoritos;
    });
  }, []);

  // ---------------------------------------------------------------------
  // quitarFavoritosPorTipo
  // Reto opcional del Sprint 5: elimina de un solo toque todos los
  // favoritos que tengan un tipo determinado.
  // ---------------------------------------------------------------------
  const quitarFavoritosPorTipo = useCallback((tipo) => {
    setFavoritos((favoritosActuales) => {
      const nuevosFavoritos = favoritosActuales.filter(
        (fav) => !fav.tipos.includes(tipo)
      );
      AsyncStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(nuevosFavoritos)).catch(
        (error) => console.error('Error al guardar favoritos:', error)
      );
      return nuevosFavoritos;
    });
  }, []);

  // ---------------------------------------------------------------------
  // esFavorito
  // Función de consulta: dado un id, dice si ese Pokémon ya está en la
  // lista de favoritos. Usa .some(), que devuelve true/false (a diferencia
  // de .filter(), que devolvería un array).
  // ---------------------------------------------------------------------
  const esFavorito = useCallback(
    (idPokemon) => favoritos.some((fav) => fav.id === idPokemon),
    [favoritos]
  );

  // El "value" es el objeto con todo lo que queremos compartir con el resto
  // de la app. Cualquier pantalla que use useFavoritos() recibirá esto.
  const value = {
    favoritos,
    cargandoFavoritos,
    agregarFavorito,
    quitarFavorito,
    quitarFavoritosPorTipo,
    esFavorito,
  };

  return (
    <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>
  );
}

/**
 * useFavoritos
 * -----------------------------------------------------------------------
 * Hook personalizado para consumir el FavoritosContext de forma cómoda y
 * segura. En lugar de que cada pantalla escriba
 * "useContext(FavoritosContext)" y tenga que importar FavoritosContext,
 * simplemente escriben "useFavoritos()".
 *
 * También valida que el hook se use DENTRO de un FavoritosProvider: si
 * alguien lo usa por error fuera (por ejemplo, en una pantalla que no está
 * dentro del árbol de App.js), lanza un error claro en vez de fallar de
 * forma confusa más adelante.
 */
export function useFavoritos() {
  const contexto = useContext(FavoritosContext);
  if (contexto === null) {
    throw new Error('useFavoritos debe usarse dentro de un <FavoritosProvider>');
  }
  return contexto;
}
