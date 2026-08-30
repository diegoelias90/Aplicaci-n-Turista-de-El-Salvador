/** Acceso a datos: rutas turísticas. */
import { supabase } from '@/lib/supabase';
import type { Ruta, RutaConParadas, RutaDetallada } from '@/types/database';

/** Listado con la cadena de paradas resumida, para la pantalla de Rutas. */
export async function listarRutas(): Promise<RutaConParadas[]> {
  const { data, error } = await supabase
    .from('rutas')
    .select('*, paradas:ruta_destino(orden, destino:destinos(id_destino, nombre))')
    .order('nombre')
    .order('orden', { referencedTable: 'ruta_destino', ascending: true });

  if (error) throw new Error(`No se pudieron cargar las rutas: ${error.message}`);
  return (data ?? []) as unknown as RutaConParadas[];
}

/**
 * Join de dos niveles: ruta -> paradas -> destino -> categoría/departamento.
 * Es la consulta más compleja del módulo y vale la pena poder explicarla.
 */
export async function obtenerRuta(idRuta: number): Promise<RutaDetallada> {
  const { data, error } = await supabase
    .from('rutas')
    .select(`
      *,
      paradas:ruta_destino(
        id_ruta, id_destino, orden,
        destino:destinos(
          *, categoria:categorias(*), departamento:departamentos(*), multimedia(*)
        )
      )
    `)
    .eq('id_ruta', idRuta)
    .order('orden', { referencedTable: 'ruta_destino', ascending: true })
    .single();

  if (error) throw new Error(`Ruta no encontrada: ${error.message}`);
  return data as unknown as RutaDetallada;
}

/** Las rutas que pasan por un destino. Se muestra en el detalle del destino. */
export async function rutasDeDestino(idDestino: number): Promise<Ruta[]> {
  const { data, error } = await supabase
    .from('ruta_destino').select('ruta:rutas(*)').eq('id_destino', idDestino);
  if (error) throw new Error(`No se pudieron cargar las rutas: ${error.message}`);
  return (data ?? []).map((f: any) => f.ruta).filter(Boolean) as Ruta[];
}

/** CREATE - arma una ruta eligiendo destinos en orden. */
export async function crearRuta(
  datos: Pick<Ruta, 'nombre' | 'descripcion' | 'dificultad'>,
  destinosOrdenados: number[],
): Promise<Ruta> {
  const { data: ruta, error: errorRuta } = await supabase
    .from('rutas').insert(datos).select().single();
  if (errorRuta) throw new Error(`No se pudo crear la ruta: ${errorRuta.message}`);

  if (destinosOrdenados.length > 0) {
    const paradas = destinosOrdenados.map((id_destino, i) => ({
      id_ruta: ruta.id_ruta, id_destino, orden: i + 1,
    }));
    const { error: errorParadas } = await supabase.from('ruta_destino').insert(paradas);
    if (errorParadas) {
      // Si fallan las paradas la ruta quedaría huérfana: la borramos.
      await supabase.from('rutas').delete().eq('id_ruta', ruta.id_ruta);
      throw new Error(`No se pudieron guardar las paradas: ${errorParadas.message}`);
    }
  }
  return ruta as Ruta;
}

export async function actualizarRuta(idRuta: number, cambios: Partial<Ruta>) {
  const { error } = await supabase.from('rutas').update(cambios).eq('id_ruta', idRuta);
  if (error) throw new Error(`No se pudo actualizar la ruta: ${error.message}`);
}

/** DELETE. Las paradas caen solas por ON DELETE CASCADE. */
export async function eliminarRuta(idRuta: number) {
  const { error } = await supabase.from('rutas').delete().eq('id_ruta', idRuta);
  if (error) throw new Error(`No se pudo eliminar la ruta: ${error.message}`);
}
