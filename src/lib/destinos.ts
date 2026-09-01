/**
 * Acceso a datos: destinos.
 * Funciones async, sin JSX y sin hooks. Los errores se lanzan con un
 * mensaje que la pantalla pueda mostrar tal cual.
 */
import { supabase } from '@/lib/supabase';
import type { Destino, DestinoDetallado, Multimedia } from '@/types/database';

// Un solo lugar define el join. Si cambia la forma, cambia aquí y ya.
const CON_RELACIONES =
  '*, categoria:categorias(*), departamento:departamentos(*), multimedia(*)';

export type FiltrosDestino = {
  idCategoria?: number | null;
  idDepartamento?: number | null;
  busqueda?: string;
};

/** READ - listado con filtros combinables. */
export async function listarDestinos(f: FiltrosDestino = {}): Promise<DestinoDetallado[]> {
  let consulta = supabase.from('destinos').select(CON_RELACIONES).order('nombre');

  if (f.idCategoria) consulta = consulta.eq('id_categoria', f.idCategoria);
  if (f.idDepartamento) consulta = consulta.eq('id_departamento', f.idDepartamento);
  if (f.busqueda?.trim()) consulta = consulta.ilike('nombre', `%${f.busqueda.trim()}%`);

  const { data, error } = await consulta;
  if (error) throw new Error(`No se pudieron cargar los destinos: ${error.message}`);
  return (data ?? []) as unknown as DestinoDetallado[];
}

/** READ - un destino con sus relaciones. */
export async function obtenerDestino(idDestino: number): Promise<DestinoDetallado> {
  const { data, error } = await supabase
    .from('destinos').select(CON_RELACIONES).eq('id_destino', idDestino).single();
  if (error) throw new Error(`Destino no encontrado: ${error.message}`);
  return data as unknown as DestinoDetallado;
}

/** Primera foto del destino, o null si todavía no tiene ninguna. */
export function fotoPrincipal(destino: { multimedia?: Multimedia[] }): string | null {
  const foto = (destino.multimedia ?? []).find((m) => m.tipo === 'foto');
  return foto?.url ?? null;
}

/** CREATE */
export async function crearDestino(
  nuevo: Omit<Destino, 'id_destino' | 'fecha_actualizacion'>,
): Promise<Destino> {
  const { data, error } = await supabase.from('destinos').insert(nuevo).select().single();
  if (error) throw new Error(`No se pudo crear el destino: ${error.message}`);
  return data as Destino;
}

/** UPDATE */
export async function actualizarDestino(idDestino: number, cambios: Partial<Destino>) {
  const { data, error } = await supabase
    .from('destinos').update(cambios).eq('id_destino', idDestino).select().single();
  if (error) throw new Error(`No se pudo actualizar el destino: ${error.message}`);
  return data as Destino;
}

/**
 * DELETE. Ojo: Multimedia, Ruta_Destino y Favoritos se van en cascada,
 * y las misiones que apunten a este destino quedan con id_destino null.
 */
export async function eliminarDestino(idDestino: number) {
  const { error } = await supabase.from('destinos').delete().eq('id_destino', idDestino);
  if (error) throw new Error(`No se pudo eliminar el destino: ${error.message}`);
}
