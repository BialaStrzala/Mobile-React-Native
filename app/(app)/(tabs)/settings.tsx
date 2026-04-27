import { globalStyles } from "@/lib/globalStyle";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";

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
    if (!(password == passwordRetype)) {
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: password })
  }

  const changeEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email: email })
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
    <ScrollView style={globalStyles.mainContainer} contentContainerStyle={globalStyles.scrollViewContent}>
      <View style={globalStyles.card}>
        <Text style={globalStyles.titleText}>Settings</Text>
        <View>
          <Text style={globalStyles.titleText}>Edit profile</Text>
          <View>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={globalStyles.inputField} />
            <Pressable onPress={changeUsername}
              style={({ pressed }) => [
                globalStyles.mainButton, pressed && globalStyles.mainButtonPressed,]}>
              <Text style={globalStyles.mainButtonText}>Change username</Text>
            </Pressable>

            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={globalStyles.inputField} />
            <Pressable onPress={changeEmail}
              style={({ pressed }) => [
                globalStyles.mainButton, pressed && globalStyles.mainButtonPressed,]}>
              <Text style={globalStyles.mainButtonText}>Change email</Text>
            </Pressable>

            <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={globalStyles.inputField} />
            <TextInput placeholder="Confirm password" secureTextEntry onChangeText={setPasswordRetype} style={globalStyles.inputField} />
            <Pressable onPress={changePassword}
              style={({ pressed }) => [
                globalStyles.mainButton, pressed && globalStyles.mainButtonPressed,]}>
              <Text style={globalStyles.mainButtonText}>Change password</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({})