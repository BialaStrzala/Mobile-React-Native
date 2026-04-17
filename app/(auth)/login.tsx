import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) console.log(error.message);
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Register" onPress={() => router.push("/(auth)/register")} />
    </View>
  );
}