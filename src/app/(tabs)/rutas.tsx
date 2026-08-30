/** Rutas turísticas: resumen arriba y la lista de rutas con sus paradas. */
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TarjetaRuta } from '@/components/rutas/tarjeta-ruta';
import { Cargando } from '@/components/ui/cargando';
import { EstadoVacio } from '@/components/ui/estado-vacio';
import { AltoBarraTabs, Colores, Espacio, Radio, Sombra } from '@/constants/theme';
import { Mensajes } from '@/constants/mensajes';
import { listarRutas } from '@/lib/rutas';
import type { RutaConParadas } from '@/types/database';

export default function PantallaRutas() {
  const [rutas, setRutas] = useState<RutaConParadas[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setRutas(await listarRutas());
    } catch (e) {
      setError(e instanceof Error ? e.message : Mensajes.errorGenerico);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const totalParadas = rutas.reduce((n, r) => n + (r.paradas?.length ?? 0), 0);

  if (cargando && rutas.length === 0) return <Cargando texto="Cargando rutas..." />;

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top']}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>🗺️ Rutas Turísticas</Text>
        <Text style={estilos.subtitulo}>Aventuras diseñadas para ti</Text>
      </View>

      <View style={estilos.resumen}>
        <View style={estilos.contador}>
          <Text style={estilos.contadorNumero}>{rutas.length}</Text>
          <Text style={estilos.contadorTexto}>Rutas disponibles</Text>
        </View>
        <View style={estilos.contador}>
          <Text style={estilos.contadorNumero}>{totalParadas}</Text>
          <Text style={estilos.contadorTexto}>Paradas en total</Text>
        </View>
      </View>

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <FlatList
        data={rutas}
        keyExtractor={(r) => String(r.id_ruta)}
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TarjetaRuta ruta={item} onPress={() => router.push(`/ruta/${item.id_ruta}`)} />
        )}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={cargar} tintColor={Colores.verde} />
        }
        ListEmptyComponent={<EstadoVacio emoji="🗺️" titulo="Sin rutas" mensaje={Mensajes.sinRutas} />}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  encabezado: { paddingHorizontal: Espacio.md, paddingTop: Espacio.sm },
  titulo: { fontSize: 26, fontWeight: '800', color: Colores.texto },
  subtitulo: { fontSize: 13.5, color: Colores.textoTenue, marginTop: 2 },
  resumen: { flexDirection: 'row', gap: Espacio.sm, padding: Espacio.md },
  contador: {
    flex: 1,
    backgroundColor: Colores.tarjeta,
    borderRadius: Radio.md,
    paddingVertical: Espacio.md - 2,
    alignItems: 'center',
    ...Sombra,
  },
  contadorNumero: { fontSize: 24, fontWeight: '800', color: Colores.verde },
  contadorTexto: { fontSize: 12, color: Colores.textoSuave, marginTop: 2 },
  error: { marginHorizontal: Espacio.md, color: Colores.coral, fontSize: 13 },
  lista: {
    paddingHorizontal: Espacio.md,
    paddingBottom: AltoBarraTabs + Espacio.xl,
  },
});
