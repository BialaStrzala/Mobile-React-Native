import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

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
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Have an account? Log in" onPress={() => router.push("/(auth)/login")} />
    </View>
  );
}