import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

function CreateTabButton({
  onPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps) {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        position: "absolute",
        top: -28,
        alignSelf: "center",
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#1DA1F2",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.45,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 14,
        elevation: 14,
        borderWidth: focused ? 2 : 0,
        borderColor: focused ? "rgba(255,255,255,0.6)" : "transparent",
      }}
    >
      <Feather name="plus" size={28} color="#fff" />
    </TouchableOpacity>
  );
}

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
          borderTopColor: "#64748b",
          paddingBottom: 12,
          backgroundColor: "#000000",
          borderTopWidth: 0.5,
          shadowColor: "#000",
          shadowOpacity: 0.18,
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
        name="create"
        options={{
          title: "Create",
          tabBarShowLabel: false,
          tabBarButton: (props) => <CreateTabButton {...props} />,
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
