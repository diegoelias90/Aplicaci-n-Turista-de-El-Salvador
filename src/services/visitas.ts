import { supabase } from '@/lib/supabase';

export async function registrarVisita(
  idDestino: number,
  latitud: number,
  longitud: number
) {
  // Usuario actualmente autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error('No hay usuario autenticado');
  }

  // Buscar el usuario de nuestra tabla usuarios
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('id_usuario')
    .eq('auth_id', user.id)
    .single();

  if (usuarioError) {
    throw usuarioError;
  }

  // Evitar registrar la misma visita varias veces
  const { data: visitaExistente, error: existeError } = await supabase
    .from('visitas')
    .select('id_visita')
    .eq('id_usuario', usuario.id_usuario)
    .eq('id_destino', idDestino)
    .maybeSingle();

  if (existeError) {
    throw existeError;
  }

  if (visitaExistente) {
    return visitaExistente;
  }

  // Registrar nueva visita
  const { data, error } = await supabase
    .from('visitas')
    .insert({
      id_usuario: usuario.id_usuario,
      id_destino: idDestino,
      fecha_visita: new Date().toISOString(),
      latitud,
      longitud,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
