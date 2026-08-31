import { View, Text, Image, StyleSheet } from 'react-native';

export default function LogoDiario() {
  return (
    <View style={styles.contenedor}>
      <Image
        source={require('../assets/LogoGuia.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>KatDiario</Text>
      <Text style={styles.subtitulo}>Diario & Agenda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
  },

  subtitulo: {
    fontSize: 14,
    marginTop: 5,
    opacity: 0.6,
  },
});