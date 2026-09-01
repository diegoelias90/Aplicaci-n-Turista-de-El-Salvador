/**
 * Version web del puente de mapas: react-native-maps no corre en
 * navegador. Se dibuja un marcador de posicion con el mismo tamanio para
 * que la pantalla no se desarme; el mapa real se ve en Android/iOS.
 */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export const PROVIDER_GOOGLE = undefined;

type PropsMapa = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  [key: string]: unknown;
};

export function MapaView({ style }: PropsMapa) {
  return (
    <View style={[estilos.contenedor, style]}>
      <Text style={estilos.icono}>🗺️</Text>
      <Text style={estilos.titulo}>Mapa no disponible en web</Text>
      <Text style={estilos.texto}>
        react-native-maps necesita un development build. Abrí la app en Android o iOS
        con npm run android / npm run ios.
      </Text>
    </View>
  );
}

export default MapaView;

/** En web no se dibuja nada: los marcadores viven dentro del mapa. */
export function Marker(_props: Record<string, unknown>) {
  return null;
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#E9EEF2',
    borderWidth: 1,
    borderColor: '#CFD9E0',
  },
  icono: { fontSize: 40, marginBottom: 8 },
  titulo: { fontSize: 15, fontWeight: '700', color: '#33475B', marginBottom: 4 },
  texto: { fontSize: 12, color: '#66798C', textAlign: 'center', maxWidth: 280 },
});
