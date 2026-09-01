/**
 * Layout raíz del módulo turístico.
 *
 * Deliberadamente mínimo: solo el provider del catálogo y el Stack.
 * Cuando se integren los módulos de usuarios y gamificación, aquí es
 * donde se agregan el portón de sesión y los demás providers.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DestinosProvider } from '@/context/destinos-context';
import { Colores } from '@/constants/theme';

export default function RootLayout() {
  return (
    <DestinosProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colores.tarjeta },
          headerTintColor: Colores.verdeOscuro,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colores.fondo },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="destino/[id]" options={{ title: 'Destino' }} />
        <Stack.Screen name="ruta/[id]" options={{ title: 'Ruta' }} />
        <Stack.Screen name="categoria/[id]" options={{ title: 'Categoría' }} />
        {/* Módulo de mapa (Niriel) */}
        <Stack.Screen name="destinos/[id]" options={{ title: 'Destino' }} />
        <Stack.Screen name="mapa" options={{ title: 'Mapa' }} />
      </Stack>
    </DestinosProvider>
  );
}
