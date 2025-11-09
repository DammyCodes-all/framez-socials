import { AppAuthHeader } from "@/components/AppAuthHeader";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  async function signInWithEmail() {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const firstError = result.error.issues[0];
      setErrorMsg(firstError.message);
      return;
    }
    try {
      setErrorMsg(null);
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }
      router.replace("/(tabs)/feed");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 px-6 bg-black">
      <View className="justify-center flex-1">
        <View className="items-center">
          <AppAuthHeader />
          <Text className="mt-6 text-2xl font-bold text-white">
            Sign in to Framez
          </Text>
          <Text className="mt-2 text-slate-400">
            Welcome back — sign in to continue
          </Text>
        </View>

        <View className="mt-8">
          <Text className="mb-2 text-slate-300">Email</Text>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setErrorMsg(null);
              setEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
            className="px-4 py-3 text-white border-white border-[0.8px] rounded-xl "
          />

          <Text className="mt-4 mb-2 text-slate-300">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Your password"
            placeholderTextColor="#94a3b8"
            className="px-4 py-3 text-white border-white border-[0.8px] rounded-xl"
          />

          <TouchableOpacity
            onPress={signInWithEmail}
            activeOpacity={0.8}
            className="items-center py-3 mt-6 bg-white rounded-full"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text className="font-bold text-slate-900">Sign in</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-slate-700" />
            <Text className="px-4 text-slate-500">OR</Text>
            <View className="flex-1 h-px bg-slate-700" />
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-400">New to Framez? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              activeOpacity={0.8}
            >
              <Text className="font-bold text-white">Create an account</Text>
            </TouchableOpacity>
          </View>
          {errorMsg ? (
            <Text className="mt-3 text-center text-red-400">{errorMsg}</Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
