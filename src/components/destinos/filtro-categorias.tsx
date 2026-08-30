/** Fila horizontal de chips para filtrar por categoría. */
import { ScrollView, StyleSheet } from 'react-native';

import { ChipCategoria } from '@/components/ui/chip-categoria';
import { Espacio, estiloDeCategoria } from '@/constants/theme';
import type { Categoria } from '@/types/database';

type Props = {
  categorias: Categoria[];
  seleccionada: number | null;
  onSeleccionar: (idCategoria: number | null) => void;
};

export function FiltroCategorias({ categorias, seleccionada, onSeleccionar }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.fila}>
      <ChipCategoria
        emoji="🌎"
        nombre="Todo"
        activo={seleccionada === null}
        onPress={() => onSeleccionar(null)}
      />

      {categorias.map((c) => {
        const { emoji, color } = estiloDeCategoria(c.nombre);
        return (
          <ChipCategoria
            key={c.id_categoria}
            emoji={emoji}
            nombre={c.nombre}
            color={color}
            activo={seleccionada === c.id_categoria}
            onPress={() => onSeleccionar(c.id_categoria)}
          />
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fila: { gap: Espacio.sm, paddingVertical: Espacio.sm, paddingRight: Espacio.md },
});
