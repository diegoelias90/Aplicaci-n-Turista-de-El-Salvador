import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useProgreso } from '../context/ProgresoContext';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const { perfil, visitados, insignias, posicionRanking, siguienteNivel, cargando } = useProgreso();
  const router = useRouter();
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#c026d3" />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.centrado}>
        <Text>No se pudo cargar tu perfil.</Text>
      </View>
    );
  }

  const nivel = perfil.niveles;
  const puntosEnNivel = perfil.puntos_totales - nivel.puntos_requeridos;
  const puntosParaSubir = siguienteNivel
    ? siguienteNivel.puntos_requeridos - nivel.puntos_requeridos
    : null;
  const progresoPorcentaje = puntosParaSubir
    ? Math.min(100, Math.round((puntosEnNivel / puntosParaSubir) * 100))
    : 100;

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Mi Perfil</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>TÚ</Text>
        </View>

        <Text style={styles.nombreUsuario}>{perfil.nombre}</Text>
        <Text style={styles.subNivel}>Nivel {nivel.orden} · {perfil.puntos_totales} puntos</Text>

        <View style={styles.barraFondo}>
          <View style={[styles.barraProgreso, { width: `${progresoPorcentaje}%` }]} />
        </View>
        {siguienteNivel && (
          <Text style={styles.textoXp}>
            {puntosEnNivel}/{puntosParaSubir} XP → {siguienteNivel.nombre}
          </Text>
        )}

        <View style={styles.filaStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{visitados}</Text>
            <Text style={styles.statTexto}>Visitados</Text>
          </View>
          <View style={styles.filaBotones}>
  <TouchableOpacity style={styles.botonAccion} onPress={() => router.push('/retos')}>
    <Text style={styles.botonAccionTexto}>🎯 Retos</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.botonAccion} onPress={() => router.push('/ranking')}>
    <Text style={styles.botonAccionTexto}>🏆 Ranking</Text>
  </TouchableOpacity>
</View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{insignias}</Text>
            <Text style={styles.statTexto}>Insignias</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>#{posicionRanking ?? '-'}</Text>
            <Text style={styles.statTexto}>Ranking</Text>
          </View>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Estadísticas</Text>

        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaEtiqueta}>Puntos totales</Text>
          <Text style={styles.tarjetaValor}>{perfil.puntos_totales}</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaEtiqueta}>Destinos visitados</Text>
          <Text style={styles.tarjetaValor}>{visitados}</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaEtiqueta}>Nivel actual</Text>
          <Text style={styles.tarjetaValor}>{nivel.orden}</Text>
        </View>
      </View>
      <View style={styles.seccion}>
  <Text style={styles.seccionTitulo}>Logros</Text>

  <LogroItem
    titulo="Primer destino visitado"
    completado={visitados >= 1}
  />
  <LogroItem
    titulo="5 destinos explorados"
    completado={visitados >= 5}
  />
  <LogroItem
    titulo="Alcanzar nivel 5"
    completado={nivel.orden >= 5}
  />
</View>
    </ScrollView>
  );
}
function LogroItem({ titulo, completado }: { titulo: string; completado: boolean }) {
  return (
    <View style={[styles.logro, completado && styles.logroCompletado]}>
      <View style={[styles.logroIcono, completado && styles.logroIconoCompletado]}>
        <Text style={styles.logroIconoTexto}>{completado ? '✓' : ''}</Text>
      </View>
      <Text style={[styles.logroTexto, completado && styles.logroTextoCompletado]}>{titulo}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#f0fdf4' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  encabezado: {
    backgroundColor: '#9d174d',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titulo: { color: '#fff', fontSize: 20, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 12 },
  avatar: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#ec4899',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  avatarTexto: { color: '#fff', fontSize: 20, fontWeight: '700' },
  nombreUsuario: { color: '#fff', fontSize: 18, fontWeight: '700' },
  subNivel: { color: '#f5d0fe', fontSize: 13, marginBottom: 10 },
  barraFondo: { width: '100%', height: 8, backgroundColor: '#ffffff33', borderRadius: 4, overflow: 'hidden' },
  barraProgreso: { height: 8, backgroundColor: '#facc15' },
  textoXp: { color: '#f5d0fe', fontSize: 12, marginTop: 6, marginBottom: 16 },
  filaStats: { flexDirection: 'row', gap: 10, marginTop: 8 },
  filaBotones: { flexDirection: 'row', gap: 10, marginTop: 14, width: '100%' },
botonAccion: {
  flex: 1,
  backgroundColor: '#ffffff22',
  borderRadius: 12,
  paddingVertical: 10,
  alignItems: 'center',
},logro: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#e5e7eb',
},
logroCompletado: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
logroIcono: {
  width: 26, height: 26, borderRadius: 13,
  backgroundColor: '#e5e7eb',
  justifyContent: 'center', alignItems: 'center',
  marginRight: 12,
},
logroIconoCompletado: { backgroundColor: '#16a34a' },
logroIconoTexto: { color: '#fff', fontWeight: '700', fontSize: 13 },
logroTexto: { fontSize: 14, color: '#6b7280' },
logroTextoCompletado: { color: '#166534', fontWeight: '600' },
botonAccionTexto: { color: '#fff', fontWeight: '600', fontSize: 13 },
  statCard: {
    backgroundColor: '#ffffff22',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statNumero: { color: '#fff', fontSize: 18, fontWeight: '700' },
  statTexto: { color: '#f5d0fe', fontSize: 12, marginTop: 2 },
  seccion: { padding: 20 },
  seccionTitulo: { fontSize: 16, fontWeight: '700', color: '#166534', marginBottom: 12 },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tarjetaEtiqueta: { fontSize: 14, color: '#374151' },
  tarjetaValor: { fontSize: 16, fontWeight: '700', color: '#166534' },
});
