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
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.string().optional(),
});
import { supabase, uploadImage } from "@/lib/supabase";
import { th } from "zod/v4/locales";

const dummyImageUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function validateAndContinue() {
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
    await handleRegister();
  }
  const handleImageUpload = async () => {
    if (image) {
      try {
        const image_url = await uploadImage(image, email);
        return image_url;
      } catch (error) {
        console.error("Image upload error:", error);
        return dummyImageUrl;
      }
    }
  };

  const handleRegister = async () => {
    try {
      const imageUrl = await handleImageUpload();
      const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (!user.user?.id)
        throw new Error("User ID not found after registration");
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.user.id,
        username: name,
        avatar_url: imageUrl,
        email: email,
      });
      if (profileError) throw profileError;
      else router.replace("/(tabs)/feed");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission is required to access photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center min-h-screen">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="items-center">
          {/* <AppAuthHeader /> */}
          <Text className="text-white text-4xl font-bold mt-6">
            Welcome to Framez!
          </Text>
          <Text className="text-white text-2xl font-bold mt-2">
            Create your account
          </Text>
          <Text className="text-slate-400 mt-2 text-center">
            Join Framez — add your name, avatar and sign up
          </Text>
        </View>

        <View className="flex flex-col gap-2 w-full justify-center items-center mt-6">
          <TouchableOpacity onPress={pickImage}>
            <Image
              src={image ? image : dummyImageUrl}
              className="w-24 h-24 rounded-full"
            />
          </TouchableOpacity>
          <Text className="text-slate-400 mt-2">
            Tap to select profile image
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
