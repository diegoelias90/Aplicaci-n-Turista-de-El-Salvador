/**
 * Tarjeta de destino. Se reusa en Destinos, Categoría y en el detalle
 * de una ruta.
 *
 * Guía 2: el padre manda los datos por props y el hijo solo los pinta.
 * Aquí dentro no se consulta Supabase.
 */
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InsigniaPuntos } from '@/components/ui/insignia-puntos';
import { Colores, Espacio, Radio, Sombra, estiloDeCategoria } from '@/constants/theme';
import { fotoPrincipal } from '@/lib/destinos';
import type { DestinoDetallado } from '@/types/database';

export type PropsTarjetaDestino = {
  destino: DestinoDetallado;
  onPress: () => void;
  /** Lo pasa el módulo de usuarios cuando exista. */
  esFavorito?: boolean;
  onAlternarFavorito?: () => void;
  /** Lo pasa el módulo de progreso cuando exista. */
  visitado?: boolean;
};

export function TarjetaDestino({
  destino, onPress, esFavorito, onAlternarFavorito, visitado = false,
}: PropsTarjetaDestino) {
  const { emoji, color } = estiloDeCategoria(destino.categoria?.nombre);
  const foto = fotoPrincipal(destino);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver ${destino.nombre}`}
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}>

      <View style={[estilos.portada, { backgroundColor: color + '1A' }]}>
        {foto ? (
          <Image source={foto} style={estilos.imagen} contentFit="cover" transition={220} />
        ) : (
          <Text style={estilos.emojiGrande}>{emoji}</Text>
        )}

        {visitado ? (
          <View style={estilos.sello}>
            <Text style={estilos.selloTexto}>✓ Visitado</Text>
          </View>
        ) : null}

        {onAlternarFavorito ? (
          <Pressable
            onPress={onAlternarFavorito}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            style={estilos.corazon}>
            <Text style={estilos.corazonTexto}>{esFavorito ? '❤️' : '🤍'}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={estilos.cuerpo}>
        <View style={estilos.filaTitulo}>
          <Text style={estilos.nombre} numberOfLines={1}>{destino.nombre}</Text>
          {typeof destino.puntos === 'number' ? <InsigniaPuntos puntos={destino.puntos} /> : null}
        </View>

        <Text style={estilos.lugar} numberOfLines={1}>
          📍 {destino.departamento?.nombre ?? 'El Salvador'}
        </Text>

        {destino.descripcion ? (
          <Text style={estilos.descripcion} numberOfLines={2}>{destino.descripcion}</Text>
        ) : null}

        <View style={estilos.filaPie}>
          <View style={[estilos.chip, { backgroundColor: color + '1F' }]}>
            <Text style={[estilos.chipTexto, { color }]}>
              {emoji} {destino.categoria?.nombre ?? 'Sin categoría'}
            </Text>
          </View>

          {typeof destino.calificacion === 'number' ? (
            <Text style={estilos.rating}>⭐ {destino.calificacion.toFixed(1)}</Text>
          ) : null}
        </View>

        {destino.etiquetas && destino.etiquetas.length > 0 ? (
          <View style={estilos.etiquetas}>
            {destino.etiquetas.map((e) => (
              <Text key={e} style={estilos.etiqueta}>{e}</Text>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: Colores.tarjeta,
    borderRadius: Radio.lg,
    overflow: 'hidden',
    marginBottom: Espacio.md - 2,
    ...Sombra,
  },
  presionada: { opacity: 0.9 },
  portada: { height: 150, alignItems: 'center', justifyContent: 'center' },
  imagen: { width: '100%', height: '100%' },
  emojiGrande: { fontSize: 52 },
  sello: {
    position: 'absolute',
    top: Espacio.sm,
    left: Espacio.sm,
    backgroundColor: Colores.verde,
    paddingHorizontal: Espacio.sm + 2,
    paddingVertical: 3,
    borderRadius: Radio.pastilla,
  },
  selloTexto: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  corazon: {
    position: 'absolute',
    top: Espacio.sm,
    right: Espacio.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: Radio.pastilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corazonTexto: { fontSize: 16 },
  cuerpo: { padding: Espacio.md - 2, gap: Espacio.xs + 1 },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Espacio.sm },
  nombre: { flex: 1, fontSize: 17, fontWeight: '700', color: Colores.texto },
  lugar: { fontSize: 12.5, color: Colores.textoTenue },
  descripcion: { fontSize: 13, color: Colores.textoSuave, lineHeight: 18 },
  filaPie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  chip: { paddingHorizontal: Espacio.sm + 2, paddingVertical: 3, borderRadius: Radio.pastilla },
  chipTexto: { fontSize: 11.5, fontWeight: '600' },
  rating: { fontSize: 13, fontWeight: '600', color: Colores.texto },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: Espacio.xs + 2, marginTop: 2 },
  etiqueta: {
    fontSize: 11,
    color: Colores.textoSuave,
    backgroundColor: Colores.fondo,
    paddingHorizontal: Espacio.sm,
    paddingVertical: 2,
    borderRadius: Radio.sm,
  },
});
