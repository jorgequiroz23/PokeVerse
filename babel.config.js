// babel.config.js
// -----------------------------------------------------------------------------
// Este archivo le dice a Babel (el "traductor" que convierte JSX y JavaScript
// moderno en algo que el motor de React Native puede ejecutar) qué reglas usar.
// "babel-preset-expo" ya trae todo lo necesario para un proyecto Expo estándar:
// soporte de JSX, de las últimas funciones de JavaScript, etc.
// No necesitamos tocar nada más aquí para un proyecto sin TypeScript.
// -----------------------------------------------------------------------------
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
