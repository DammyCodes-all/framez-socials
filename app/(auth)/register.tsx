import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase, uploadImage } from "@/lib/supabase";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const dummyImageUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s";

export type ImageType = {
  uri: string;
  type: string;
};

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<ImageType>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function validateAndContinue() {
    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path?.[0]?.toString() ?? "";
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    console.log("All inputs are valid. Proceeding with registration...");
    setErrors({});
    await handleRegister();
  }
  const handleImageUpload = async () => {
    if (image) {
      try {
        const image_url = await uploadImage(email, image);
        return image_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        if (error && typeof error === "object" && "message" in error) {
          console.error("Image upload error:", error.message);
          return dummyImageUrl;
        }
      }
    } else {
      return dummyImageUrl;
    }
  };

  const handleRegister = async () => {
    try {
      const imageUrl = await handleImageUpload();
      console.log("Registering user with image URL:", imageUrl);
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
      setImage({
        uri: result.assets[0].uri,
        type: result.assets[0].type ?? "jpeg",
      });
    }
  };

  return (
    <SafeAreaView className="justify-center flex-1 min-h-screen bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="items-center">
          {/* <AppAuthHeader /> */}
          <Text className="mt-6 text-4xl font-bold text-white">
            Welcome to Framez!
          </Text>
          <Text className="mt-2 text-2xl font-bold text-white">
            Create your account
          </Text>
          <Text className="mt-2 text-center text-slate-400">
            Join Framez — add your name, avatar and sign up
          </Text>
        </View>

        <View className="flex flex-col items-center justify-center w-full gap-2 mt-6">
          <TouchableOpacity onPress={pickImage}>
            <Image
              src={image ? image.uri : dummyImageUrl}
              className="w-24 h-24 rounded-full"
            />
          </TouchableOpacity>
          <Text className="mt-2 text-slate-400">
            Tap to select profile image
          </Text>
        </View>

        <View className="mt-8">
          <Text className="mb-2 text-slate-300">Display name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#94a3b8"
            className="px-4 py-3 text-white bg-slate-800 rounded-xl"
          />
          {errors.name ? (
            <Text className="mt-2 text-red-400">{errors.name}</Text>
          ) : null}

          <Text className="mt-4 mb-2 text-slate-300">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
            className="px-4 py-3 text-white bg-slate-800 rounded-xl"
          />
          {errors.email ? (
            <Text className="mt-2 text-red-400">{errors.email}</Text>
          ) : null}

          <Text className="mt-4 mb-2 text-slate-300">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Choose a password"
            placeholderTextColor="#94a3b8"
            className="px-4 py-3 text-white bg-slate-800 rounded-xl"
          />
          {errors.password ? (
            <Text className="mt-2 text-red-400">{errors.password}</Text>
          ) : null}

          <TouchableOpacity
            onPress={async () => await validateAndContinue()}
            activeOpacity={0.8}
            className="items-center py-3 mt-6 bg-white rounded-full"
          >
            <Text className="font-bold text-slate-900">Create account</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
              <Text className="font-bold text-white">Back to sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
