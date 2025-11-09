import Avatar from "@/components/Avatar";
import { useAuth } from "@/components/context";
import Post from "@/components/Post";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ProfilePost extends Record<string, any> {
  id: string;
  caption?: string | null;
  image_url?: string | null;
  user_id?: string;
  authorName: string;
  authorAvatar: string | null;
  created_at: string;
}

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (!user) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(
            "id, caption, image_url, user_id, created_at, profiles(username, avatar_url)"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching profile posts:", error);
          setError(error.message ?? "Failed to load posts");
          setPosts([]);
        } else if (data) {
          const mapped = (data as any[]).map((row) => ({
            id: String(row.id),
            caption: row.caption ?? null,
            image_url: row.image_url ?? null,
            user_id: row.user_id ?? undefined,
            authorName: row.profiles?.username ?? profile?.username ?? "You",
            authorAvatar:
              row.profiles?.avatar_url ?? profile?.avatar_url ?? null,
            created_at: row.created_at,
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.error("Unexpected error fetching profile posts:", err);
        setError("Failed to load posts");
      } finally {
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
      }
    },
    [user, profile]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const renderItem: ListRenderItem<ProfilePost> = ({ item }) => (
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
            <Text className="text-2xl font-bold text-white">Profile</Text>
            <Text className="text-sm text-slate-400">
              Your details and recent posts
            </Text>
          </View>
        </View>
      </View>

      <View className="px-4 pt-4 pb-4 border-b-[0.5px] border-b-slate-500">
        <View className="flex-row items-center gap-4">
          <Avatar uri={profile?.avatar_url} size={80} />
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">
              {profile?.username ?? user?.email ?? "User"}
            </Text>
            {profile?.email ? (
              <Text className="text-sm text-slate-400">{profile.email}</Text>
            ) : user?.email ? (
              <Text className="text-sm text-slate-400">{user.email}</Text>
            ) : null}
            {profile?.created_at ? (
              <Text className="mt-1 text-xs text-slate-500">
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => signOut && signOut()}
            className="flex-row items-center gap-2 px-3 py-2 bg-red-600 rounded"
          >
            <Text className="text-white">Sign out</Text>
            <Feather name="log-out" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: 12 }}>
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
            ListEmptyComponent={() => (
              <View className="items-center justify-center py-8">
                <Text className="text-slate-400">No posts yet</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
