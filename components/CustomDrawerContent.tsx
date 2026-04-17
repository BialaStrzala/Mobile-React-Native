import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 16 }}>
        <Text>Username123</Text>
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