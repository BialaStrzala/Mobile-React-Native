import { globalStyles } from "@/lib/globalStyle";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
      return;
    }

    const user = data.user;
    console.log(user);
    if (user) {
      await supabase.from("users").insert({
        uid: user.id,
        role_id: 1,
        username: username,
        email: user.email,
      });
    }
    router.push("/(app)/(tabs)");
  };

  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.header}><Text style={globalStyles.headerText}>Register</Text></View>

      <View style={styles.centerWrapper}>
        <View style={globalStyles.card}>
          <Text style={globalStyles.titleText}>Welcome!</Text>
          <View style={styles.loginForm}>
            <TextInput style={globalStyles.inputField} placeholder="Username" onChangeText={setUsername} />
            <TextInput style={globalStyles.inputField} placeholder="Email" onChangeText={setEmail} />
            <TextInput style={globalStyles.inputField} placeholder="Password" secureTextEntry onChangeText={setPassword} />
            <Pressable
              onPress={handleRegister}
              style={({ pressed }) => [
                globalStyles.mainButton,
                pressed && globalStyles.mainButtonPressed,
              ]}>
              <Text style={globalStyles.mainButtonText}>Register</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(auth)/login")}
              style={({ pressed }) => [
                globalStyles.secondaryButton,
                pressed && globalStyles.secondaryButtonPressed,
              ]}
            >
              <Text style={globalStyles.secondaryButtonText}>
                Have an account? Log in
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