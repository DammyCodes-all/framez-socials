import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import Avatar from "./Avatar";

dayjs.extend(relativeTime);

export type PostProps = {
  id?: string | number;
  authorName: string;
  authorAvatar?: string | null;
  caption?: string | null;
  image_url?: string | null;
  created_at: string | number | Date;
};

// Using dayjs with the relativeTime plugin for readable timestamps

export default function Post({
  authorName,
  authorAvatar,
  caption,
  image_url,
  created_at,
}: PostProps) {
  const time = dayjs(created_at).fromNow();
  const [contentWidth, setContentWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!image_url || !contentWidth) return;
    Image.getSize(
      image_url,
      (w, h) => {
        if (!mounted) return;
        const computed = Math.round((contentWidth * h) / w);
        setImageHeight(computed);
      },
      () => {
        if (!mounted) return;
        setImageHeight(Math.round((contentWidth * 9) / 16));
      }
    );
    return () => {
      mounted = false;
    };
  }, [image_url, contentWidth]);

  return (
    <View className="w-full px-4 py-3 pb-4 border-b bg-slate-900 border-slate-800">
      <View className="flex-row items-start gap-3">
        <Avatar uri={authorAvatar ?? undefined} />
        <View
          className="flex-1"
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            setContentWidth(w);
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-white">{authorName}</Text>
            <Text className="text-sm text-slate-400">{time}</Text>
          </View>
          {caption ? (
            <Text className="mt-2 text-base text-slate-200">{caption}</Text>
          ) : null}

          {image_url && imageHeight ? (
            <View
              className="mt-3"
              style={{ overflow: "hidden", borderRadius: 12 }}
            >
              <Image
                source={{ uri: image_url }}
                style={{ width: contentWidth, height: imageHeight }}
                resizeMode="cover"
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
