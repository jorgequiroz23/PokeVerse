# PokeVerse · Pokédex Avanzada

Aplicación móvil de Pokédex construida con **React Native + Expo**, que
consume datos reales de la [PokeAPI](https://pokeapi.co). Incluye lista de
Pokémon con filtro de generación, búsqueda en tiempo real, detalle completo
con estadísticas, favoritos persistentes y un comparador de estadísticas
entre dos Pokémon.

## Versiones exactas del proyecto

| Herramienta | Versión |
|---|---|
| Node.js | 22.22.0 LTS |
| npm | 11.x |
| Expo SDK | 54 |
| React | 19.1.0 |
| React Native | 0.81.5 |

No se usa TypeScript ni Expo Router: navegación 100% con React Navigation
(Native Stack) y JavaScript puro.

## Cómo correrlo

```bash
npm install
npx expo start
```

Luego escanea el código QR con la app **Expo Go** desde tu celular (Android
o iOS). Asegúrate de que el celular y el computador estén en la misma red
WiFi; si no conectan, usa `npx expo start --tunnel`.

> Si `npm install` marca alguna advertencia de versión de una dependencia
> nativa (react-native-screens, safe-area-context o async-storage), corre
> `npx expo install --check` y deja que Expo ajuste automáticamente esas
> versiones a las compatibles con tu SDK exacto, sin tocar React, React
> Native ni Expo en sí.

## Funcionalidades (las 5 historias del MVP)

1. **Ver lista de pokemon** — `PantallaInicio`, con filtro de generación
   (Gen 1 a Gen 8) y grilla de 2 columnas con `FlatList`.
2. **Buscar pokemon** — campo de búsqueda controlado con debounce de 600ms
   contra la PokeAPI en tiempo real.
3. **Ver detalle** — `PantallaDetalle`, con imagen, tipos, estadísticas
   (barras de progreso), habilidades, altura y peso.
4. **Guardar favoritos** — estado global en `FavoritosContext` con
   persistencia en `AsyncStorage`; `PantallaFavoritos` permite filtrarlos
   por tipo y quitarlos.
5. **Comparar pokemon** — `PantallaComparacion`, elige dos Pokémon (de tus
   favoritos o buscando en la API) y compara sus 6 estadísticas lado a lado.

## Arquitectura del proyecto

```
PokeVerse/
├── App.js                      # Punto de entrada: monta los providers y el navegador
├── app.json                    # Configuración de Expo (nombre, icono, splash)
├── babel.config.js
├── package.json
├── assets/                     # icon.png, splash.png, adaptive-icon.png
└── src/
    ├── componentes/            # Piezas de UI reutilizables, sin lógica de red
    │   ├── Encabezado.js
    │   ├── BarraBusqueda.js
    │   ├── SelectorHorizontal.js
    │   ├── InsigniasTipo.js
    │   ├── TarjetaPokemon.js
    │   ├── ListaPokemon.js
    │   ├── FilaFavorito.js
    │   ├── BarraEstadistica.js
    │   ├── ComparadorEstadisticas.js
    │   ├── CabeceraComparacion.js
    │   ├── BotonPrimario.js
    │   ├── EstadoCarga.js
    │   ├── EstadoError.js
    │   └── PiePagina.js
    ├── pantallas/               # Una pantalla = una responsabilidad de negocio
    │   ├── PantallaInicio.js
    │   ├── PantallaDetalle.js
    │   ├── PantallaFavoritos.js
    │   └── PantallaComparacion.js
    ├── navegacion/
    │   └── AppNavigator.js      # Stack Navigator con las 4 pantallas
    ├── servicios/
    │   └── pokeApi.js           # Única capa que llama a fetch() contra la PokeAPI
    ├── contexto/
    │   └── FavoritosContext.js  # Estado global de favoritos + AsyncStorage
    ├── estilos/
    │   └── colores.js           # Paleta de colores compartida
    └── utils/
        ├── constantes.js        # URLs, colores por tipo, generaciones, claves
        └── transformadores.js   # Convierte la respuesta cruda de la PokeAPI
```

### Decisiones de arquitectura

- **Capa de servicios (`servicios/pokeApi.js`)**: ninguna pantalla llama a
  `fetch` directamente. Todas las peticiones de red pasan por este único
  archivo, así que si la fuente de datos cambiara, solo se edita un lugar.
- **Context API para favoritos**, en lugar de pasar el estado y las
  funciones a mano por cada `Stack.Screen`: cualquier pantalla llama a
  `useFavoritos()` y obtiene la lista de favoritos siempre sincronizada,
  sin importar cuántos niveles de navegación haya entre ellas.
- **Componentes de un solo propósito**: cada archivo de `componentes/`
  resuelve una sola cosa (una tarjeta, una barra de búsqueda, un selector
  horizontal genérico reutilizado tanto para generaciones como para
  tipos, etc.), siguiendo el principio de responsabilidad única.
- **`utils/` separa datos fijos (`constantes.js`) de lógica pura
  (`transformadores.js`)**, para que ambos se puedan probar o reutilizar
  de forma independiente.

## Tecnologías

- React Native + Expo (SDK 54)
- React Navigation (Native Stack)
- PokeAPI (pokeapi.co)
- Context API + Hooks (`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`)
- `@react-native-async-storage/async-storage` para persistencia local
- `FlatList` para listas nativas optimizadas

## Autor

Proyecto universitario PokeVerse — Técnico en Programación de Software.
