import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useProgreso } from '../context/ProgresoContext';
import { obtenerMisionesConEstado, completarMision } from '../lib/progreso-service';
import type { MisionUsuario } from '../lib/progreso-types';

type Pestana = 'activos' | 'completados';

export default function RetosScreen() {
  const router = useRouter();
  const { perfil, recargar } = useProgreso();
  const [misiones, setMisiones] = useState<MisionUsuario[]>([]);
  const [pestana, setPestana] = useState<Pestana>('activos');
  const [cargando, setCargando] = useState(true);
  const [completandoId, setCompletandoId] = useState<number | null>(null);

  const cargarMisiones = useCallback(async () => {
    if (!perfil) return;
    setCargando(true);
    const data = await obtenerMisionesConEstado(perfil.id_usuario);
    setMisiones(data);
    setCargando(false);
  }, [perfil]);

  useEffect(() => {
    cargarMisiones();
  }, [cargarMisiones]);

  const manejarCompletar = async (mision: MisionUsuario) => {
    if (!perfil) return;
    setCompletandoId(mision.id_mision);
    try {
      await completarMision(perfil.id_usuario, mision.id_mision);
      await cargarMisiones();
      await recargar(); // actualiza puntos y nivel en el resto de la app
      Alert.alert('¡Reto completado!', `Ganaste +${mision.puntos_otorgados} puntos`);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo completar el reto');
    } finally {
      setCompletandoId(null);
    }
  };

  const activos = misiones.filter(m => m.estado !== 'completada');
  const completados = misiones.filter(m => m.estado === 'completada');
  const lista = pestana === 'activos' ? activos : completados;

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>← Inicio</Text>
        </TouchableOpacity>
        <View style={styles.filaTitulo}>
          <View>
            <Text style={styles.titulo}>🎯 Retos y Misiones</Text>
            <Text style={styles.subtitulo}>Completa y gana puntos extra</Text>
          </View>
          <View style={styles.badgeCompletados}>
            <Text style={styles.badgeNumero}>{completados.length}</Text>
            <Text style={styles.badgeTexto}>completados</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, pestana === 'activos' && styles.tabActiva]}
            onPress={() => setPestana('activos')}
          >
            <Text style={[styles.tabTexto, pestana === 'activos' && styles.tabTextoActivo]}>🔥 Activos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, pestana === 'completados' && styles.tabActiva]}
            onPress={() => setPestana('completados')}
          >
            <Text style={[styles.tabTexto, pestana === 'completados' && styles.tabTextoActivo]}>✅ Logrados</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#ea580c" />
        </View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => String(item.id_mision)}
          contentContainerStyle={styles.listaContenido}
          ListEmptyComponent={
            <Text style={styles.vacio}>
              {pestana === 'activos' ? 'No tienes retos pendientes.' : 'Todavía no completas ningún reto.'}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <View style={styles.icono}>
                <Text style={styles.iconoTexto}>🎯</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.tarjetaTitulo}>{item.titulo}</Text>
                {item.descripcion && <Text style={styles.tarjetaDescripcion}>{item.descripcion}</Text>}
                <Text style={styles.tarjetaPuntos}>+{item.puntos_otorgados} puntos</Text>
              </View>
              {item.estado === 'completada' ? (
                <Text style={styles.completadoIcono}>✅</Text>
              ) : (
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => manejarCompletar(item)}
                  disabled={completandoId === item.id_mision}
                >
                  {completandoId === item.id_mision ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.botonTexto}>Completar →</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#fff7ed' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  encabezado: {
    backgroundColor: '#ea580c',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  volver: { color: '#fff', fontSize: 14, marginBottom: 8 },
  filaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titulo: { color: '#fff', fontSize: 20, fontWeight: '700' },
  subtitulo: { color: '#fed7aa', fontSize: 13 },
  badgeCompletados: { alignItems: 'center' },
  badgeNumero: { color: '#fff', fontSize: 20, fontWeight: '700' },
  badgeTexto: { color: '#fed7aa', fontSize: 11 },
  tabs: { flexDirection: 'row', backgroundColor: '#ffffff33', borderRadius: 20, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 16, alignItems: 'center' },
  tabActiva: { backgroundColor: '#fff' },
  tabTexto: { color: '#fff', fontWeight: '600', fontSize: 13 },
  tabTextoActivo: { color: '#ea580c' },
  listaContenido: { padding: 20, paddingBottom: 40 },
  vacio: { textAlign: 'center', color: '#9ca3af', marginTop: 40 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  icono: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#ffedd5',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  iconoTexto: { fontSize: 20 },
  info: { flex: 1 },
  tarjetaTitulo: { fontSize: 14, fontWeight: '700', color: '#111827' },
  tarjetaDescripcion: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  tarjetaPuntos: { fontSize: 12, fontWeight: '700', color: '#ea580c', marginTop: 4 },
  boton: { backgroundColor: '#ea580c', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  botonTexto: { color: '#fff', fontWeight: '700', fontSize: 12 },
  completadoIcono: { fontSize: 20 },
});