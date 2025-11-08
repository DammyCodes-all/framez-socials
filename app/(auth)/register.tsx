import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { AppAuthHeader } from "@/components/AppAuthHeader";
import { z } from "zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.string().optional(),
});

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateAndContinue() {
    const result = registerSchema.safeParse({ name, email, password, image });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path?.[0]?.toString() ?? "";
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    // For now we only validate and keep image in state as requested.
    Alert.alert(
      "Validated",
      "Registration data is valid. Implement submission logic later."
    );
    // You can later call supabase.auth.signUp or your API here.
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="items-center">
          <AppAuthHeader />

          <Text className="text-white text-2xl font-bold mt-6">
            Create your account
          </Text>
          <Text className="text-slate-400 mt-2 text-center">
            Join Framez — add your name, avatar and sign up
          </Text>
        </View>

        <View className="mt-8">
          <Text className="text-slate-300 mb-2">Display name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#94a3b8"
            className="bg-slate-800 rounded-xl px-4 py-3 text-white"
          />
          {errors.name ? (
            <Text className="text-red-400 mt-2">{errors.name}</Text>
          ) : null}

          <Text className="text-slate-300 mt-4 mb-2">Profile image (URL)</Text>
          <TextInput
            value={image}
            onChangeText={setImage}
            placeholder="https://... or leave blank"
            placeholderTextColor="#94a3b8"
            className="bg-slate-800 rounded-xl px-4 py-3 text-white"
          />
          {image ? (
            <View className="items-center mt-3">
              {/* preview only — stored in state only as requested */}
              <Image
                source={{ uri: image }}
                className="w-24 h-24 rounded-full"
              />
            </View>
          ) : (
            <View className="items-center mt-3">
              <Text className="text-slate-500">No image selected</Text>
            </View>
          )}

          <Text className="text-slate-300 mt-4 mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
            className="bg-slate-800 rounded-xl px-4 py-3 text-white"
          />
          {errors.email ? (
            <Text className="text-red-400 mt-2">{errors.email}</Text>
          ) : null}

          <Text className="text-slate-300 mt-4 mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Choose a password"
            placeholderTextColor="#94a3b8"
            className="bg-slate-800 rounded-xl px-4 py-3 text-white"
          />
          {errors.password ? (
            <Text className="text-red-400 mt-2">{errors.password}</Text>
          ) : null}

          <TouchableOpacity
            onPress={validateAndContinue}
            activeOpacity={0.8}
            className="mt-6 bg-white rounded-full py-3 items-center"
          >
            <Text className="text-slate-900 font-bold">Create account</Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-slate-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
              <Text className="text-white font-bold">Back to sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
