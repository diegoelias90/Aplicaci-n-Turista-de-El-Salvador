export interface Nivel {
  id_nivel?: number;
  nombre: string;
  puntos_requeridos: number;
  orden: number;
}

export interface PerfilUsuario {
  id_usuario: number;
  nombre: string;
  puntos_totales: number;
  id_nivel: number;
  niveles: Nivel;
}

export interface UsuarioRanking {
  id_usuario: number;
  nombre: string;
  puntos_totales: number;
  id_nivel: number;
  niveles: Nivel;
}

export interface UsuarioRankingSemanal {
  id_usuario: number;
  nombre: string;
  id_nivel: number;
  puntos_semana: number;
}

export interface MisionUsuario {
  id_mision: number;
  titulo: string;
  descripcion: string | null;
  puntos_otorgados: number;
  id_destino: number | null;
  estado: 'pendiente' | 'completada';
}