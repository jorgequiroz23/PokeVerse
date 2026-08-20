// src/navegacion/AppNavigator.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE ARCHIVO?
// Configura la navegación completa de PokeVerse usando React Navigation
// (Native Stack). Define las 4 pantallas de la app y cómo se ve el header
// nativo (color de fondo, color del texto) para todas ellas.
//
// ¿POR QUÉ ESTÁ SEPARADO DE App.js?
// App.js debería encargarse solo de "arrancar" la aplicación (envolver todo
// con los providers necesarios). Meter aquí la configuración del Stack
// Navigator mantiene App.js pequeño y hace que la navegación se pueda leer,
// entender y modificar sin tener que abrir el archivo raíz del proyecto.
// -----------------------------------------------------------------------------

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PantallaInicio from '../pantallas/PantallaInicio';
import PantallaDetalle from '../pantallas/PantallaDetalle';
import PantallaFavoritos from '../pantallas/PantallaFavoritos';
import PantallaComparacion from '../pantallas/PantallaComparacion';
import { colores } from '../estilos/colores';

// createNativeStackNavigator() crea un "Stack": una pila de pantallas donde
// cada pantalla nueva se apila sobre la anterior (como una pila de cartas) y
// el botón de "atrás" del header quita la de encima, mostrando la anterior.
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    // NavigationContainer es el componente raíz OBLIGATORIO de React
    // Navigation: administra el estado de navegación de toda la app (en qué
    // pantalla estamos, el historial, etc.).
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colores.principal },
          headerTintColor: colores.textoSobreOscuro,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Inicio"
          component={PantallaInicio}
          options={{ title: 'PokeVerse2026' }}
        />

        <Stack.Screen
          name="Detalle"
          component={PantallaDetalle}
          // "options" puede ser una función que recibe { route } cuando el
          // título depende de un parámetro de navegación (aquí, el nombre
          // del pokemon que se está mostrando).
          options={({ route }) => ({
            title: route.params?.pokemon?.nombre ?? 'Detalle',
          })}
        />

        <Stack.Screen
          name="Favoritos"
          component={PantallaFavoritos}
          options={{ title: 'Mis Favoritos' }}
        />

        <Stack.Screen
          name="Comparacion"
          component={PantallaComparacion}
          options={{ title: 'Comparar Pokémon' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
