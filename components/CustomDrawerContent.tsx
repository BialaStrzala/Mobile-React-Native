import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/(auth)")
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
        .eq("id", user.id)
        .single();

      setUsername(data?.username ?? "User");
    };

    loadUser();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {username ?? "Loading..."}
        </Text>
        <Button title="Log out" onPress={logout}/>
      </View>

      <DrawerItem
        label="Profile"
        onPress={() => router.push("/(tabs)/profile")}
      />
      <DrawerItem
        label="Settings"
        onPress={() => router.push("/(tabs)/settings")}
      />
    </DrawerContentScrollView>
  );
}