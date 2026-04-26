import { supabase } from "@/lib/supabase";
import { colors, sizes } from "@/lib/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Login attempt:", email, password);
    if (error) {
      console.log(error.message);
      return;
    }
    // Redirect to app after successful login
    router.push("/(app)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerText}>Login</Text></View>

      <View style={styles.centerWrapper}>
        <View style={styles.card}>
          <Text style={styles.titleText}>Welcome back!</Text>
          <View style={styles.loginForm}>
            <TextInput style={styles.inputField} placeholder="Email" onChangeText={setEmail} />
            <TextInput style={styles.inputField} placeholder="Password" secureTextEntry onChangeText={setPassword} />
            <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/(auth)/register")}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
              >
                <Text style={styles.secondaryButtonText}>
                  Don't have an account? Register
                </Text>
              </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    width: "100%",
    height: "100%",
  },
  centerWrapper: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.cardColor,
    margin: 20,
    borderRadius: 15,
    width: "80%",
    alignContent: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    height: 80,
    alignItems: "center",
    fontWeight: "bold",
    marginBottom: 16,
    backgroundColor: colors.primary,
  },
  headerText: {
    marginTop: 35,
    fontSize: sizes.headerText,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#fff",
  },
  loginForm:{
    justifyContent: "center",
    padding: 15,
    gap: 15,
  },
  inputField: {
    borderWidth: 2,
    borderColor: "#ebe8dd",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonPressed: {
    backgroundColor: colors.backgroundColor,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "500",
  },
  titleText: {
    marginTop: 15,
    alignSelf: "center",
    fontSize: sizes.titleText,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
    color: colors.primary,
  }
})