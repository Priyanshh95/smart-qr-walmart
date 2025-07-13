import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Load saved credentials when component mounts
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  // Load saved credentials from AsyncStorage
  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    } catch (error) {
      console.log('Error loading saved credentials:', error);
    }
  };

  // Save credentials to AsyncStorage
  const saveCredentials = async (email, password) => {
    try {
      await AsyncStorage.setItem('savedEmail', email);
      await AsyncStorage.setItem('savedPassword', password);
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Save credentials after successful login
      await saveCredentials(email, password);
      router.replace("/(tabs)/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ImageBackground 
      source={require("../../assets/images/bg-image.jpg")} 
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 bg-black/30">
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1,
              justifyContent: 'center',
              paddingVertical: 20
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center items-center px-6">
              {/* Logo and Brand */}
              <View className="items-center mb-6">
                <Image source={require("../../assets/images/logo.png")} className="w-40 h-40 mb-4" />
                <Text className="text-white text-2xl font-bold mb-2 text-center" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4}}>NutriTrace</Text>
                <Text className="text-white text-sm text-center" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>Your sustainable shopping companion</Text>
              </View>

              {/* Sign In Form */}
              <View className="w-full max-w-sm">
                <View className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Text className="text-white text-xl font-bold mb-2 text-center">Welcome Back</Text>
                  <Text className="text-white text-sm mb-6 text-center opacity-90">Sign in to continue your sustainable journey</Text>
                  
                  <TextInput
                    className="bg-white rounded-xl px-4 py-3 mb-4 text-base"
                    placeholder="Email"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                  
                  <View className="relative mb-6">
                    <TextInput
                      className="bg-white rounded-xl px-4 py-3 text-base pr-12"
                      placeholder="Password"
                      placeholderTextColor="#6b7280"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      returnKeyType="done"
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
                    className="bg-green-600 rounded-xl py-3 items-center mb-4 shadow-lg"
                    style={{ elevation: 3 }}
                    onPress={handleSignIn}
                  >
                    <Text className="text-white font-bold text-lg">Sign In</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => router.push("/signup")} className="mb-4">
                    <Text className="text-white text-center text-sm">
                      Don't have an account? <Text className="underline font-semibold">Sign Up</Text>
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={async () => {
                      try {
                        await AsyncStorage.removeItem('savedEmail');
                        await AsyncStorage.removeItem('savedPassword');
                        setEmail('');
                        setPassword('');
                        alert('Saved credentials cleared!');
                      } catch (error) {
                        console.log('Error clearing credentials:', error);
                      }
                    }}
                    className="mt-2"
                  >
                    <Text className="text-white text-center text-xs opacity-70">Clear Saved Credentials</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Eco-friendly footer */}
              <View className="mt-6 items-center">
                <Text className="text-white text-xs text-center opacity-90" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>
                  🌱 Every sign-in helps us track your sustainable choices
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
} 