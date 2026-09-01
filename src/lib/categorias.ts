/** Acceso a datos: categorias y departamentos. */
import { supabase } from '@/lib/supabase';
import type { Categoria, Departamento } from '@/types/database';

export async function listarCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase.from('categorias').select('*').order('id_categoria');
  if (error) throw new Error(`No se pudieron cargar las categorías: ${error.message}`);
  return data ?? [];
}

export async function listarDepartamentos(): Promise<Departamento[]> {
  const { data, error } = await supabase.from('departamentos').select('*').order('nombre');
  if (error) throw new Error(`No se pudieron cargar los departamentos: ${error.message}`);
  return data ?? [];
}

export async function obtenerCategoria(idCategoria: number): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from('categorias').select('*').eq('id_categoria', idCategoria).maybeSingle();
  if (error) throw new Error(`Categoría no encontrada: ${error.message}`);
  return data ?? null;
}
