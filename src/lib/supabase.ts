/**
 * Cliente unico de Supabase.  Duenio: Diego  ·  Vive en main.
 * Guia 4, paginas 13 y 22.  Nadie mas crea un createClient().
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const llave = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Ojo: en Expo SDK 49+ solo llegan al bundle las variables con prefijo
// EXPO_PUBLIC_. Sin ese prefijo, process.env devuelve undefined.
if (!url) throw new Error('Falta EXPO_PUBLIC_SUPABASE_URL. Copia .env.example a .env');
if (!llave) throw new Error('Falta EXPO_PUBLIC_SUPABASE_ANON_KEY. Copia .env.example a .env');

export const supabase = createClient(url, llave, {
  auth: {
    storage: AsyncStorage,      // la sesion sobrevive al cierre de la app
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,  // en movil no hay URL de retorno
  },
});
