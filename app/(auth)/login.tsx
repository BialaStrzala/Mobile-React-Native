import { globalStyles } from "@/lib/globalStyle";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      return;
    }
    setErrorMessage("");
    router.push("/(app)");
  };

  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.header}><Text style={globalStyles.headerText}>Login</Text></View>
      <Text style={globalStyles.titleText}>Welcome back!</Text>
      <View style={styles.centerWrapper}>
        <View style={globalStyles.card}>
          
          <View style={styles.loginForm}>
            {errorMessage && (
              <View style={styles.messagesContainer}>
                {errorMessage && (
                  <Text style={{ color: colors.colorRed }}>{errorMessage}</Text>)}
              </View>
            )}

            <TextInput style={globalStyles.inputField} placeholder="Email" onChangeText={setEmail} />
            <TextInput style={globalStyles.inputField} placeholder="Password" secureTextEntry onChangeText={setPassword} />

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                globalStyles.mainButton,
                pressed && globalStyles.mainButtonPressed,
              ]}>
              <Text style={globalStyles.mainButtonText}>Login</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(auth)/register")}
              style={({ pressed }) => [
                globalStyles.secondaryButton,
                pressed && globalStyles.secondaryButtonPressed,
              ]}
            >
              <Text style={globalStyles.secondaryButtonText}>
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
  centerWrapper: {
    alignItems: "center",
  },
  loginForm: {
    justifyContent: "center",
    padding: 16,
    gap: 16,
  },
  messagesContainer:{
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  }
})