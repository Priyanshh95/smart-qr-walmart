import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-green-900 flex-1">
      <ScrollView contentContainerStyle={{flex: 1, justifyContent: "center"}}>
        <View className="flex-1 justify-center items-center px-4">
          <Image source={require("../assets/images/logo.png")} className="w-60 h-60 mb-4" />
          <View className="w-3/4">
            <Text className="text-white text-2xl font-bold mb-1 text-center">Welcome to NutriTrace</Text>
            <Text className="text-white italic mb-8 text-center">know your food better</Text>
            <TouchableOpacity 
              onPress={() => router.push("/signin")} 
              className="bg-yellow-500 px-6 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-bold text-base">Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push("/signup")} 
              className="bg-yellow-500 px-6 py-4 rounded-lg items-center mt-4"
            >
              <Text className="text-white font-bold text-base">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push("/home")} 
              className=" px-6 py-4 rounded-lg items-center mt-4"
            >
              <Text className="text-white text-center underline">Sign in as Guest ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
