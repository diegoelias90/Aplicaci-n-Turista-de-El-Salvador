/**
 * ESTADO GLOBAL del módulo turístico.
 * Guarda el catálogo y los filtros para no volver a pedirlos en cada
 * pantalla. Es el requisito de Context API + Hooks del proyecto.
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';

import { listarCategorias } from '@/lib/categorias';
import { listarDestinos, type FiltrosDestino } from '@/lib/destinos';
import type { Categoria, DestinoDetallado } from '@/types/database';

type ValorDestinos = {
  destinos: DestinoDetallado[];
  categorias: Categoria[];
  filtros: FiltrosDestino;
  cargando: boolean;
  error: string | null;
  aplicarFiltros: (f: FiltrosDestino) => void;
  recargar: () => Promise<void>;
};

const Contexto = createContext<ValorDestinos | undefined>(undefined);

export function DestinosProvider({ children }: { children: ReactNode }) {
  const [destinos, setDestinos] = useState<DestinoDetallado[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtros, setFiltros] = useState<FiltrosDestino>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [lista, cats] = await Promise.all([listarDestinos(filtros), listarCategorias()]);
      setDestinos(lista);
      setCategorias(cats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  // Se vuelve a pedir cada vez que cambian los filtros.
  useEffect(() => {
    recargar();
  }, [recargar]);

  const valor = useMemo<ValorDestinos>(
    () => ({ destinos, categorias, filtros, cargando, error, aplicarFiltros: setFiltros, recargar }),
    [destinos, categorias, filtros, cargando, error, recargar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDestinos() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('useDestinos debe usarse dentro de <DestinosProvider>');
  return ctx;
}
