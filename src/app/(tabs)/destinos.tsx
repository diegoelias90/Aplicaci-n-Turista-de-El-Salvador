/**
 * Catálogo de destinos.
 * Buscador, filtro por categoría y lista con FlatList.
 *
 * Se usa FlatList y no map(): map() monta los 10 destinos de una vez
 * aunque en pantalla se vean tres. Con imágenes, la diferencia se nota.
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Buscador } from '@/components/destinos/buscador';
import { FiltroCategorias } from '@/components/destinos/filtro-categorias';
import { TarjetaDestino } from '@/components/destinos/tarjeta-destino';
import { Cargando } from '@/components/ui/cargando';
import { EstadoVacio } from '@/components/ui/estado-vacio';
import { AltoBarraTabs, Colores, Espacio } from '@/constants/theme';
import { Mensajes } from '@/constants/mensajes';
import { useDestinos } from '@/context/destinos-context';

export default function PantallaDestinos() {
  const { destinos, categorias, filtros, cargando, error, aplicarFiltros, recargar } = useDestinos();
  const [texto, setTexto] = useState('');
  const router = useRouter();

  // La búsqueda se dispara al enviar, no en cada tecla: una consulta por
  // letra contra Supabase es la forma más rápida de que se sienta lenta.
  const buscar = () => aplicarFiltros({ ...filtros, busqueda: texto });

  if (cargando && destinos.length === 0) return <Cargando texto="Cargando destinos..." />;

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top']}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>📍 Destinos</Text>
        <Text style={estilos.subtitulo}>
          {destinos.length} {destinos.length === 1 ? 'lugar' : 'lugares'} para descubrir
        </Text>
      </View>

      <View style={estilos.controles}>
        <Buscador valor={texto} onCambiar={setTexto} onBuscar={buscar} />
        <FiltroCategorias
          categorias={categorias}
          seleccionada={filtros.idCategoria ?? null}
          onSeleccionar={(id) => aplicarFiltros({ ...filtros, idCategoria: id })}
        />
      </View>

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <FlatList
        data={destinos}
        keyExtractor={(d) => String(d.id_destino)}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TarjetaDestino
            destino={item}
            onPress={() => router.push(`/destino/${item.id_destino}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={recargar} tintColor={Colores.verde} />
        }
        ListEmptyComponent={
          <EstadoVacio
            titulo="Sin resultados"
            mensaje={Mensajes.sinDestinos}
            textoAccion="Quitar filtros"
            onAccion={() => {
              setTexto('');
              aplicarFiltros({});
            }}
          />
        }
        initialNumToRender={6}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  encabezado: { paddingHorizontal: Espacio.md, paddingTop: Espacio.sm },
  titulo: { fontSize: 28, fontWeight: '800', color: Colores.texto },
  subtitulo: { fontSize: 13, color: Colores.textoTenue, marginTop: 2 },
  controles: { paddingHorizontal: Espacio.md, gap: Espacio.xs },
  error: {
    marginHorizontal: Espacio.md,
    color: Colores.coral,
    fontSize: 13,
    marginTop: Espacio.sm,
  },
  lista: {
    paddingHorizontal: Espacio.md,
    paddingTop: Espacio.sm,
    paddingBottom: AltoBarraTabs + Espacio.xl,
  },
});
