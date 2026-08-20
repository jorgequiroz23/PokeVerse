// App.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE ARCHIVO?
// Es el punto de entrada de PokeVerse: el primer componente que React Native
// ejecuta al abrir la app. Su única responsabilidad es "montar" el árbol de
// providers que el resto de la aplicación necesita, en el orden correcto, y
// dentro de todo eso, renderizar el navegador (AppNavigator).
//
// ¿POR QUÉ ES TAN CORTO?
// Porque toda la lógica real está repartida en carpetas con responsabilidad
// única (componentes/, pantallas/, navegacion/, servicios/, contexto/,
// estilos/, utils/). App.js solo los conecta entre sí. Esto hace que el
// archivo raíz del proyecto sea fácil de leer de un vistazo, incluso para
// alguien que nunca vio el código antes.
//
// ORDEN DE LOS PROVIDERS (de afuera hacia adentro):
// 1) SafeAreaProvider: le da a toda la app la información de las "zonas
//    seguras" del dispositivo (el notch del iPhone, la barra de estado de
//    Android), para que SafeAreaView funcione bien en cualquier pantalla.
// 2) FavoritosProvider: pone a disposición de TODA la app el estado global
//    de favoritos (ver src/contexto/FavoritosContext.js).
// 3) AppNavigator: el Stack Navigator con las 4 pantallas de PokeVerse.
// -----------------------------------------------------------------------------

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navegacion/AppNavigator';
import { FavoritosProvider } from './src/contexto/FavoritosContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritosProvider>
        <AppNavigator />
        {/* StatusBar controla el color de los iconos de la barra superior del
            celular (hora, batería, señal). "light" los pinta blancos, ideal
            porque el header de PokeVerse es de fondo rojo oscuro. */}
        <StatusBar style="light" />
      </FavoritosProvider>
    </SafeAreaProvider>
  );
}
