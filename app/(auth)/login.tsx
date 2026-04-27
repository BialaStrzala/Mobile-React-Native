import { globalStyles } from "@/lib/globalStyle";
import { supabase } from "@/lib/supabase";
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
    router.push("/(app)");
  };

  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.header}><Text style={globalStyles.headerText}>Login</Text></View>

      <View style={styles.centerWrapper}>
        <View style={globalStyles.card}>
          <Text style={globalStyles.titleText}>Welcome back!</Text>
          <View style={styles.loginForm}>
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
    flex: 1,
    marginTop: 50,
    alignItems: "center",
  },
  loginForm: {
    justifyContent: "center",
    padding: 15,
    gap: 15,
  },
})