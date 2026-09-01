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

export default function Login() {
  const router = useRouter();

  // Credenciales de prueba
  const usuarioCorrecto = "jonathan@correo.com";
  const passwordCorrecta = "1234";

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);

  const iniciarSesion = () => {
    if (correo.trim() === "" || password.trim() === "") {
      Alert.alert(
        "Campos vacíos",
        "Ingresa tu correo y contraseña."
      );
      return;
    }

    if (
      correo.trim().toLowerCase() === usuarioCorrecto &&
      password === passwordCorrecta
    ) {
      router.replace("/");
    } else {
      Alert.alert(
        "Error",
        "Correo o contraseña incorrectos."
      );
    }
  };

  const continuarConProveedor = (proveedor: string) => {
    Alert.alert(
      "Próximamente",
      `Inicio de sesión con ${proveedor} aún no está conectado.`
    );
  };

  return (
    <View style={styles.contenedor}>
      <LinearGradient
        colors={["#1F7A4D", "#0F4A2E"]}
        style={styles.encabezado}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.atras}>← Atrás</Text>
        </Pressable>

        <Text style={styles.titulo}>
          Bienvenido de vuelta
        </Text>

        <Text style={styles.subtitulo}>
          Inicia sesión para continuar explorando
        </Text>
      </LinearGradient>

      <View style={styles.cuerpo}>
        <Logo />

        <TouchableOpacity
          style={[
            styles.botonProveedor,
            { backgroundColor: "#E8F0FE" },
          ]}
          onPress={() => continuarConProveedor("Facebook")}
        >
          <Text style={styles.textoProveedor}>
            Continuar con Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botonProveedor,
            { backgroundColor: "#FDEAEA" },
          ]}
          onPress={() => continuarConProveedor("Google")}
        >
          <Text style={styles.textoProveedor}>
            Continuar con Google
          </Text>
        </TouchableOpacity>

        <Text style={styles.separador}>
          o con correo
        </Text>

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

        <Text style={styles.etiqueta}>
          Contraseña
        </Text>

        <View style={styles.inputPasswordContenedor}>
          <TextInput
            style={styles.inputPassword}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!verPassword}
          />

          <Pressable
            onPress={() => setVerPassword(!verPassword)}
          >
            <Text style={styles.ver}>
              {verPassword ? "Ocultar" : "Ver"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() =>
            Alert.alert(
              "Recuperar contraseña",
              "Función pendiente de conectar a backend."
            )
          }
        >
          <Text style={styles.olvidaste}>
            ¿Olvidaste tu contraseña?
          </Text>
        </Pressable>

        <TouchableOpacity
          style={styles.botonPrincipal}
          onPress={iniciarSesion}
        >
          <Text style={styles.textoBotonPrincipal}>
            Iniciar Sesión 🚀
          </Text>
        </TouchableOpacity>

        <Pressable
          onPress={() => router.push("/registro")}
        >
          <Text style={styles.registrate}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.registrateResaltado}>
              Regístrate gratis
            </Text>
          </Text>
        </Pressable>

        <TouchableOpacity
          style={styles.botonInvitado}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.textoInvitado}>
            Continuar como invitado
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#EAFBF1",
  },

  encabezado: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  atras: {
    color: "#EAFBF1",
    marginBottom: 16,
  },

  titulo: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subtitulo: {
    color: "#D7F2E3",
    fontSize: 13,
  },

  cuerpo: {
    padding: 24,
    gap: 12,
  },

  botonProveedor: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  textoProveedor: {
    fontWeight: "600",
    color: "#1F2937",
  },

  separador: {
    textAlign: "center",
    color: "#6B7280",
    marginVertical: 8,
    fontSize: 12,
  },

  etiqueta: {
    fontSize: 13,
    color: "#1F7A4D",
    fontWeight: "600",
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CDE9DA",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },

  inputPasswordContenedor: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CDE9DA",
    backgroundColor: "white",
    borderRadius: 10,
    paddingRight: 12,
    marginBottom: 4,
  },

  inputPassword: {
    flex: 1,
    padding: 12,
  },

  ver: {
    color: "#1F7A4D",
    fontWeight: "600",
    fontSize: 12,
  },

  olvidaste: {
    textAlign: "right",
    color: "#C2185B",
    fontSize: 12,
    marginBottom: 12,
  },

  botonPrincipal: {
    backgroundColor: "#1F7A4D",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  textoBotonPrincipal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  registrate: {
    textAlign: "center",
    marginTop: 8,
    color: "#374151",
  },

  registrateResaltado: {
    color: "#C2185B",
    fontWeight: "bold",
  },

  botonInvitado: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },

  textoInvitado: {
    color: "#374151",
    fontWeight: "600",
  },
});
