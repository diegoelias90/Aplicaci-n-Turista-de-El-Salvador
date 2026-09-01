import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProgresoProvider } from '../context/ProgresoContext';

export default function RootLayout() {
  useEffect(() => {
    supabase.auth.signInWithPassword({
      email: 'victoria.leivapadilla07@gmail.com',
      password: 'Neron240807',
    });
  }, []);

  return (
    <ProgresoProvider>
      <Slot />
    </ProgresoProvider>
  );
}