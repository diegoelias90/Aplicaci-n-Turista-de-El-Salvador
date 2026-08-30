import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Colores, Espacio } from '@/constants/theme';

export function Cargando({ texto = 'Cargando...' }: { texto?: string }) {
  return (
    <View style={estilos.contenedor}>
      <ActivityIndicator size="large" color={Colores.verde} />
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espacio.md,
    backgroundColor: Colores.fondo,
  },
  texto: { color: Colores.textoSuave },
});
