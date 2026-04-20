import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const Settings = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number>(0);
  const [email, setEmail] = useState<string>('null');
  const [password, setPassword] = useState<string>('');
  const [passwordRetype, setPasswordRetype] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const changeUsername = async () => {
    const { data, error } = await supabase.from("users").update({
      username: username,
    }).eq("id", userId);
    router.push("/(app)/(tabs)/profile"); //?
  };

  //In order to use the updateUser() method, the user needs to be signed in first.
  const changePassword = async () => {
    if(!(password == passwordRetype)){
      return;
    }
    const { error } = await supabase.auth.updateUser({password: password})
  }

  const changeEmail = async () => {
    const { error } = await supabase.auth.updateUser({email: email})
  }

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user }, } = await supabase.auth.getUser();

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
      <Text>Settings</Text>
      <View>
        <Text>Edit profile</Text>
        <View>
          <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
          <Button title="Change username" onPress={changeUsername} />
          
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
          <Button title="Change email" onPress={changeEmail} />

          <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
          <TextInput placeholder="Confirm password" secureTextEntry onChangeText={setPasswordRetype} />
          <Button title="Change password" onPress={changePassword} />
        </View>
      </View>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({})