import "@/global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "@/components/context";
import { StatusBar } from "react-native";
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
