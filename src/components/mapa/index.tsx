/**
 * Puente hacia react-native-maps.
 *
 * react-native-maps es un modulo nativo y revienta el bundle de web
 * ("codegenNativeComponent is not a function"). Metro elige solo el
 * archivo .web.tsx en navegador, asi que las pantallas importan siempre
 * desde '@/components/mapa' y nunca desde 'react-native-maps'.
 */
export { default as MapaView, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
