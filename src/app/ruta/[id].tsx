/**
 * Detalle de la ruta: cabecera con los datos y la línea de tiempo
 * vertical con las paradas en orden.
 */
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { TarjetaDestino } from '@/components/destinos/tarjeta-destino';
import { ParadaRuta } from '@/components/rutas/parada-ruta';
import { Cargando } from '@/components/ui/cargando';
import { EstadoVacio } from '@/components/ui/estado-vacio';
import { InsigniaPuntos } from '@/components/ui/insignia-puntos';
import { Colores, Espacio, EtiquetaDificultad, Radio, Sombra } from '@/constants/theme';
import { Mensajes } from '@/constants/mensajes';
import { obtenerRuta } from '@/lib/rutas';
import type { RutaDetallada } from '@/types/database';

export default function PantallaDetalleRuta() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idRuta = Number(id);
  const [ruta, setRuta] = useState<RutaDetallada | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const cargar = useCallback(async () => {
    if (!Number.isFinite(idRuta)) {
      setError('Ruta no válida.');
      setCargando(false);
      return;
    }
    setCargando(true);
    try {
      setRuta(await obtenerRuta(idRuta));
    } catch (e) {
      setError(e instanceof Error ? e.message : Mensajes.errorGenerico);
    } finally {
      setCargando(false);
    }
  }, [idRuta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) return <Cargando texto="Cargando ruta..." />;

  if (error || !ruta) {
    return (
      <EstadoVacio
        emoji="😕"
        titulo="No encontramos la ruta"
        mensaje={error ?? undefined}
        textoAccion={Mensajes.reintentar}
        onAccion={cargar}
      />
    );
  }

  const dificultad = EtiquetaDificultad[ruta.dificultad] ?? EtiquetaDificultad.media;
  const paradas = [...(ruta.paradas ?? [])].sort((a, b) => a.orden - b.orden);

  return (
    <>
      <Stack.Screen options={{ title: ruta.nombre }} />

      <FlatList
        style={estilos.contenedor}
        contentContainerStyle={estilos.lista}
        data={paradas}
        keyExtractor={(p) => `${p.id_ruta}-${p.orden}`}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={estilos.cabecera}>
            <View style={estilos.filaTitulo}>
              <Text style={estilos.nombre}>{ruta.nombre}</Text>
              <View style={[estilos.dificultad, { backgroundColor: dificultad.color + '1F' }]}>
                <Text style={[estilos.dificultadTexto, { color: dificultad.color }]}>
                  {dificultad.texto}
                </Text>
              </View>
            </View>

            <View style={estilos.meta}>
              {typeof ruta.duracion_dias === 'number' ? (
                <Text style={estilos.metaTexto}>
                  ⏱ {ruta.duracion_dias} {ruta.duracion_dias === 1 ? 'día' : 'días'}
                </Text>
              ) : null}
              <Text style={estilos.metaTexto}>
                📍 {paradas.length} {paradas.length === 1 ? 'parada' : 'paradas'}
              </Text>
              {typeof ruta.puntos === 'number' ? <InsigniaPuntos puntos={ruta.puntos} /> : null}
            </View>

            {ruta.descripcion ? (
              <>
                <Text style={estilos.seccion}>Descripción</Text>
                <Text style={estilos.descripcion}>{ruta.descripcion}</Text>
              </>
            ) : null}

            <Text style={estilos.seccion}>Paradas del recorrido</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <ParadaRuta numero={item.orden} esUltima={index === paradas.length - 1}>
            {item.destino ? (
              <TarjetaDestino
                destino={item.destino}
                onPress={() => router.push(`/destino/${item.destino!.id_destino}`)}
              />
            ) : (
              <Text style={estilos.paradaRota}>Esta parada ya no tiene destino asociado.</Text>
            )}
          </ParadaRuta>
        )}
        ListEmptyComponent={<EstadoVacio emoji="🧭" titulo="Sin paradas" mensaje={Mensajes.sinParadas} />}
      />
    </>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  lista: { padding: Espacio.md, paddingBottom: Espacio.xl },
  cabecera: {
    backgroundColor: Colores.tarjeta,
    borderRadius: Radio.lg,
    padding: Espacio.md,
    marginBottom: Espacio.md,
    gap: Espacio.sm,
    ...Sombra,
  },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: Espacio.sm },
  nombre: { flex: 1, fontSize: 21, fontWeight: '800', color: Colores.texto },
  dificultad: { paddingHorizontal: Espacio.sm + 2, paddingVertical: 3, borderRadius: Radio.pastilla },
  dificultadTexto: { fontSize: 11.5, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Espacio.md, flexWrap: 'wrap' },
  metaTexto: { fontSize: 13, color: Colores.textoSuave },
  seccion: { fontSize: 15.5, fontWeight: '700', color: Colores.texto, marginTop: Espacio.sm },
  descripcion: { fontSize: 14, color: Colores.textoSuave, lineHeight: 21 },
  paradaRota: { fontSize: 13, color: Colores.textoTenue, fontStyle: 'italic', marginBottom: Espacio.md },
});
