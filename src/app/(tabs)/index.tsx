import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { obtenerDestinos } from '@/services/destinos';

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

export default function HomeScreen() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDestinos() {
      try {
        const data = await obtenerDestinos();
        setDestinos(data ?? []);
      } catch (error) {
        console.error('ERROR SUPABASE:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDestinos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>🇸🇻 Descubre El Salvador</Text>

        <Text style={styles.title}>Destinos turísticos</Text>

        <Text style={styles.subtitle}>
          Explora lugares increíbles y descubre tu próxima aventura.
        </Text>

        <Pressable
          style={styles.mapButton}
          onPress={() => router.push('/mapa')}
        >
          <Text style={styles.mapButtonText}>
             Explorar mapa
          </Text>
        </Pressable>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Lugares para descubrir</Text>

        <Text style={styles.count}>
          {destinos.length} destinos
        </Text>
      </View>

      {cargando ? (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>
            Cargando destinos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={destinos}
          keyExtractor={(item) => item.id_destino.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const categoria = obtenerCategoria(item.id_categoria);

            return (
              <Pressable
                style={styles.card}
                onPress={() =>
                  router.push(`/destinos/${item.id_destino}`)
                }
              >
                {item.imagen_portada ? (
                  <Image
                    source={{ uri: item.imagen_portada ?? '' }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoad={() => console.log('IMAGEN OK:', item.nombre)}
                    onError={(error) =>
                      console.log('ERROR IMAGEN:', item.nombre, error.nativeEvent.error)
                    }
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderIcon}>
                      {categoria.icono}
                    </Text>
                  </View>
                )}

                <View style={styles.cardContent}>
                  <View style={styles.category}>
                    <Text style={styles.categoryText}>
                      {categoria.icono} {categoria.nombre}
                    </Text>
                  </View>

                  <Text style={styles.cardTitle}>
                    {item.nombre}
                  </Text>

                  <Text style={styles.location}>
                     {item.direccion}
                  </Text>

                  <Text
                    style={styles.description}
                    numberOfLines={2}
                  >
                    {item.descripcion}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.points}>
                       Descubre este destino
                    </Text>

                    <Text style={styles.arrow}>
                      →
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🗺️</Text>
              <Text style={styles.emptyTitle}>
                No hay destinos disponibles
              </Text>
              <Text style={styles.emptyText}>
                No encontramos destinos para mostrar.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FBF7',
  },

  header: {
    backgroundColor: '#208AEF',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  eyebrow: {
    color: '#DDF1FF',
    fontSize: 14,
    marginBottom: 6,
  },

  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#EAF6FF',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
    maxWidth: 330,
  },

  mapButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },

  mapButtonText: {
    color: '#208AEF',
    fontWeight: 'bold',
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  listTitle: {
    color: '#123D2C',
    fontSize: 20,
    fontWeight: 'bold',
  },

  count: {
    color: '#20B875',
    fontWeight: 'bold',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 180,
  },

  imagePlaceholder: {
    height: 180,
    backgroundColor: '#D7F5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderIcon: {
    fontSize: 55,
  },

  cardContent: {
    padding: 16,
  },

  category: {
    alignSelf: 'flex-start',
    backgroundColor: '#D7F5E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 8,
  },

  categoryText: {
    color: '#168657',
    fontSize: 13,
    fontWeight: 'bold',
  },

  cardTitle: {
    color: '#123D2C',
    fontSize: 21,
    fontWeight: 'bold',
  },

  location: {
    color: '#777',
    fontSize: 14,
    marginTop: 5,
  },

  description: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 9,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },

  points: {
    color: '#20B875',
    fontSize: 13,
    fontWeight: 'bold',
  },

  arrow: {
    color: '#208AEF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#176B4D',
    fontSize: 16,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },

  emptyTitle: {
    color: '#123D2C',
    fontSize: 19,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#777',
    marginTop: 6,
    textAlign: 'center',
  },
});