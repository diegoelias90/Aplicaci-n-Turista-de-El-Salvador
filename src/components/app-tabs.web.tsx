/** Versión web de la barra inferior. Metro la elige sola en navegador. */
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colores, Espacio, Radio } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View style={estilos.barra}>
          <TabTrigger name="index" href="/" asChild>
            <BotonTab>🏠 Inicio</BotonTab>
          </TabTrigger>
          <TabTrigger name="destinos" href="/destinos" asChild>
            <BotonTab>📍 Destinos</BotonTab>
          </TabTrigger>
          <TabTrigger name="rutas" href="/rutas" asChild>
            <BotonTab>🗺️ Rutas</BotonTab>
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}

function BotonTab({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && estilos.presionado}>
      <View style={[estilos.boton, isFocused && estilos.botonActivo]}>
        <Text style={[estilos.texto, isFocused && estilos.textoActivo]}>{children}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  barra: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Espacio.sm,
    padding: Espacio.sm,
    backgroundColor: Colores.tarjeta,
    borderTopWidth: 1,
    borderTopColor: Colores.borde,
  },
  boton: { paddingVertical: Espacio.sm, paddingHorizontal: Espacio.md, borderRadius: Radio.md },
  botonActivo: { backgroundColor: Colores.verdeClaro },
  texto: { fontSize: 13, color: Colores.textoSuave },
  textoActivo: { color: Colores.verdeOscuro, fontWeight: '700' },
  presionado: { opacity: 0.7 },
});
