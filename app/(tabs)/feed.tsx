import Post from "@/components/Post";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostType } from "./create";
import { useAuth } from "@/components/context";
import Avatar from "@/components/Avatar";
import { router } from "expo-router";

export interface FeedProps extends PostType {
  id: string;
  authorName: string;
  authorAvatar: string | null;
  created_at: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<FeedProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchPosts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, caption, image_url, user_id, created_at, profiles(username, avatar_url)"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        setError(error.message ?? "Failed to load posts");
        setPosts([]);
      } else if (data) {
        const mapped = data.map((row: any) => ({
          id: String(row.id),
          caption: row.caption ?? null,
          image_url: row.image_url ?? null,
          user_id: row.user_id ?? undefined,
          authorName: row.profiles?.username ?? "Unknown",
          authorAvatar: row.profiles?.avatar_url ?? null,
          created_at: row.created_at,
        }));
        setPosts(mapped);
      }
    } catch (err) {
      console.error("Unexpected error fetching posts:", err);
      setError("Failed to load posts");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const renderItem: ListRenderItem<FeedProps> = ({ item }) => (
    <Post
      authorName={item.authorName}
      authorAvatar={item.authorAvatar}
      caption={item.caption ?? undefined}
      image_url={item.image_url ?? undefined}
      created_at={item.created_at}
    />
  );

  return (
    <SafeAreaView className="flex-1 text-white bg-black">
      <View className="px-4 pt-4 pb-4 bg-black border-b-[0.5px] border-b-slate-700">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-white">Framez</Text>
            <Text className="text-sm text-slate-400">Share your moments</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="flex items-center justify-center"
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View className="rounded-full border-2 border-blue-500 p-0.5">
                <Avatar uri={profile?.avatar_url} size={40} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {loading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-red-400">{error || "Unknown error"}</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={() => fetchPosts(true)}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
