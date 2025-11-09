//   <Text className="text-slate-300 mt-4 mb-2">Profile image (URL)</Text>
//   <TextInput
//     value={image}
//     onChangeText={setImage}
//     placeholder="https://... or leave blank"
//     placeholderTextColor="#94a3b8"
//     className="bg-slate-800 rounded-xl px-4 py-3 text-white"
//   />
//   {image ? (
//     <View className="items-center mt-3">
//       {/* preview only — stored in state only as requested */}
//       <Image
//         source={{ uri: image }}
//         className="w-24 h-24 rounded-full"
//       />
//     </View>
//   ) : (
//     <View className="items-center mt-3">
//       <Text className="text-slate-500">No image selected</Text>
//     </View>
//   )}
