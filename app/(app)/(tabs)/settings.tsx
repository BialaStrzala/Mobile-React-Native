import { globalStyles } from "@/lib/globalStyle";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";

interface UserAuthData {
    id: any,
    username: any,
    email: any,
    created_at?: any
}

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserAuthData | null>(null);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordRetype, setPasswordRetype] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');

  const changeUsername = async () => {
    try{
      const { data, error } = await supabase.from("users").update({username: newUsername,}).eq("id", userData?.id);
      Alert.alert('Success', 'Username updated successfully', [
        { text: 'OK', onPress: () => router.push('/(app)/(tabs)/settings') }
      ]);
    }
    catch(err: any){
      Alert.alert('Error', err.message);
    }
  };

  //In order to use the updateUser() method, the user needs to be signed in first.
  const changePassword = async () => {
    if (!(newPassword == passwordRetype)) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try{
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      Alert.alert('Success', 'Password updated successfully', [
        { text: 'OK', onPress: () => router.push('/(app)/(tabs)/settings') }
      ]);
    }
    catch(err: any){
      Alert.alert('Error', err.message);
    } 
  };

  const changeEmail = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // is new
    if (newEmail === userData?.email) {
      Alert.alert('Error', 'New email must be different from current email');
      return;
    }

    try{
      const { data, error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        console.log("Auth error details:", error);
        Alert.alert("Error", `Failed to update email: ${error.message}`);
        return;
      }

      // Update the users table
      const { error: dbError } = await supabase
        .from("users")
        .update({email: newEmail})
        .eq("id", userData?.id);

      if (dbError) {
        console.log("Database error:", dbError);
        Alert.alert("Warning", "Email updated in auth but failed to update in database.");
        return;
      }

      Alert.alert('Success', 'Email updated successfully. Please check your new email for confirmation.', [
        { text: 'OK', onPress: () => {
          setNewEmail('');
          router.push('/(app)/(tabs)/settings');
        }}
      ]);
    } catch(err: any){
      console.log("Unexpected error:", err);
      Alert.alert('Error', `An unexpected error occurred: ${err.message}`);
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        //user data
        const { data: { user }, } = await supabase.auth.getUser();
        if (!user) return;
        const { data: userProfile } = await supabase
            .from("users")
            .select("id, username, email, created_at")
            .eq("uid", user.id)
            .single();
        setUserData(userProfile);
      } catch (err) {
          console.error("Error loading profile:", err);
      } finally {
          setLoading(false);
      }
  };
  loadProfileData();
  }, []);

  return (
    <ScrollView style={globalStyles.mainContainer} contentContainerStyle={globalStyles.scrollViewContent}>
      <Text style={globalStyles.titleText}>Settings</Text>
      <View style={globalStyles.card}>
        <View>
          <View>
            <Text style={styles.cardTitle}>Username</Text>
            <View style={styles.group}>
              <TextInput placeholder={userData?.username || "Username"} value={newUsername} onChangeText={setNewUsername} style={globalStyles.inputField} placeholderTextColor={colors.textLightMuted}/>
              <Pressable onPress={changeUsername}
                style={({ pressed }) => [
                  globalStyles.tertiaryButton, pressed && globalStyles.tertiaryButtonPressed,]}>
                <Text style={globalStyles.mainButtonText}>Change username</Text>
              </Pressable>
            </View>

            <Text style={styles.cardTitle}>Email</Text>
            <View style={styles.group}>
              <TextInput placeholder={userData?.email || "Email"} value={newEmail} onChangeText={setNewEmail} style={globalStyles.inputField} placeholderTextColor={colors.textLightMuted} />
              <Pressable onPress={changeEmail}
                style={({ pressed }) => [
                  globalStyles.tertiaryButton, pressed && globalStyles.tertiaryButtonPressed,]}>
                <Text style={globalStyles.mainButtonText}>Change email</Text>
              </Pressable>
            </View>

            <Text style={styles.cardTitle}>Password</Text>
            <View style={styles.group}>
              <TextInput placeholder="New Password" secureTextEntry onChangeText={setNewPassword} style={globalStyles.inputField} placeholderTextColor={colors.textLightMuted} />
              <TextInput placeholder="Confirm new password" secureTextEntry onChangeText={setPasswordRetype} style={globalStyles.inputField} placeholderTextColor={colors.textLightMuted} />
              <Pressable onPress={changePassword}
                style={({ pressed }) => [
                  globalStyles.tertiaryButton, pressed && globalStyles.tertiaryButtonPressed,]}>
                <Text style={globalStyles.mainButtonText}>Change password</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Settings

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 12,
  },
  group: {
    gap: 12,
    marginBottom: 16,
  }
})