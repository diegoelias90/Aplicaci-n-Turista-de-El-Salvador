import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colores, Espacio, Radio } from '@/constants/theme';

type Props = {
  emoji?: string;
  titulo: string;
  mensaje?: string;
  textoAccion?: string;
  onAccion?: () => void;
};

export function EstadoVacio({ emoji = '🔍', titulo, mensaje, textoAccion, onAccion }: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.emoji}>{emoji}</Text>
      <Text style={estilos.titulo}>{titulo}</Text>
      {mensaje ? <Text style={estilos.mensaje}>{mensaje}</Text> : null}
      {textoAccion && onAccion ? (
        <Pressable
          onPress={onAccion}
          accessibilityRole="button"
          style={({ pressed }) => [estilos.boton, pressed && estilos.presionado]}>
          <Text style={estilos.botonTexto}>{textoAccion}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { alignItems: 'center', paddingVertical: 56, gap: Espacio.sm },
  emoji: { fontSize: 44 },
  titulo: { fontSize: 16, fontWeight: '700', color: Colores.texto },
  mensaje: {
    color: Colores.textoSuave,
    textAlign: 'center',
    paddingHorizontal: Espacio.xl,
    lineHeight: 20,
  },
  boton: {
    marginTop: Espacio.sm,
    backgroundColor: Colores.verde,
    paddingHorizontal: Espacio.lg,
    paddingVertical: Espacio.sm + 2,
    borderRadius: Radio.pastilla,
  },
  presionado: { opacity: 0.85 },
  botonTexto: { color: '#FFFFFF', fontWeight: '700' },
});
