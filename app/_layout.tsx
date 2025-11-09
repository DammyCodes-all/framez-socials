import "@/global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "@/components/context";
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
