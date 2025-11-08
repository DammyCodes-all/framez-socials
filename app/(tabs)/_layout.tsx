import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // hide built-in labels; we'll render label under the icon so we can style with nativewind
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#1DA1F2", // X/Twitter accent color
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          height: 72,
          borderRadius: 999,
          backgroundColor: "#0f172a", // dark slate feel
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.04)",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="feed" // Home button maps to feed
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center" style={{ width: 64 }}>
              <Feather name="home" size={size ?? 20} color={color} />
              <Text className="text-[12px] mt-1" style={{ color }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center" style={{ width: 64 }}>
              <Feather name="user" size={size ?? 20} color={color} />
              <Text className="text-[12px] mt-1" style={{ color }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
