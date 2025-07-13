import { Image, ScrollView, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  return (
    <ImageBackground 
      source={require("../assets/images/bg-image.jpg")} 
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 bg-black/30">
        <ScrollView contentContainerStyle={{flex: 1, justifyContent: "center"}}>
          <View className="flex-1 justify-center items-center px-6">
            {/* Logo and Brand */}
            <View className="items-center mb-8">
              <Image source={require("../assets/images/logo.png")} className="w-60 h-60 " />
              <Text className="text-white text-3xl font-bold mb-2 text-center" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4}}>NutriTrace</Text>
              <Text className="text-white text-lg italic text-center" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>Know your food, protect our planet</Text>
            </View>

            {/* Eco-friendly messaging */}
            <View className="bg-black/60 rounded-2xl p-4 mb-8 w-full max-w-sm border border-white/20">
              <Text className="text-white text-center text-sm leading-5 font-medium">
                🌱 Scan products to discover their environmental impact and make sustainable choices
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="w-full max-w-sm">
              <TouchableOpacity 
                onPress={() => router.push("/signin")} 
                className="bg-green-600 px-6 py-4 rounded-xl items-center shadow-lg mb-4"
                style={{ elevation: 3 }}
              >
                <Text className="text-white font-bold text-lg">Sign In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push("/signup")} 
                className="bg-green-500 px-6 py-4 rounded-xl items-center shadow-lg mb-4"
                style={{ elevation: 3 }}
              >
                <Text className="text-white font-bold text-lg">Sign Up</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push("/home")} 
                className="px-6 py-4 rounded-xl items-center"
              >
                <Text className="text-white text-center underline text-base" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>

            {/* Sustainability footer */}
            <View className="mt-8 items-center">
              <Text className="text-white text-xs text-center opacity-90" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>
                🌍 Making sustainable choices easier, one scan at a time
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
