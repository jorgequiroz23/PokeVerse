// src/pantallas/PantallaDetalle.js
// -----------------------------------------------------------------------------
// ¿QUÉ HACE ESTA PANTALLA?
// Muestra la ficha completa de UN Pokémon (historia de usuario #3: "ver
// detalle"): imagen grande, número de Pokédex, tipos, botón de favorito,
// altura, peso, estadísticas de combate con barras de progreso y
// habilidades. También ofrece un botón para enviar este Pokémon a la
// pantalla de comparación (historia de usuario #5).
//
// ¿DE DÓNDE SALE EL POKÉMON?
// Llega por parámetros de navegación: quien navegó hasta aquí (PantallaInicio
// o PantallaFavoritos) lo hizo con
//   navigation.navigate('Detalle', { pokemon })
// y aquí lo recuperamos con route.params.pokemon.
//
// ¿Y EL ESTADO DE FAVORITO?
// Ya NO es un useState local (como en el Sprint 3): usamos directamente
// useFavoritos() del contexto global, así que el corazón que se ve aquí es
// EXACTAMENTE el mismo estado que ve PantallaInicio y PantallaFavoritos. Si
// se agrega o quita un favorito desde cualquier pantalla, todas se actualizan
// solas.
// -----------------------------------------------------------------------------

import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import InsigniasTipo from '../componentes/InsigniasTipo';
import BarraEstadistica from '../componentes/BarraEstadistica';
import BotonPrimario from '../componentes/BotonPrimario';

import { useFavoritos } from '../contexto/FavoritosContext';
import { COLORES_TIPO } from '../utils/constantes';
import { colores } from '../estilos/colores';

export default function PantallaDetalle({ route, navigation }) {
  const { pokemon } = route.params;
  const { agregarFavorito, quitarFavorito, esFavorito } = useFavoritos();

  // Consultamos el contexto global cada vez que se renderiza: así, si el
  // usuario agrega el favorito, toca "atrás" y vuelve a entrar, el corazón
  // refleja el estado correcto sin ningún truco adicional.
  const favoritoActual = esFavorito(pokemon.id);

  const alternarFavorito = () => {
    if (favoritoActual) {
      quitarFavorito(pokemon.id);
    } else {
      agregarFavorito(pokemon);
    }
  };

  const irAComparar = () => {
    // Enviamos este Pokémon como "pokemonA" inicial de la comparación.
    navigation.navigate('Comparacion', { pokemonA: pokemon });
  };

  const tipoPrincipal = pokemon.tipos[0];
  const colorTema = COLORES_TIPO[tipoPrincipal] || colores.principal;

  return (
    <SafeAreaView style={estilos.contenedor} edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Encabezado con el color del tipo principal de fondo */}
        <View style={[estilos.header, { backgroundColor: colorTema }]}>
          <Text style={estilos.numero}>#{String(pokemon.id).padStart(3, '0')}</Text>
          <Image
            source={{ uri: pokemon.imagen }}
            style={estilos.imagen}
            resizeMode="contain"
          />
          <Text style={estilos.nombre}>{pokemon.nombre}</Text>
          <View style={estilos.tipos}>
            {pokemon.tipos.map((tipo, indice) => (
              <InsigniasTipo key={indice} tipo={tipo} />
            ))}
          </View>
        </View>

        {/* Botón de favorito: usa el estado GLOBAL del contexto */}
        <BotonPrimario
          texto={favoritoActual ? '❤️  Quitar de favoritos' : '🤍  Agregar a favoritos'}
          variante="contorno"
          onPress={alternarFavorito}
          estiloContenedor={estilos.botonFavorito}
        />

        {/* Dimensiones: la PokeAPI entrega altura en decímetros y peso en
            hectogramos, por eso dividimos entre 10 para mostrar metros/kg. */}
        <View style={estilos.dimensiones}>
          <View style={estilos.dimItem}>
            <Text style={estilos.dimEtiqueta}>Altura</Text>
            <Text style={estilos.dimValor}>{(pokemon.altura / 10).toFixed(1)} m</Text>
          </View>
          <View style={estilos.dimDivisor} />
          <View style={estilos.dimItem}>
            <Text style={estilos.dimEtiqueta}>Peso</Text>
            <Text style={estilos.dimValor}>{(pokemon.peso / 10).toFixed(1)} kg</Text>
          </View>
        </View>

        {/* Estadísticas de combate */}
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>Estadísticas</Text>
          {pokemon.stats.map((stat) => (
            <BarraEstadistica key={stat.nombre} nombre={stat.nombre} valor={stat.valor} />
          ))}
        </View>

        {/* Habilidades */}
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>Habilidades</Text>
          <View style={estilos.habilidades}>
            {pokemon.habilidades.map((habilidad, indice) => (
              <View key={indice} style={estilos.tagHabilidad}>
                <Text style={estilos.textoHabilidad}>{habilidad}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botón para comparar este pokemon con otro (historia #5) */}
        <View style={estilos.seccion}>
          <BotonPrimario texto="⚖️  Comparar con otro pokemon" onPress={irAComparar} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.tarjeta,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  numero: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  imagen: {
    width: 200,
    height: 200,
  },
  nombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colores.textoSobreOscuro,
    textTransform: 'capitalize',
    marginTop: 8,
  },
  tipos: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  botonFavorito: {
    margin: 16,
  },
  dimensiones: {
    flexDirection: 'row',
    backgroundColor: '#FEF9E7',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  dimItem: {
    flex: 1,
    alignItems: 'center',
  },
  dimDivisor: {
    width: 1,
    backgroundColor: colores.acento,
  },
  dimEtiqueta: {
    fontSize: 12,
    color: colores.textoClaro,
    marginBottom: 4,
  },
  dimValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
  },
  seccion: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colores.acento,
    paddingBottom: 6,
  },
  habilidades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagHabilidad: {
    backgroundColor: '#EAF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  textoHabilidad: {
    fontSize: 13,
    color: '#2980B9',
    textTransform: 'capitalize',
  },
});
