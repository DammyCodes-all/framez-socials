import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Feed() {
  return (
    <SafeAreaView>
      <View className="flex-1 min-h-screen bg-slate-900 justify-center items-center">
        <Text className="text-white text-4xl">Feed</Text>
        <TouchableOpacity
          className="p-3 bg-green-300 text-white rounded-md mt-4"
          onPress={async () => {
            await supabase.auth.signOut();
            router.push("/");
          }}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
