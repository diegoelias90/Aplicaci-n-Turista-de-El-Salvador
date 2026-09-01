/**
 * Detalle del destino.
 *
 * Esta pantalla es el punto de encuentro de los cuatro módulos. Lo que
 * está marcado como ENGANCHE lo conecta otro módulo cuando exista; hasta
 * entonces simplemente no se pinta, y la pantalla funciona igual.
 */
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Cargando } from '@/components/ui/cargando';
import { EstadoVacio } from '@/components/ui/estado-vacio';
import { InsigniaPuntos } from '@/components/ui/insignia-puntos';
import { Colores, Espacio, Radio, Sombra, estiloDeCategoria } from '@/constants/theme';
import { Mensajes } from '@/constants/mensajes';
import { fotoPrincipal, obtenerDestino } from '@/lib/destinos';
import { rutasDeDestino } from '@/lib/rutas';
import type { DestinoDetallado, Ruta } from '@/types/database';

export default function PantallaDetalleDestino() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idDestino = Number(id);
  const [destino, setDestino] = useState<DestinoDetallado | null>(null);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const cargar = useCallback(async () => {
    if (!Number.isFinite(idDestino)) {
      setError('Destino no válido.');
      setCargando(false);
      return;
    }
    setCargando(true);
    try {
      const [d, r] = await Promise.all([obtenerDestino(idDestino), rutasDeDestino(idDestino)]);
      setDestino(d);
      setRutas(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : Mensajes.errorGenerico);
    } finally {
      setCargando(false);
    }
  }, [idDestino]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) return <Cargando texto="Cargando destino..." />;

  if (error || !destino) {
    return (
      <EstadoVacio
        emoji="😕"
        titulo="No encontramos el destino"
        mensaje={error ?? undefined}
        textoAccion={Mensajes.reintentar}
        onAccion={cargar}
      />
    );
  }

  const { emoji, color } = estiloDeCategoria(destino.categoria?.nombre);
  const foto = fotoPrincipal(destino);
  const videos = (destino.multimedia ?? []).filter((m) => m.tipo === 'video');

  return (
    <>
      <Stack.Screen options={{ title: destino.nombre }} />

      <ScrollView style={estilos.contenedor} contentContainerStyle={estilos.scroll}>
        <View style={[estilos.portada, { backgroundColor: color + '1A' }]}>
          {foto ? (
            <Image source={foto} style={estilos.imagen} contentFit="cover" transition={250} />
          ) : (
            <Text style={estilos.emojiGrande}>{emoji}</Text>
          )}
        </View>

        <View style={estilos.cuerpo}>
          <View style={estilos.filaTitulo}>
            <Text style={estilos.nombre}>{destino.nombre}</Text>
            {typeof destino.puntos === 'number' ? (
              <InsigniaPuntos puntos={destino.puntos} grande />
            ) : null}
          </View>

          <View style={estilos.filaMeta}>
            <Text style={estilos.lugar}>📍 {destino.departamento?.nombre ?? 'El Salvador'}</Text>
            {typeof destino.calificacion === 'number' ? (
              <Text style={estilos.rating}>⭐ {destino.calificacion.toFixed(1)}</Text>
            ) : null}
          </View>

          <View style={[estilos.chip, { backgroundColor: color + '1F' }]}>
            <Text style={[estilos.chipTexto, { color }]}>
              {emoji} {destino.categoria?.nombre ?? 'Sin categoría'}
            </Text>
          </View>

          {destino.direccion ? (
            <Text style={estilos.direccion}>{destino.direccion}</Text>
          ) : null}

          <Text style={estilos.seccion}>Sobre este lugar</Text>
          <Text style={estilos.descripcion}>
            {destino.descripcion ?? 'Todavía no hay una descripción para este lugar.'}
          </Text>

          {destino.etiquetas && destino.etiquetas.length > 0 ? (
            <>
              <Text style={estilos.seccion}>Características</Text>
              <View style={estilos.etiquetas}>
                {destino.etiquetas.map((e) => (
                  <Text key={e} style={estilos.etiqueta}>{e}</Text>
                ))}
              </View>
            </>
          ) : null}

          {videos.length > 0 ? (
            <>
              <Text style={estilos.seccion}>Videos</Text>
              {videos.map((v) => (
                <Text key={v.id_multimedia} style={estilos.video} numberOfLines={1}>
                  🎬 {v.url}
                </Text>
              ))}
            </>
          ) : null}

          {rutas.length > 0 ? (
            <>
              <Text style={estilos.seccion}>Rutas que pasan por aquí</Text>
              {rutas.map((r) => (
                <Pressable
                  key={r.id_ruta}
                  onPress={() => router.push(`/ruta/${r.id_ruta}`)}
                  accessibilityRole="button"
                  style={({ pressed }) => [estilos.tarjetaRuta, pressed && estilos.presionado]}>
                  <Text style={estilos.tarjetaRutaNombre}>🗺️ {r.nombre}</Text>
                  <Text style={estilos.tarjetaRutaFlecha}>›</Text>
                </Pressable>
              ))}
            </>
          ) : null}

          {/*
            ENGANCHES para el resto del equipo. Cada uno entrega su
            componente y se agrega aquí; mientras tanto la pantalla
            funciona sin ellos.

              Usuarios      -> <BotonFavorito idDestino={destino.id_destino} />
              Exploración   -> clima con las coordenadas del destino
                               ({destino.latitud}, {destino.longitud})
                               y enlaces a /mapa y a registrar evidencia
              Gamificación  -> botón "Marcar como visitado"
          */}
        </View>
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  scroll: { paddingBottom: Espacio.xl },
  portada: { height: 230, alignItems: 'center', justifyContent: 'center' },
  imagen: { width: '100%', height: '100%' },
  emojiGrande: { fontSize: 76 },
  cuerpo: { padding: Espacio.md, gap: Espacio.sm },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: Espacio.sm },
  nombre: { flex: 1, fontSize: 24, fontWeight: '800', color: Colores.texto },
  filaMeta: { flexDirection: 'row', alignItems: 'center', gap: Espacio.md },
  lugar: { fontSize: 14, color: Colores.textoSuave },
  rating: { fontSize: 14, fontWeight: '700', color: Colores.texto },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Espacio.md - 4,
    paddingVertical: Espacio.xs,
    borderRadius: Radio.pastilla,
  },
  chipTexto: { fontSize: 12.5, fontWeight: '700' },
  direccion: { fontSize: 13, color: Colores.textoTenue },
  seccion: { fontSize: 16, fontWeight: '700', color: Colores.texto, marginTop: Espacio.md },
  descripcion: { fontSize: 14.5, color: Colores.textoSuave, lineHeight: 22 },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.sm },
  etiqueta: {
    fontSize: 12.5,
    color: Colores.verdeOscuro,
    backgroundColor: Colores.verdeClaro,
    paddingHorizontal: Espacio.md - 4,
    paddingVertical: Espacio.xs + 1,
    borderRadius: Radio.pastilla,
  },
  video: { fontSize: 13, color: Colores.textoSuave },
  tarjetaRuta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colores.tarjeta,
    borderRadius: Radio.md,
    padding: Espacio.md - 2,
    ...Sombra,
  },
  presionado: { opacity: 0.85 },
  tarjetaRutaNombre: { flex: 1, fontSize: 14.5, fontWeight: '600', color: Colores.texto },
  tarjetaRutaFlecha: { fontSize: 22, color: Colores.textoTenue },
});
