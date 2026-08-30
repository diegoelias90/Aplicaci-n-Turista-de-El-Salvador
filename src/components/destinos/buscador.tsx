import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colores, Espacio, Radio } from '@/constants/theme';

type Props = {
  valor: string;
  onCambiar: (texto: string) => void;
  onBuscar: () => void;
  placeholder?: string;
};

export function Buscador({ valor, onCambiar, onBuscar, placeholder = 'Buscar por nombre...' }: Props) {
  return (
    <View style={estilos.caja}>
      <Text style={estilos.lupa}>🔍</Text>

      <TextInput
        style={estilos.input}
        value={valor}
        onChangeText={onCambiar}
        onSubmitEditing={onBuscar}
        placeholder={placeholder}
        placeholderTextColor={Colores.textoTenue}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Buscar destinos"
      />

      {valor.length > 0 ? (
        <Pressable
          onPress={() => { onCambiar(''); onBuscar(); }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda">
          <Text style={estilos.limpiar}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espacio.sm,
    backgroundColor: Colores.tarjeta,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: Radio.md,
    paddingHorizontal: Espacio.md - 2,
    minHeight: 46,
  },
  lupa: { fontSize: 15 },
  input: { flex: 1, fontSize: 15, color: Colores.texto },
  limpiar: { fontSize: 15, color: Colores.textoTenue, paddingHorizontal: 2 },
});
