import { Pressable, StyleSheet, Text } from 'react-native';

import { Colores, Espacio, Radio } from '@/constants/theme';

type Props = {
  emoji: string;
  nombre: string;
  color?: string;
  activo?: boolean;
  onPress?: () => void;
};

export function ChipCategoria({ emoji, nombre, color = Colores.verde, activo = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected: activo }}
      style={({ pressed }) => [
        estilos.chip,
        { borderColor: color },
        activo && { backgroundColor: color },
        pressed && estilos.presionado,
      ]}>
      <Text style={estilos.emoji}>{emoji}</Text>
      <Text style={[estilos.texto, { color: activo ? '#FFFFFF' : color }]}>{nombre}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espacio.xs + 1,
    borderWidth: 1.3,
    borderRadius: Radio.pastilla,
    paddingHorizontal: Espacio.md - 2,
    paddingVertical: Espacio.xs + 3,
    backgroundColor: Colores.tarjeta,
  },
  presionado: { opacity: 0.75 },
  emoji: { fontSize: 14 },
  texto: { fontSize: 13, fontWeight: '600' },
});
