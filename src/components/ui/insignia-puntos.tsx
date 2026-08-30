import { StyleSheet, Text, View } from 'react-native';

import { Colores, Espacio, Radio } from '@/constants/theme';

/** La pastilla dorada "+150 ⭐" del diseño. */
export function InsigniaPuntos({ puntos, grande = false }: { puntos: number; grande?: boolean }) {
  return (
    <View style={[estilos.caja, grande && estilos.cajaGrande]}>
      <Text style={[estilos.texto, grande && estilos.textoGrande]}>+{puntos} ⭐</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: {
    backgroundColor: Colores.doradoSuave,
    borderWidth: 1,
    borderColor: Colores.dorado,
    paddingHorizontal: Espacio.sm,
    paddingVertical: 2,
    borderRadius: Radio.pastilla,
  },
  cajaGrande: { paddingHorizontal: Espacio.md, paddingVertical: Espacio.xs + 2 },
  texto: { fontSize: 11, fontWeight: '700', color: '#8A5A08' },
  textoGrande: { fontSize: 14 },
});
