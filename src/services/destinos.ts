import { supabase } from '@/lib/supabase';

export async function obtenerDestinos() {
  const { data, error } = await supabase
    .from('destinos')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
}

export async function obtenerDestino(id: number) {
  const { data, error } = await supabase
    .from('destinos')
    .select('*')
    .eq('id_destino', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}