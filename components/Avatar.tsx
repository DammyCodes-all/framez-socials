import { Image, ImageStyle, View } from "react-native";

export default function Avatar({
  uri,
  size = 56,
}: {
  uri?: string;
  size?: number;
}) {
  const style: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };
  return (
    <View>
      <Image source={{ uri }} style={style} />
    </View>
  );
}
