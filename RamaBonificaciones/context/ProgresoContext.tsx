import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import {
  obtenerPerfilUsuario,
  contarDestinosVisitados,
  contarInsignias,
  obtenerRanking,
  obtenerNiveles,
} from '../lib/progreso-service';
import type { PerfilUsuario, Nivel, UsuarioRanking } from '../lib/progreso-types';

interface ProgresoContextValue {
  perfil: PerfilUsuario | null;
  visitados: number;
  insignias: number;
  posicionRanking: number | null;
  siguienteNivel: Nivel | null;
  ranking: UsuarioRanking[];
  cargando: boolean;
  recargar: () => Promise<void>;
}

const ProgresoContext = createContext<ProgresoContextValue | null>(null);

export function ProgresoProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [visitados, setVisitados] = useState(0);
  const [insignias, setInsignias] = useState(0);
  const [posicionRanking, setPosicionRanking] = useState<number | null>(null);
  const [siguienteNivel, setSiguienteNivel] = useState<Nivel | null>(null);
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarProgreso = useCallback(async () => {
    setCargando(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setCargando(false);
      return;
    }

    const perfilData = await obtenerPerfilUsuario(user.id);
    const [visitasData, insigniasData, rankingData, niveles] = await Promise.all([
      contarDestinosVisitados(perfilData.id_usuario),
      contarInsignias(perfilData.id_usuario),
      obtenerRanking(),
      obtenerNiveles(),
    ]);

    const posicion = rankingData.findIndex(u => u.id_usuario === perfilData.id_usuario) + 1;
    const siguiente = niveles.find(n => n.orden === perfilData.niveles.orden + 1) ?? null;

    setPerfil(perfilData);
    setVisitados(visitasData);
    setInsignias(insigniasData);
    setPosicionRanking(posicion || null);
    setSiguienteNivel(siguiente);
    setRanking(rankingData);
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarProgreso();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      cargarProgreso();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [cargarProgreso]);

  return (
    <ProgresoContext.Provider
      value={{ perfil, visitados, insignias, posicionRanking, siguienteNivel, ranking, cargando, recargar: cargarProgreso }}
    >
      {children}
    </ProgresoContext.Provider>
  );
}

export function useProgreso(): ProgresoContextValue {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error('useProgreso debe usarse dentro de <ProgresoProvider>');
  return ctx;
}