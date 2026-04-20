import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';

const Settings = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  //psw, auth.email
  const changeSettings = async () => {
    const { data, error } = await supabase.from("users").update({
      username: username,
      email: email
    }).eq("id", userId);
    router.push("/(app)/(tabs)/profile");
  };

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("id, username, email")
        .eq("id", user.id)
        .single();

      setUsername(data?.username ?? "User");
      setUserId(data?.id ?? 0);
    };
    loadUserData();
  }, []);

  return (
    <View>
      <Text>settings</Text>
      <View>
        <Text>Edytuj profil</Text>
        <View>
          <TextInput placeholder="Username" onChangeText={setUsername} />
          <TextInput placeholder="Email" onChangeText={setEmail} />
          <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
          <Button title="Change Settings" onPress={changeSettings} />
        </View>
      </View>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({})