import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#1DA1F2",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          height: 64,
          borderTopColor: "#94a3b8",
          paddingBottom: 12,
          backgroundColor: "#0f172a",
          borderTopWidth: 1,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: -4 },
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View
              className="items-center justify-start"
              style={{ flex: 1, paddingTop: 8 }}
            >
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
            <View
              className="items-center justify-start"
              style={{ flex: 1, paddingTop: 8 }}
            >
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
