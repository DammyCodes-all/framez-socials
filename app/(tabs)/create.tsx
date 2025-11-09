import Avatar from "@/components/Avatar";
import { useAuth } from "@/components/context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageType } from "../(auth)/register";
import * as ImagePicker from "expo-image-picker";
import { supabase, uploadImage } from "@/lib/supabase";

export type PostType = {
  image_url: string | null;
  caption?: string;
  user_id?: string;
};
const Create = () => {
  const { profile, user } = useAuth();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<ImageType | undefined>(undefined);
  const [contentWidth, setContentWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [inputHeight, setInputHeight] = useState<number>(0);

  useEffect(() => {
    if (!image?.uri || !contentWidth) return;
    let mounted = true;
    // clear previous measurement while we compute the new one
    setImageHeight(null);
    Image.getSize(
      image.uri,
      (w, h) => {
        if (!mounted) return;
        const height = Math.round((h / w) * contentWidth);
        const maxHeight = 800; // cap to avoid extremely tall images
        setImageHeight(Math.min(height, maxHeight));
      },
      () => {
        if (!mounted) return;
        // fallback to 16:9
        setImageHeight(Math.round((9 / 16) * contentWidth));
      }
    );
    return () => {
      mounted = false;
    };
  }, [image?.uri, contentWidth]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const MAX_CHARS = 280;

  const handlePostSubmit = async () => {
    if (!user || !user.id) return;
    setSubmitting(true);
    setSubmitError(null);
    const postData: PostType = {
      image_url: null,
      caption: caption,
      user_id: user.id,
    };
    try {
      if (image) {
        const imageUrl = await uploadImage(user.id, image);
        if (!imageUrl) throw new Error("Image upload failed");
        postData.image_url = imageUrl;
      }

      const { error } = await supabase.from("posts").insert(postData);
      if (error) throw error;
      // reset and navigate
      setCaption("");
      setImage(undefined);
      router.push("/(tabs)/feed");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create post";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
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
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage({
        uri: result.assets[0].uri,
        type: result.assets[0].type ?? "jpeg",
      });
      // reset computed sizes while the new image is processed
      setImageHeight(null);
      setContentWidth(null);
    }
  };
  return (
    <SafeAreaView>
      <View className="flex-col w-full min-h-screen gap-2 px-4 bg-slate-900">
        <View className="flex-row items-center justify-between mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" color={"white"} size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePostSubmit}
            disabled={caption.trim().length === 0 || submitting}
            style={{
              backgroundColor:
                caption.trim().length === 0 ? "#94a3b8" : "#1DA1F2",
              opacity: caption.trim().length === 0 || submitting ? 0.6 : 1,
            }}
            className="flex items-center justify-center px-4 py-1 rounded-full h-fit w-fit"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-2xl text-center text-white">Post</Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-start w-full gap-3 mt-5">
          <Avatar uri={profile?.avatar_url} />
          <View style={{ flex: 1 }}>
            <TextInput
              value={caption}
              onChangeText={(text) => setCaption(text.slice(0, MAX_CHARS))}
              placeholder={"What's on your mind?"}
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={15}
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              style={{
                minHeight: 48,
                height: Math.max(48, inputHeight),
                textAlignVertical: "top",
                paddingVertical: 8,
                paddingHorizontal: 12,
                color: "#fff",
                backgroundColor: "#0f172a",
                borderRadius: 12,
              }}
              className="text-xl"
            />
          </View>
        </View>
        <View className="flex-row items-center justify-between w-full gap-2 pl-16 mt-5">
          <TouchableOpacity onPress={pickImage}>
            <Feather name="image" size={20} color={"#94a3b8"} />
          </TouchableOpacity>
          <Text className="flex items-center justify-center text-slate-400">
            {caption.length} / {MAX_CHARS}
          </Text>
        </View>
        {submitError ? (
          <Text className="mt-2 text-center text-red-400">{submitError}</Text>
        ) : null}
        {image && (
          <View
            className="relative w-full"
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              // avoid unnecessary updates
              if (w && w !== contentWidth) setContentWidth(w);
            }}
          >
            {(!contentWidth || imageHeight === null) && (
              <View
                className="w-full overflow-hidden rounded-lg"
                style={{
                  height: 200,
                  backgroundColor: "#0b1220",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator color="#94a3b8" />
              </View>
            )}

            {contentWidth && (
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: contentWidth,
                  height: imageHeight ?? Math.round((9 / 16) * contentWidth),
                  borderRadius: 12,
                }}
                resizeMode="cover"
                onError={() => {
                  if (contentWidth)
                    setImageHeight(Math.round((9 / 16) * contentWidth));
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => {
                setImage(undefined);
                setImageHeight(null);
                setContentWidth(null);
              }}
              className="absolute p-2 rounded-full top-2 right-2 bg-black/50"
              accessibilityLabel="Remove image"
            >
              <Feather name="x" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Create;
