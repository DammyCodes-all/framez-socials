import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { AppState, Platform } from "react-native";
import "react-native-url-polyfill/auto";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import type { ImageType } from "@/app/(auth)/register";

// prefer values provided via Expo's app config extra (app.config.js / app.json)
const expoExtra =
  (Constants.expoConfig && (Constants.expoConfig.extra as any)) || {};
const supabaseUrl = expoExtra.SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = expoExtra.SUPABASE_KEY ?? process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_KEY are required. Add them to app.config.js (extra) or supply them to the environment."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

export async function uploadImage(userId: string, image: ImageType) {
  try {
    const base64 = await FileSystem.readAsStringAsync(image.uri, {
      encoding: "base64",
    });
    const filePath = `${userId}/${new Date().getTime()}`;
    const contentType = image.type ? image.type : "image/jpeg";
    const { error } = await supabase.storage
      .from("posts")
      .upload(filePath, decode(base64), {
        cacheControl: "3600",
        upsert: false,
        contentType: contentType,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("posts")
      .getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;
    return publicUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    return null;
  }
}
