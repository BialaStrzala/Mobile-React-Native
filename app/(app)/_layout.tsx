import CustomDrawerContent from "@/components/CustomDrawerContent";
import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="(tabs)" />
      </Drawer>
    </GestureHandlerRootView>
  );
}