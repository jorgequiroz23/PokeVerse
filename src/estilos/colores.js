// src/estilos/colores.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTE ARCHIVO?
// Define la paleta de colores oficial de PokeVerse (rojo Pokébola y dorado)
// junto con los colores "neutros" que usamos para fondos, texto y bordes en
// toda la aplicación.
//
// ¿POR QUÉ EXISTE?
// Igual que con constantes.js: si el color principal de la marca cambiara,
// solo se edita este archivo una vez, en lugar de buscar "#C0392B" en los 15
// componentes que lo usan. Además, tener los colores con nombres (colores.principal
// en vez de '#C0392B') hace que el código de los componentes sea más fácil de
// leer: se entiende la intención ("el color principal") sin memorizar códigos
// hexadecimales.
// -----------------------------------------------------------------------------
export const colores = {
  // Colores de marca de PokeVerse
  principal: '#C0392B', // rojo Pokébola: encabezados, botones primarios
  principalOscuro: '#96281B', // variante oscura para estados presionados
  acento: '#F39C12', // dorado: subtítulos, detalles decorativos

  // Colores de fondo
  fondo: '#F5F5F5', // fondo general de las pantallas
  tarjeta: '#FFFFFF', // fondo de tarjetas y superficies elevadas

  // Colores de estado
  exito: '#27AE60', // stats altos, confirmaciones
  advertencia: '#F39C12', // stats medios
  peligro: '#E74C3C', // stats bajos, errores

  // Colores de texto
  texto: '#2C3E50', // texto principal, oscuro
  textoClaro: '#7F8C8D', // texto secundario / auxiliar
  textoSobreOscuro: '#FFFFFF', // texto sobre fondos de color fuerte

  // Otros
  borde: '#E0E0E0', // bordes y separadores
  favorito: '#FADBD8', // fondo del botón de favorito activo
};
