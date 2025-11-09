import { Image, ImageStyle, View } from "react-native";

export default function Avatar({
  uri = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s",
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
