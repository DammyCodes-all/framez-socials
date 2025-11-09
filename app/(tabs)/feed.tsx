import Post from "@/components/Post";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostType } from "./create";

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

  if (loading) {
    return (
      <SafeAreaView>
        <View className="items-center justify-center flex-1 min-h-screen bg-slate-900">
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <View className="items-center justify-center flex-1 min-h-screen bg-slate-900">
          <Text className="text-red-400">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
    <SafeAreaView className="flex-1 bg-slate-900">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={() => fetchPosts(true)}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
