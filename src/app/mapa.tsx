import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MapaView, Marker, PROVIDER_GOOGLE } from '@/components/mapa';

import { obtenerDestinos } from '@/services/destinos';
import { registrarVisita } from '@/services/visitas';

type Destino = {
  id_destino: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  id_categoria: number;
  direccion: string;
};

function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}

function obtenerIconoCategoria(idCategoria: number) {
  switch (idCategoria) {
    case 1:
      return '🏖️';
    case 2:
      return '🌋';
    case 3:
      return '🏠';
    case 4:
      return '🏛️';
    case 5:
      return '🌳';
    case 6:
      return '🍽️';
    case 7:
      return '🌊';
    default:
      return '📍';
  }
}

export default function MapaScreen() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [filtro, setFiltro] = useState('Todos');
  const [destinoSeleccionado, setDestinoSeleccionado] =
    useState<Destino | null>(null);
  const [ubicacion, setUbicacion] = useState<Location.LocationObject | null>(null);
  const [visitados, setVisitados] = useState<number[]>([]);

  // Cargar ubicación del usuario
  useEffect(() => {
    async function obtenerUbicacion() {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.log('Permiso de ubicación denegado');
          return;
        }

        const location =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        setUbicacion(location);

        console.log(
          'UBICACIÓN:',
          location.coords.latitude,
          location.coords.longitude
        );
      } catch (error) {
        console.log(
          'No se pudo obtener la ubicación:',
          error
        );
      }
    }

    obtenerUbicacion();
  }, []);

  // Cargar destinos desde Supabase
  useEffect(() => {
    async function cargarDestinos() {
      try {
        const data = await obtenerDestinos();
        setDestinos(data ?? []);
      } catch (error) {
        console.error('ERROR MAPA:', error);
      }
    }

    cargarDestinos();
  }, []);

  // Filtros
  const destinosFiltrados =
    filtro === 'Todos'
      ? destinos
      : destinos.filter((destino) => {
          if (filtro === 'Playas') {
            return destino.id_categoria === 1;
          }

          if (filtro === 'Volcanes') {
            return destino.id_categoria === 2;
          }

          if (filtro === 'Parques') {
            return destino.id_categoria === 5;
          }

          return true;
        });

  // Destinos a menos de 1 km
  const destinosCercanos = ubicacion
    ? destinos.filter((destino) => {
        const distancia = calcularDistancia(
          ubicacion.coords.latitude,
          ubicacion.coords.longitude,
          Number(destino.latitud),
          Number(destino.longitud)
        );

        return distancia <= 1;
      })
    : [];

  console.log(
    'DESTINOS CERCANOS:',
    destinosCercanos.map((d) => d.nombre)
  );

 useEffect(() => {
  if (destinosCercanos.length === 0 || !ubicacion) {
    return;
  }

  const ubicacionActual = ubicacion;

  async function registrarDestinosCercanos() {
    for (const destino of destinosCercanos) {
      if (visitados.includes(destino.id_destino)) {
        continue;
      }

      try {
        await registrarVisita(
          destino.id_destino,
          ubicacionActual.coords.latitude,
          ubicacionActual.coords.longitude
        );

        setVisitados((actuales) => {
          if (actuales.includes(destino.id_destino)) {
            return actuales;
          }

          return [...actuales, destino.id_destino];
        });

        console.log(
          'VISITA REGISTRADA:',
          destino.nombre
        );
      } catch (error) {
        console.error(
          'ERROR REGISTRANDO VISITA:',
          error
        );
      }
    }
  }

  registrarDestinosCercanos();
}, [ubicacion, destinos]);

  return (
    <View style={styles.container}>

      {/* ENCABEZADO */}
      <View style={styles.header}>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Inicio</Text>
        </Pressable>

        <Text style={styles.title}>
          🗺️ Mapa Interactivo
        </Text>

        <View style={styles.filters}>
          {[
            'Todos',
            'Playas',
            'Volcanes',
            'Parques',
          ].map((categoria) => (
            <Pressable
              key={categoria}
              onPress={() => {
                setFiltro(categoria);
                setDestinoSeleccionado(null);
              }}
              style={[
                styles.filter,
                filtro === categoria &&
                  styles.filterActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filtro === categoria &&
                    styles.filterTextActive,
                ]}
              >
                {categoria}
              </Text>
            </Pressable>
          ))}
        </View>

      </View>

      {/* MAPA */}
      <MapaView
        provider={PROVIDER_GOOGLE}
        style={styles.map}

        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        zoomControlEnabled={true}

        showsUserLocation={true}
        showsMyLocationButton={true}

        initialRegion={{
          latitude: 13.7,
          longitude: -89.2,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >

        {/* DESTINOS */}
        {destinosFiltrados.map((destino) => (
          <Marker
            key={destino.id_destino}
            coordinate={{
              latitude: Number(destino.latitud),
              longitude: Number(destino.longitud),
            }}
            title={destino.nombre}
            description={destino.descripcion}
            onPress={() =>
              setDestinoSeleccionado(destino)
            }
          >
            <View
                style={[
                    styles.marker,
                    visitados.includes(destino.id_destino) &&
                    styles.markerVisited,
                ]}
                >
                <Text style={styles.markerIcon}>
                    {obtenerIconoCategoria(destino.id_categoria)}
                </Text>
                </View>
          </Marker>
        ))}

      </MapaView>

      {/* TARJETA DEL DESTINO */}
      {destinoSeleccionado && (
        <View style={styles.card}>

          <Pressable
            style={styles.closeButton}
            onPress={() =>
              setDestinoSeleccionado(null)
            }
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <Text style={styles.cardTitle}>
            {destinoSeleccionado.nombre}
          </Text>

          <Text style={styles.cardAddress}>
            {destinoSeleccionado.direccion}
          </Text>

          <Text
            numberOfLines={2}
            style={styles.cardDescription}
          >

            {destinoSeleccionado.descripcion}
          </Text>

            {visitados.includes(destinoSeleccionado.id_destino) && (
            <Text style={styles.visitedText}>
                🟢 Visitado
            </Text>
            )}

          <Pressable
            style={styles.button}
            onPress={() =>
              router.push(
                `/destinos/${destinoSeleccionado.id_destino}`
              )
            }
          >
            <Text style={styles.buttonText}>
              Ver más
            </Text>
          </Pressable>

        </View>
      )}

      {/* LEYENDA */}
      <View style={styles.legend}>

            <Text style={styles.legendTitle}>Leyenda</Text>
            <Text>🏖️ Playa</Text>
            <Text>🌋 Volcán</Text>
            <Text>🏠 Pueblo</Text>
            <Text>🏛️ Histórico</Text>
            <Text>🌳 Parque</Text>
            <Text>🌊 Lago</Text>
            <Text>🍽️ Restaurante</Text>

        {ubicacion && (
          <Text>🔵 Tu ubicación</Text>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: '#208AEF',
    paddingTop: 15,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  back: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },

  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  filters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#4B9BE8',
  },

  filterActive: {
    backgroundColor: 'white',
  },

  filterText: {
    color: 'white',
    fontSize: 13,
  },

  filterTextActive: {
    color: '#208AEF',
    fontWeight: 'bold',
  },

  map: {
    flex: 1,
  },

  marker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#8FA3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerIcon: {
    fontSize: 20,
  },

  legend: {
    position: 'absolute',
    top: 165,
    right: 12,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    gap: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  card: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  closeButton: {
    position: 'absolute',
    right: 12,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  closeText: {
    fontSize: 20,
    color: '#555',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 30,
  },

  cardAddress: {
    marginVertical: 4,
    color: '#666',
  },

  cardDescription: {
    color: '#444',
  },

  button: {
    marginTop: 10,
    backgroundColor: '#208AEF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  markerVisited: {
  backgroundColor: '#2DBE72',
  borderColor: '#087A42',
},
visitedText: {
  color: '#159447',
  fontWeight: 'bold',
  marginTop: 8,
}
});