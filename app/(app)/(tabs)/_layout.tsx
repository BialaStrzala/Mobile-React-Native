import { useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

function DrawerButton() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.openDrawer()}>
      <Text style={{ fontSize: 18, marginLeft: 10 }}>☰ </Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerLeft: () => <DrawerButton />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="mybooks" options={{ title: "My Books" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", href: null }} />
      <Tabs.Screen name="newbook" options={{ title: "New Book", href: null }} />
    </Tabs>
  );
}