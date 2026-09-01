import { supabase } from './supabase';
import type { PerfilUsuario, UsuarioRanking, Nivel, UsuarioRankingSemanal, MisionUsuario} from './progreso-types';

// Trae el usuario junto con su nivel actual
export async function obtenerPerfilUsuario(authId: string): Promise<PerfilUsuario> {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id_usuario,
      nombre,
      puntos_totales,
      id_nivel,
      niveles ( nombre, puntos_requeridos, orden )
    `)
    .eq('auth_id', authId)
    .single();

  if (error) throw error;
  return data as unknown as PerfilUsuario;
}

// Cuenta cuantos destinos ha visitado
export async function contarDestinosVisitados(idUsuario: number): Promise<number> {
  const { count, error } = await supabase
    .from('visitas')
    .select('*', { count: 'exact', head: true })
    .eq('id_usuario', idUsuario);

  if (error) throw error;
  return count ?? 0;
}

// Cuenta cuantas insignias tiene
export async function contarInsignias(idUsuario: number): Promise<number> {
  const { count, error } = await supabase
    .from('usuario_insignia')
    .select('*', { count: 'exact', head: true })
    .eq('id_usuario', idUsuario);

  if (error) throw error;
  return count ?? 0;
}

// Trae el ranking global ordenado por puntos
export async function obtenerRanking(limite = 50): Promise<UsuarioRanking[]> {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      id_usuario,
      nombre,
      puntos_totales,
      id_nivel,
      niveles ( nombre, orden )
    `)
    .order('puntos_totales', { ascending: false })
    .limit(limite);

  if (error) throw error;
  return (data ?? []) as unknown as UsuarioRanking[];
}

// Suma los puntos ganados en misiones completadas en los ultimos 7 dias
export async function obtenerRankingSemanal(limite = 50): Promise<UsuarioRankingSemanal[]> {
  const haceSieteDias = new Date();
  haceSieteDias.setDate(haceSieteDias.getDate() - 7);

  const { data, error } = await supabase
    .from('usuario_mision')
    .select(`
      id_usuario,
      fecha_completada,
      usuarios ( nombre, id_nivel ),
      misiones ( puntos_otorgados )
    `)
    .eq('estado', 'completada')
    .gte('fecha_completada', haceSieteDias.toISOString());

  if (error) throw error;

  const acumulado = new Map<number, UsuarioRankingSemanal>();

  (data ?? []).forEach((fila: any) => {
    const puntos = fila.misiones?.puntos_otorgados ?? 0;
    const existente = acumulado.get(fila.id_usuario);
    if (existente) {
      existente.puntos_semana += puntos;
    } else {
      acumulado.set(fila.id_usuario, {
        id_usuario: fila.id_usuario,
        nombre: fila.usuarios?.nombre ?? '',
        id_nivel: fila.usuarios?.id_nivel ?? 0,
        puntos_semana: puntos,
      });
    }
  });

  return Array.from(acumulado.values())
    .sort((a, b) => b.puntos_semana - a.puntos_semana)
    .slice(0, limite);
}
// Trae todos los niveles ordenados, para calcular cuanto falta para el siguiente
export async function obtenerNiveles(): Promise<Nivel[]> {
  const { data, error } = await supabase
    .from('niveles')
    .select('id_nivel, nombre, puntos_requeridos, orden')
    .order('orden', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
// Trae todas las misiones junto con el estado de este usuario en cada una
export async function obtenerMisionesConEstado(idUsuario: number): Promise<MisionUsuario[]> {
  const { data: misiones, error: errorMisiones } = await supabase
    .from('misiones')
    .select('id_mision, titulo, descripcion, puntos_otorgados, id_destino');

  if (errorMisiones) throw errorMisiones;

  const { data: progreso, error: errorProgreso } = await supabase
    .from('usuario_mision')
    .select('id_mision, estado')
    .eq('id_usuario', idUsuario);

  if (errorProgreso) throw errorProgreso;

  const estadoPorMision = new Map<number, 'pendiente' | 'completada'>();
  (progreso ?? []).forEach((p) => estadoPorMision.set(p.id_mision, p.estado as 'pendiente' | 'completada'));

  return (misiones ?? []).map((m) => ({
    ...m,
    estado: estadoPorMision.get(m.id_mision) ?? 'pendiente',
  }));
}

// Marca una mision como completada. Siempre pasa por un UPDATE real
// (aunque sea la primera vez), porque el trigger que otorga los puntos
// solo escucha UPDATE, no INSERT.
export async function completarMision(idUsuario: number, idMision: number): Promise<void> {
  // asegura que exista la fila (si ya existe, no hace nada)
  await supabase
    .from('usuario_mision')
    .upsert(
      { id_usuario: idUsuario, id_mision: idMision },
      { onConflict: 'id_usuario,id_mision', ignoreDuplicates: true }
    );

  // este UPDATE es el que dispara el trigger de puntos y nivel
  const { error } = await supabase
    .from('usuario_mision')
    .update({ estado: 'completada', fecha_completada: new Date().toISOString() })
    .eq('id_usuario', idUsuario)
    .eq('id_mision', idMision);

  if (error) throw error;
}