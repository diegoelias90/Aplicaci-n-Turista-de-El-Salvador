/**
 * MODULO TURISTICO -- Diego
 * Espeja las tablas del esquema de Victoria: Departamentos, Categorias,
 * Destinos, Multimedia, Rutas y Ruta_Destino.
 *
 * Los nombres de campo son los de la base (id_destino, no id) y las
 * llaves son NUMBER (SERIAL), no uuid.
 *
 * OJO: en el script las tablas van con mayuscula (CREATE TABLE Destinos)
 * pero Postgres las guarda en minuscula, asi que desde la app siempre
 * se escribe .from('destinos').
 *
 * Los campos marcados OPCIONAL DEL DISENO no existen todavia en la base.
 * El codigo funciona sin ellos: si Victoria agrega las columnas, la
 * interfaz los empieza a mostrar sola sin tocar nada mas.
 */

export type Departamento = {
  id_departamento: number;
  nombre: string;
};

export type Categoria = {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  fecha_actualizacion: string;
};

export type Multimedia = {
  id_multimedia: number;
  tipo: 'foto' | 'video';
  url: string;
  id_destino: number;
};

export type Destino = {
  id_destino: number;
  nombre: string;
  descripcion: string | null;
  latitud: number | null;
  longitud: number | null;
  direccion: string | null;
  id_departamento: number;
  id_categoria: number;
  fecha_actualizacion: string;

  // ---- OPCIONAL DEL DISENO: aun no existen como columnas ----
  puntos?: number;         // el "+150" de la tarjeta
  calificacion?: number;   // las estrellas 4.8
  etiquetas?: string[];    // 'surf', 'atardecer'
};

/** Lo que devuelve el select con joins. Es lo que reciben las tarjetas. */
export type DestinoDetallado = Destino & {
  categoria: Categoria | null;
  departamento: Departamento | null;
  multimedia: Multimedia[];
};

export type Ruta = {
  id_ruta: number;
  nombre: string;
  descripcion: string | null;
  dificultad: 'baja' | 'media' | 'alta';
  fecha_actualizacion: string;

  // ---- OPCIONAL DEL DISENO ----
  duracion_dias?: number;
  puntos?: number;
};

/** Parada resumida: lo justo para pintar la cadena de la tarjeta de ruta. */
export type ParadaResumen = {
  orden: number;
  destino: { id_destino: number; nombre: string } | null;
};

export type RutaConParadas = Ruta & { paradas: ParadaResumen[] };

/** Parada completa: la que usa la linea de tiempo del detalle. */
export type ParadaCompleta = {
  id_ruta: number;
  id_destino: number;
  orden: number;
  destino: DestinoDetallado | null;
};

export type RutaDetallada = Ruta & { paradas: ParadaCompleta[] };
