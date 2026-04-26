import { colors } from "@/lib/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

function DrawerButton() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.openDrawer()} style={styles.drawerButton}>
      <FontAwesome name="bars" size={20} color="#fff" />
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerLeft: () => <DrawerButton />,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
        tabBarStyle: { backgroundColor: colors.primary, borderTopWidth: 0 },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: colors.primaryLight,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="mybooks" 
        options={{ 
          title: "My Books",
          tabBarIcon: ({ color, size }) => <FontAwesome name="book" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }} 
      />
      <Tabs.Screen name="settings" options={{ title: "Settings", href: null }} />
      <Tabs.Screen name="newbook" options={{ title: "New Book", href: null }} />
      <Tabs.Screen name="editbook" options={{ title: "Edit Book", href: null }} />
      <Tabs.Screen name="bookdetails" options={{ title: "Book Details", href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
  },
  drawerButton: {
    marginLeft: 10,
  },
})