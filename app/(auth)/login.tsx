import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AppAuthHeader } from "@/components/AppAuthHeader";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import z from "zod";

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
    <SafeAreaView className="flex-1 bg-slate-900 px-6">
      <View className="flex-1 justify-center">
        <View className="items-center">
          <AppAuthHeader />
          <Text className="text-white text-2xl font-bold mt-6">
            Sign in to Framez
          </Text>
          <Text className="text-slate-400 mt-2">
            Welcome back — sign in to continue
          </Text>
        </View>

        <View className="mt-8">
          <Text className="text-slate-300 mb-2">Email</Text>
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
            className="bg-slate-800 rounded-xl px-4 py-3 text-white"
          />

          <Text className="text-slate-300 mt-4 mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Your password"
            placeholderTextColor="#94a3b8"
            className="bg-slate-800 rounded-xl px-4 py-3 text-white"
          />

          <TouchableOpacity
            onPress={signInWithEmail}
            activeOpacity={0.8}
            className="mt-6 bg-white rounded-full py-3 items-center"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text className="text-slate-900 font-bold">Sign in</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-slate-700" />
            <Text className="text-slate-500 px-4">OR</Text>
            <View className="flex-1 h-px bg-slate-700" />
          </View>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-slate-400">New to Framez? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold">Create an account</Text>
            </TouchableOpacity>
          </View>
          {errorMsg ? (
            <Text className="text-red-400 mt-3 text-center">{errorMsg}</Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
