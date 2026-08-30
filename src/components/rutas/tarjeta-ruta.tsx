/** Tarjeta de ruta: dificultad, duración, puntos y cadena de paradas. */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InsigniaPuntos } from '@/components/ui/insignia-puntos';
import { Colores, Espacio, EtiquetaDificultad, Radio, Sombra } from '@/constants/theme';
import type { RutaConParadas } from '@/types/database';

type Props = { ruta: RutaConParadas; onPress: () => void };

export function TarjetaRuta({ ruta, onPress }: Props) {
  const dificultad = EtiquetaDificultad[ruta.dificultad] ?? EtiquetaDificultad.media;
  const paradas = [...(ruta.paradas ?? [])].sort((a, b) => a.orden - b.orden);

  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.encabezado}>
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
        {typeof ruta.puntos === 'number' ? <InsigniaPuntos puntos={ruta.puntos} /> : null}
      </View>

      {ruta.descripcion ? (
        <Text style={estilos.descripcion}>{ruta.descripcion}</Text>
      ) : null}

      <Text style={estilos.conteo}>
        📍 {paradas.length} {paradas.length === 1 ? 'parada' : 'paradas'}
      </Text>

      <View style={estilos.cadena}>
        {paradas.map((p, i) => (
          <View key={`${p.orden}`} style={estilos.eslabon}>
            <Text style={estilos.parada} numberOfLines={1}>
              {p.destino?.nombre ?? 'Parada'}
            </Text>
            {i < paradas.length - 1 ? <Text style={estilos.flecha}>→</Text> : null}
          </View>
        ))}
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ver la ruta ${ruta.nombre}`}
        style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
        <Text style={estilos.botonTexto}>🚀 Ver ruta completa</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: Colores.tarjeta,
    borderRadius: Radio.lg,
    padding: Espacio.md,
    marginBottom: Espacio.md - 2,
    gap: Espacio.sm,
    ...Sombra,
  },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: Espacio.sm },
  nombre: { flex: 1, fontSize: 17, fontWeight: '700', color: Colores.texto },
  dificultad: { paddingHorizontal: Espacio.sm + 2, paddingVertical: 3, borderRadius: Radio.pastilla },
  dificultadTexto: { fontSize: 11.5, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Espacio.sm },
  metaTexto: { fontSize: 13, color: Colores.textoSuave },
  descripcion: { fontSize: 13.5, color: Colores.textoSuave, lineHeight: 19 },
  conteo: { fontSize: 12.5, color: Colores.textoTenue, fontWeight: '600' },
  cadena: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Espacio.xs + 2 },
  eslabon: { flexDirection: 'row', alignItems: 'center', gap: Espacio.xs + 2 },
  parada: {
    fontSize: 12,
    color: Colores.verdeOscuro,
    backgroundColor: Colores.verdeClaro,
    paddingHorizontal: Espacio.sm,
    paddingVertical: 3,
    borderRadius: Radio.sm,
    maxWidth: 150,
  },
  flecha: { color: Colores.textoTenue, fontSize: 13 },
  boton: {
    marginTop: Espacio.xs,
    backgroundColor: Colores.verde,
    borderRadius: Radio.pastilla,
    paddingVertical: Espacio.sm + 4,
    alignItems: 'center',
  },
  presionado: { opacity: 0.85 },
  botonTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
