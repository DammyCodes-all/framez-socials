import { View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function Index() {
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.log("Error fetching user:", error);
      if (!data.session) router.push("/(auth)/login");
      else router.push("/(tabs)/feed");
    })();
  }, []);
  useFocusEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.log("Error fetching user:", error);
      if (!data.session) router.push("/(auth)/login");
      else router.push("/(tabs)/feed");
    })();
  });

  return (
    <View className="flex-col items-center justify-center min-h-screen bg-black"></View>
  );
}
