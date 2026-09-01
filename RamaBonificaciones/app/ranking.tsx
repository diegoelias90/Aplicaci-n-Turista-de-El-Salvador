import { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useProgreso } from '../context/ProgresoContext';
import { obtenerRankingSemanal } from '../lib/progreso-service';
import type { UsuarioRanking, UsuarioRankingSemanal } from '../lib/progreso-types';

type Pestana = 'global' | 'semana';

function iniciales(nombre: string) {
  return nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function RankingScreen() {
  const router = useRouter();
  const { perfil, ranking, cargando } = useProgreso();
  const [pestana, setPestana] = useState<Pestana>('global');
  const [rankingSemanal, setRankingSemanal] = useState<UsuarioRankingSemanal[]>([]);
  const [cargandoSemana, setCargandoSemana] = useState(false);

  useEffect(() => {
    if (pestana === 'semana' && rankingSemanal.length === 0) {
      setCargandoSemana(true);
      obtenerRankingSemanal()
        .then(setRankingSemanal)
        .finally(() => setCargandoSemana(false));
    }
  }, [pestana]);

  const lista: (UsuarioRanking | UsuarioRankingSemanal)[] =
    pestana === 'global' ? ranking : rankingSemanal;
  const podio = lista.slice(0, 3);
  const resto = lista.slice(3);

  const posicionActual = perfil
    ? lista.findIndex(u => u.id_usuario === perfil.id_usuario) + 1
    : 0;

  const puntosActuales =
    pestana === 'global'
      ? perfil?.puntos_totales ?? 0
      : rankingSemanal.find(u => u.id_usuario === perfil?.id_usuario)?.puntos_semana ?? 0;

  const puntosParaSubir = useMemo(() => {
    if (posicionActual <= 1) return null;
    const anterior: any = lista[posicionActual - 2];
    const puntosAnterior = pestana === 'global' ? anterior?.puntos_totales : anterior?.puntos_semana;
    if (puntosAnterior == null) return null;
    return puntosAnterior - puntosActuales + 1;
  }, [lista, posicionActual, puntosActuales, pestana]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>← Perfil</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>🏆 Ranking de Exploradores</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, pestana === 'global' && styles.tabActiva]}
            onPress={() => setPestana('global')}
          >
            <Text style={[styles.tabTexto, pestana === 'global' && styles.tabTextoActivo]}>🌍 Global</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, pestana === 'semana' && styles.tabActiva]}
            onPress={() => setPestana('semana')}
          >
            <Text style={[styles.tabTexto, pestana === 'semana' && styles.tabTextoActivo]}>📅 Esta Semana</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cargandoSemana ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#ea580c" />
        </View>
      ) : (
        <FlatList
          data={resto}
          keyExtractor={(item) => String(item.id_usuario)}
          contentContainerStyle={styles.listaContenido}
          ListHeaderComponent={
            <>
              <View style={styles.podio}>
                {podio[1] && <PodioItem usuario={podio[1]} posicion={2} pestana={pestana} />}
                {podio[0] && <PodioItem usuario={podio[0]} posicion={1} pestana={pestana} destacado />}
                {podio[2] && <PodioItem usuario={podio[2]} posicion={3} pestana={pestana} />}
              </View>
              <Text style={styles.seccionTitulo}>POSICIONES</Text>
            </>
          }
          renderItem={({ item, index }) => {
            const posicion = index + 4;
            const esActual = item.id_usuario === perfil?.id_usuario;
            const puntos =
              pestana === 'global'
                ? (item as UsuarioRanking).puntos_totales
                : (item as UsuarioRankingSemanal).puntos_semana;
            const nivelTexto =
              pestana === 'global' ? `Nivel ${(item as UsuarioRanking).niveles?.orden ?? '-'}` : null;

            return (
              <View style={[styles.filaPosicion, esActual && styles.filaActual]}>
                <Text style={styles.numeroPosicion}>#{posicion}</Text>
                <View style={styles.avatarChico}>
                  <Text style={styles.avatarChicoTexto}>{esActual ? 'TÚ' : iniciales(item.nombre)}</Text>
                </View>
                <View style={styles.infoUsuario}>
                  <Text style={styles.nombreUsuarioFila}>{esActual ? 'Tú' : item.nombre}</Text>
                  {nivelTexto && <Text style={styles.nivelUsuarioFila}>{nivelTexto}</Text>}
                </View>
                <Text style={styles.puntosFila}>{puntos}</Text>
              </View>
            );
          }}
          ListFooterComponent={
            perfil && posicionActual > 0 ? (
              <View style={styles.tarjetaActual}>
                <Text style={styles.tarjetaActualEtiqueta}>Tu posición actual</Text>
                <View style={styles.tarjetaActualFila}>
                  <View style={styles.avatarChico}>
                    <Text style={styles.avatarChicoTexto}>TÚ</Text>
                  </View>
                  <View>
                    <Text style={styles.tarjetaActualNombre}>
                      {perfil.niveles?.nombre ?? 'Explorador'} · Nivel {perfil.niveles?.orden ?? '-'}
                    </Text>
                    <Text style={styles.tarjetaActualPuntos}>
                      {puntosActuales} pts · #{posicionActual} en el ranking
                    </Text>
                  </View>
                </View>
                {puntosParaSubir != null && puntosParaSubir > 0 && (
                  <Text style={styles.tarjetaActualMeta}>
                    +{puntosParaSubir} pts para subir al #{posicionActual - 1}
                  </Text>
                )}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

function PodioItem({ usuario, posicion, pestana, destacado = false }: any) {
  const medalla = posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : '🥉';
  const puntos = pestana === 'global' ? usuario.puntos_totales : usuario.puntos_semana;

  return (
    <View style={[styles.podioItem, destacado && styles.podioItemAlto]}>
      <Text style={styles.medalla}>{medalla}</Text>
      <View style={[styles.avatarPodio, destacado && styles.avatarPodioGrande]}>
        <Text style={styles.avatarPodioTexto}>{iniciales(usuario.nombre)}</Text>
      </View>
      <Text style={styles.nombrePodio}>{usuario.nombre}</Text>
      <View style={[styles.tarjetaPodio, destacado && styles.tarjetaPodioOro]}>
        <Text style={styles.posicionPodio}>#{posicion}</Text>
        <Text style={styles.puntosPodio}>{puntos}</Text>
      </View>
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
  titulo: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  tabs: { flexDirection: 'row', backgroundColor: '#ffffff33', borderRadius: 20, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 16, alignItems: 'center' },
  tabActiva: { backgroundColor: '#fff' },
  tabTexto: { color: '#fff', fontWeight: '600', fontSize: 13 },
  tabTextoActivo: { color: '#ea580c' },
  listaContenido: { padding: 20, paddingBottom: 40 },
  podio: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginVertical: 16 },
  podioItem: { alignItems: 'center', width: 90 },
  podioItemAlto: { marginBottom: 16 },
  medalla: { fontSize: 22 },
  avatarPodio: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#9ca3af',
    justifyContent: 'center', alignItems: 'center',
    marginVertical: 4,
  },
  avatarPodioGrande: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f59e0b' },
  avatarPodioTexto: { color: '#fff', fontWeight: '700' },
  nombrePodio: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 4 },
  tarjetaPodio: { backgroundColor: '#e5e7eb', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center', width: '100%' },
  tarjetaPodioOro: { backgroundColor: '#fef3c7' },
  posicionPodio: { fontSize: 13, fontWeight: '700', color: '#374151' },
  puntosPodio: { fontSize: 12, color: '#6b7280' },
  seccionTitulo: { fontSize: 13, fontWeight: '700', color: '#9ca3af', marginBottom: 10, marginTop: 8 },
  filaPosicion: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  filaActual: { backgroundColor: '#dcfce7' },
  numeroPosicion: { width: 30, fontSize: 13, fontWeight: '700', color: '#6b7280' },
  avatarChico: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ec4899', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarChicoTexto: { color: '#fff', fontSize: 12, fontWeight: '700' },
  infoUsuario: { flex: 1 },
  nombreUsuarioFila: { fontSize: 14, fontWeight: '600', color: '#111827' },
  nivelUsuarioFila: { fontSize: 12, color: '#6b7280' },
  puntosFila: { fontSize: 14, fontWeight: '700', color: '#ea580c' },
  tarjetaActual: { backgroundColor: '#166534', borderRadius: 16, padding: 16, marginTop: 8 },
  tarjetaActualEtiqueta: { color: '#bbf7d0', fontSize: 12, marginBottom: 8 },
  tarjetaActualFila: { flexDirection: 'row', alignItems: 'center' },
  tarjetaActualNombre: { color: '#fff', fontWeight: '700', fontSize: 14 },
  tarjetaActualPuntos: { color: '#bbf7d0', fontSize: 12 },
  tarjetaActualMeta: { color: '#bbf7d0', fontSize: 12, marginTop: 8 },
});