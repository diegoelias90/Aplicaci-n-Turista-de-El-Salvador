/**
 * Tema de la app. Los colores salen del prototipo de Figma:
 * verde salvadoreno de fondo, tarjetas blancas y dorado para los puntos.
 */
import '@/global.css';

import { Platform } from 'react-native';

export const Colores = {
  verde: '#12784A',
  verdeOscuro: '#0B5233',
  verdeClaro: '#E3F1E8',
  dorado: '#F2A93B',
  doradoSuave: '#FDF2DE',
  coral: '#D9455F',

  texto: '#0F1A14',
  textoSuave: '#5A6B60',
  textoTenue: '#8B9A91',

  fondo: '#F4F7F5',
  tarjeta: '#FFFFFF',
  borde: '#E1E9E4',
} as const;

/**
 * Emoji y color por categoria. Va aqui y no en la base porque la tabla
 * Categorias solo tiene nombre y descripcion: asi no hay que pedirle
 * ningun cambio a Victoria para poder pintar el disenio.
 * La llave es el nombre exacto que ella inserto en la tabla.
 */
export const EstiloCategoria: Record<string, { emoji: string; color: string }> = {
  'Playas': { emoji: '🏖️', color: '#0E8AA8' },
  'Volcanes': { emoji: '🌋', color: '#B4552B' },
  'Pueblos': { emoji: '🏘️', color: '#9A7A22' },
  'Sitios históricos': { emoji: '🏛️', color: '#6B4E9E' },
  'Parques naturales': { emoji: '🌿', color: '#12784A' },
  'Restaurantes': { emoji: '🍽️', color: '#C0435F' },
};

export function estiloDeCategoria(nombre?: string | null) {
  return (nombre && EstiloCategoria[nombre]) || { emoji: '📍', color: Colores.verde };
}

/** El esquema guarda baja/media/alta; el disenio muestra otra palabra. */
export const EtiquetaDificultad: Record<string, { texto: string; color: string }> = {
  baja: { texto: 'Fácil', color: '#12784A' },
  media: { texto: 'Media', color: '#C08A1E' },
  alta: { texto: 'Difícil', color: '#C0435F' },
};

export const Espacio = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const Radio = { sm: 8, md: 12, lg: 16, xl: 20, pastilla: 999 } as const;

export const Sombra = Platform.select({
  ios: {
    shadowColor: '#0F1A14',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  default: { elevation: 2 },
});

export const AltoBarraTabs = Platform.select({ ios: 50, android: 70 }) ?? 60;
