import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MapaView, Marker } from '@/components/mapa';

import { obtenerDestino } from '@/services/destinos';

type Destino = {
  id_destino: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  direccion: string;
  id_categoria: number;
  imagen_portada?: string | null;
};

function obtenerCategoria(idCategoria: number) {
  switch (idCategoria) {
    case 1:
      return { nombre: 'Playa', icono: '🏖️' };
    case 2:
      return { nombre: 'Volcán', icono: '🌋' };
    case 3:
      return { nombre: 'Pueblo', icono: '🏠' };
    case 4:
      return { nombre: 'Histórico', icono: '🏛️' };
    case 5:
      return { nombre: 'Parque', icono: '🌳' };
    case 6:
      return { nombre: 'Restaurante', icono: '🍽️' };
    default:
      return { nombre: 'Destino', icono: '📍' };
  }
}

function abrirGoogleMaps(latitud: number, longitud: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`;

  Linking.openURL(url).catch((error) => {
    console.error('ERROR GOOGLE MAPS:', error);
  });
}

export default function DestinoDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [destino, setDestino] = useState<Destino | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDestino() {
      try {
        const data = await obtenerDestino(Number(id));
        setDestino(data);
      } catch (error) {
        console.error('ERROR DESTINO:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDestino();
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Cargando destino...</Text>
      </View>
    );
  }

  if (!destino) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>No se pudo cargar el destino</Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const categoria = obtenerCategoria(destino.id_categoria);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          {destino.imagen_portada ? (
            <Image
              source={{ uri: destino.imagen_portada ?? '' }}
              style={styles.coverImage}
              resizeMode="cover"
              onLoad={() => console.log('IMAGEN DETALLE OK:', destino.nombre)}
              onError={(error) =>
                console.log(
                  'ERROR IMAGEN DETALLE:',
                  destino.nombre,
                  error.nativeEvent.error
                )
              }
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>
                {categoria.icono}
              </Text>
              <Text style={styles.placeholderText}>
                {destino.nombre}
              </Text>
            </View>
          )}

          <Pressable
            style={styles.backCircle}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>

          <Pressable style={styles.favoriteCircle}>
            <Text style={styles.favoriteIcon}>♡</Text>
          </Pressable>

          <View style={styles.heroInfo}>
            <Text style={styles.title}>{destino.nombre}</Text>
            <Text style={styles.address}>
               {destino.direccion}
            </Text>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.category}>
            <Text style={styles.categoryText}>
              {categoria.icono} {categoria.nombre}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre este lugar</Text>

          <Text style={styles.description}>
            {destino.descripcion}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          <View style={styles.mapContainer}>
            <MapaView
              style={styles.map}
              initialRegion={{
                latitude: Number(destino.latitud),
                longitude: Number(destino.longitud),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: Number(destino.latitud),
                  longitude: Number(destino.longitud),
                }}
                title={destino.nombre}
              />
            </MapaView>

            <Pressable
              style={styles.mapButton}
              onPress={() =>
                abrirGoogleMaps(
                  Number(destino.latitud),
                  Number(destino.longitud)
                )
              }
            >
              <Text style={styles.mapButtonText}>
                Abrir mapa →
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.visitCard}>
          <Text style={styles.visitTitle}>
             Registrar mi visita
          </Text>
          <Text style={styles.visitText}>
            Sube una foto y gana puntos
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            abrirGoogleMaps(
              Number(destino.latitud),
              Number(destino.longitud)
            )
          }
        >
          <Text style={styles.primaryButtonText}>
             Ir a este destino
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FBF7',
  },

  content: {
    paddingBottom: 30,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FBF7',
  },

  loadingText: {
    color: '#176B4D',
    fontSize: 18,
  },

  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123D2C',
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: '#208AEF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  hero: {
    height: 300,
    position: 'relative',
    backgroundColor: '#B8E4D2',
  },

  coverImage: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B8E4D2',
  },

  placeholderIcon: {
    fontSize: 55,
  },

  placeholderText: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#176B4D',
  },

  backCircle: {
    position: 'absolute',
    top: 20,
    left: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30,45,55,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    color: 'white',
    fontSize: 28,
  },

  favoriteCircle: {
    position: 'absolute',
    top: 20,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30,45,55,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteIcon: {
    color: 'white',
    fontSize: 28,
  },

  heroInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  address: {
    color: 'white',
    fontSize: 15,
    marginTop: 6,
  },

  info: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  category: {
    alignSelf: 'flex-start',
    backgroundColor: '#D7F5E8',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },

  categoryText: {
    color: '#168657',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderRadius: 18,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#123D2C',
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },

  mapContainer: {
    height: 210,
    borderRadius: 16,
    overflow: 'hidden',
  },

  map: {
    flex: 1,
  },

  mapButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#208AEF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },

  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  visitCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFF0D7',
    borderWidth: 1,
    borderColor: '#FFB84D',
  },

  visitTitle: {
    color: '#E85D04',
    fontSize: 17,
    fontWeight: 'bold',
  },

  visitText: {
    color: '#8A4B08',
    marginTop: 5,
  },

  primaryButton: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#20B875',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});