import { FontAwesome } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";
import { colors } from "../lib/theme";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/(auth)/login")
  }

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("username")
        .eq("uid", user.id)
        .single();

      setUsername(data?.username ?? "No username");
    };

    loadUser();
  }, []);

  // Get first letter for avatar
  const getInitial = () => {
    if (!username) return "?";
    return username.charAt(0).toUpperCase();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial()}</Text>
        </View>
        <Text style={styles.username}>{username ?? "Loading..."}</Text>
      </View>

      <DrawerItem
        label="Home"
        onPress={() => router.push("/(tabs)/")}
        labelStyle={styles.label}
        icon={({ color, size }) => <FontAwesome name="home" size={size} color={color} />}
      />
      <DrawerItem
        label="My Books"
        onPress={() => router.push("/(tabs)/mybooks")}
        labelStyle={styles.label}
        icon={({ color, size }) => <FontAwesome name="book" size={size} color={color} />}
      />
      <DrawerItem
        label="Profile"
        onPress={() => router.push("/(tabs)/profile")}
        labelStyle={styles.label}
        icon={({ color, size }) => <FontAwesome name="user" size={size} color={color} />}
      />
      <DrawerItem
        label="Settings"
        onPress={() => router.push("/(tabs)/settings")}
        labelStyle={styles.label}
        icon={({ color, size }) => <FontAwesome name="cog" size={size} color={color} />}
      />
      
      <View style={styles.logoutContainer}>
        <Button title="Log out" onPress={logout} color={colors.primary}/>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  label: {
    fontSize: 14,
  },
  logoutContainer: {
    padding: 16,
    marginTop: "auto",
  },
});