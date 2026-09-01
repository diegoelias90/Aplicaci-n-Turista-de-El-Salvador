import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../components/Logo";

export default function Registro() {
  const router = useRouter();

  const [paso, setPaso] = useState(1);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] =
    useState("");
  const [interes, setInteres] = useState("");

  const siguientePaso = () => {
    if (paso === 1) {
      if (
        nombre.trim() === "" ||
        correo.trim() === ""
      ) {
        Alert.alert(
          "Campos incompletos",
          "Ingresa tu nombre y correo."
        );
        return;
      }

      setPaso(2);
      return;
    }

    if (paso === 2) {
      if (password.length < 4) {
        Alert.alert(
          "Contraseña muy corta",
          "Usa al menos 4 caracteres."
        );
        return;
      }

      if (password !== confirmarPassword) {
        Alert.alert(
          "Las contraseñas no coinciden",
          "Verifica ambos campos."
        );
        return;
      }

      setPaso(3);
      return;
    }

    if (paso === 3) {
      Alert.alert(
        "¡Cuenta creada!",
        `Bienvenido, ${nombre}.`
      );

      router.replace("/login");
    }
  };

  return (
    <View style={styles.contenedor}>
      <LinearGradient
        colors={["#C2185B", "#6A1B57"]}
        style={styles.encabezado}
      >
        <Pressable
          onPress={() =>
            paso === 1
              ? router.back()
              : setPaso(paso - 1)
          }
        >
          <Text style={styles.atras}>
            ← Atrás
          </Text>
        </Pressable>

        <Text style={styles.titulo}>
          Crea tu cuenta
        </Text>

        <Text style={styles.subtitulo}>
          Únete a la comunidad exploradora
        </Text>

        <View style={styles.pasos}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={styles.pasoItem}>
              <View
                style={[
                  styles.circulo,
                  n === paso && styles.circuloActivo,
                ]}
              >
                <Text style={styles.circuloTexto}>
                  {n}
                </Text>
              </View>

              {n === 3 && (
                <Text style={styles.pasoLabel}>
                  Datos{"\n"}personales
                </Text>
              )}
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.cuerpo}>
        {paso === 1 && (
          <>
            <Logo />

            <Text style={styles.pregunta}>
              ¿Cómo te llamas?
            </Text>

            <Text style={styles.etiqueta}>
              Nombre completo
            </Text>

            <TextInput
              style={styles.input}
              placeholder="María González"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />

            <Text style={styles.etiqueta}>
              Correo electrónico
            </Text>

            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </>
        )}

        {paso === 2 && (
          <>
            <Text style={styles.pregunta}>
              Crea tu contraseña
            </Text>

            <Text style={styles.etiqueta}>
              Contraseña
            </Text>

            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.etiqueta}>
              Confirmar contraseña
            </Text>

            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
              secureTextEntry
            />
          </>
        )}

        {paso === 3 && (
          <>
            <Text style={styles.pregunta}>
              ¿Qué te interesa explorar?
            </Text>

            <Text style={styles.etiqueta}>
              Intereses (playas, volcanes,
              gastronomía...)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ej. Playas y senderismo"
              value={interes}
              onChangeText={setInteres}
            />
          </>
        )}

        <TouchableOpacity
          style={styles.botonPrincipal}
          onPress={siguientePaso}
        >
          <Text style={styles.textoBotonPrincipal}>
            {paso < 3
              ? "Continuar →"
              : "Crear cuenta"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F6EAF1",
  },

  encabezado: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  atras: {
    color: "white",
    marginBottom: 16,
  },

  titulo: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#F3D6E6",
    fontSize: 13,
    marginBottom: 16,
  },

  pasos: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  pasoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  circulo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  circuloActivo: {
    backgroundColor: "white",
  },

  circuloTexto: {
    color: "#6A1B57",
    fontWeight: "bold",
    fontSize: 12,
  },

  pasoLabel: {
    color: "white",
    fontSize: 10,
  },

  cuerpo: {
    padding: 24,
    gap: 8,
  },

  pregunta: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },

  etiqueta: {
    fontSize: 13,
    color: "#C2185B",
    fontWeight: "600",
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#F0C9DE",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  botonPrincipal: {
    backgroundColor: "#C2185B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },

  textoBotonPrincipal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
