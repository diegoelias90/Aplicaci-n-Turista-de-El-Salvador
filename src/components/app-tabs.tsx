/**
 * Barra inferior. Por ahora tiene solo las dos pestañas de este módulo.
 * Cuando se integren los demás módulos, se agrega un NativeTabs.Trigger
 * por pantalla nueva; el `name` tiene que ser el nombre del archivo
 * dentro de src/app/(tabs)/.
 */
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colores } from '@/constants/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Colores.tarjeta}
      indicatorColor={Colores.verdeClaro}
      labelStyle={{ selected: { color: Colores.verdeOscuro } }}>
      <NativeTabs.Trigger name="destinos">
        <NativeTabs.Trigger.Label>Destinos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'mappin', selected: 'mappin.circle.fill' }}
          md="place"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="rutas">
        <NativeTabs.Trigger.Label>Rutas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="signpost.right" md="route" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
