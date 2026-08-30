/**
 * Una parada de la línea de tiempo vertical del detalle de ruta:
 * el círculo numerado, la línea que baja hacia la siguiente, y al lado
 * lo que le manden como hijo (normalmente una TarjetaDestino).
 */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colores, Espacio, Radio } from '@/constants/theme';

type Props = {
  numero: number;
  esUltima: boolean;
  visitada?: boolean;
  nota?: string | null;
  children: ReactNode;
};

export function ParadaRuta({ numero, esUltima, visitada = false, nota, children }: Props) {
  return (
    <View style={estilos.fila}>
      <View style={estilos.columnaLinea}>
        <View style={[estilos.circulo, visitada && estilos.circuloVisitado]}>
          <Text style={[estilos.numero, visitada && estilos.numeroVisitado]}>
            {visitada ? '✓' : numero}
          </Text>
        </View>
        {!esUltima ? <View style={estilos.linea} /> : null}
      </View>

      <View style={estilos.contenido}>
        {children}
        {nota ? <Text style={estilos.nota}>{nota}</Text> : null}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: 'row', gap: Espacio.md - 4 },
  columnaLinea: { alignItems: 'center', width: 32 },
  circulo: {
    width: 30,
    height: 30,
    borderRadius: Radio.pastilla,
    borderWidth: 2,
    borderColor: Colores.verde,
    backgroundColor: Colores.tarjeta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloVisitado: { backgroundColor: Colores.verde },
  numero: { fontSize: 13, fontWeight: '700', color: Colores.verde },
  numeroVisitado: { color: '#FFFFFF' },
  linea: { flex: 1, width: 2, backgroundColor: Colores.borde, marginVertical: 2 },
  contenido: { flex: 1, paddingBottom: Espacio.md },
  nota: { fontSize: 12.5, color: Colores.textoSuave, fontStyle: 'italic', marginTop: -Espacio.sm },
});
