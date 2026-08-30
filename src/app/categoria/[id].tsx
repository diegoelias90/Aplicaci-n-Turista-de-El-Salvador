/** Destinos de una sola categoría. Se llega desde los chips del Inicio. */
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

import { TarjetaDestino } from '@/components/destinos/tarjeta-destino';
import { Cargando } from '@/components/ui/cargando';
import { EstadoVacio } from '@/components/ui/estado-vacio';
import { Colores, Espacio, estiloDeCategoria } from '@/constants/theme';
import { Mensajes } from '@/constants/mensajes';
import { obtenerCategoria } from '@/lib/categorias';
import { listarDestinos } from '@/lib/destinos';
import type { Categoria, DestinoDetallado } from '@/types/database';

export default function PantallaCategoria() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idCategoria = Number(id);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [destinos, setDestinos] = useState<DestinoDetallado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const cargar = useCallback(async () => {
    if (!Number.isFinite(idCategoria)) return;
    setCargando(true);
    try {
      const [cat, lista] = await Promise.all([
        obtenerCategoria(idCategoria),
        listarDestinos({ idCategoria }),
      ]);
      setCategoria(cat);
      setDestinos(lista);
    } catch (e) {
      setError(e instanceof Error ? e.message : Mensajes.errorGenerico);
    } finally {
      setCargando(false);
    }
  }, [idCategoria]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const { emoji } = estiloDeCategoria(categoria?.nombre);

  if (cargando) return <Cargando texto="Cargando destinos..." />;

  return (
    <>
      <Stack.Screen
        options={{ title: categoria ? `${emoji} ${categoria.nombre}` : 'Categoría' }}
      />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <FlatList
        data={destinos}
        keyExtractor={(d) => String(d.id_destino)}
        contentContainerStyle={estilos.lista}
        style={estilos.contenedor}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          categoria?.descripcion ? (
            <Text style={estilos.descripcion}>{categoria.descripcion}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TarjetaDestino
            destino={item}
            onPress={() => router.push(`/destino/${item.id_destino}`)}
          />
        )}
        ListEmptyComponent={
          <EstadoVacio titulo="Sin destinos" mensaje="Todavía no hay lugares en esta categoría." />
        }
      />
    </>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colores.fondo },
  lista: { padding: Espacio.md },
  descripcion: { fontSize: 14, color: Colores.textoSuave, marginBottom: Espacio.md, lineHeight: 20 },
  error: { margin: Espacio.md, color: Colores.coral, fontSize: 13 },
});
