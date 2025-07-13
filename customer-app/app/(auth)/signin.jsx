import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView className="bg-green-900 flex-1">
      <View className="flex-1 justify-center items-center px-4">
        <Image source={require("../../assets/images/logo.png")} className="w-60 h-60 mt-2 mb-2" />
        <Text className="text-white text-xl font-bold mb-4 text-center" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>NutriTrace</Text>
        <View
          className="rounded-2xl shadow p-6 w-full max-w-md"
          style={{ backgroundColor: '#f0fdf4' }}
        >
          <Text className="text-green-900 text-2xl font-bold mb-2 text-center">Sign In</Text>
          <Text className="text-gray-500 mb-6 text-center">Welcome back! Please sign in to continue.</Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
            placeholder="Email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View className="relative">
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base pr-12"
              placeholder="Password"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text className="text-gray-500 text-lg">
                {showPassword ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-yellow-500 rounded-lg py-3 items-center mb-2"
            onPress={handleSignIn}
          >
            <Text className="text-white font-bold text-base">Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/signup")}
            className="mt-2">
            <Text className="text-green-900 text-center">Don't have an account? <Text className="underline">Sign Up</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 