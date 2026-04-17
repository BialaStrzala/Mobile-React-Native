import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      const session = data.session;
      const inAuth = segments[0] === "(auth)";
      const inApp = segments[0] === "(app)";

      if (!session && !inAuth) {
        router.replace("/(auth)/login");
      }

      if (session && !inApp) {
        router.replace("/(app)/(tabs)");
      }

      setReady(true);
    };

    init();
  }, []);

  if (!ready) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}