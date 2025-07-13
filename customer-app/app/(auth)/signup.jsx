import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    const maxRetries = 3;
    let retryCount = 0;
    
    const attemptSignUp = async () => {
      try {
        console.log("Attempting to create user with email:", email);
        console.log("Firebase auth object:", auth);
        console.log("Firebase config:", auth.app.options);
        console.log(`Attempt ${retryCount + 1} of ${maxRetries}`);
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created successfully:", userCredential.user.uid);
        
        await updateProfile(userCredential.user, { displayName: name });
        console.log("Profile updated successfully");
        
        router.replace("/(tabs)/home");
      } catch (error) {
        console.error("Firebase sign up error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        
        if (error.code === 'auth/network-request-failed' && retryCount < maxRetries - 1) {
          retryCount++;
          console.log(`Network error, retrying... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          return attemptSignUp();
        }
        
        alert(`Sign up failed: ${error.message}\nError code: ${error.code}`);
      }
    };
    
    await attemptSignUp();
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
                <Text className="text-white text-sm text-center" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>Join the sustainable shopping revolution</Text>
              </View>

              {/* Sign Up Form */}
              <View className="w-full max-w-sm">
                <View className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Text className="text-white text-xl font-bold mb-2 text-center">Create Account</Text>
                  <Text className="text-white text-sm mb-6 text-center opacity-90">Start your journey towards sustainable shopping</Text>
                  
                  <TextInput
                    className="bg-white rounded-xl px-4 py-3 mb-4 text-base"
                    placeholder="Full Name"
                    placeholderTextColor="#6b7280"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"
                  />
                  
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
                  
                  <View className="relative mb-4">
                    <TextInput
                      className="bg-white rounded-xl px-4 py-3 text-base pr-12"
                      placeholder="Password"
                      placeholderTextColor="#6b7280"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      returnKeyType="next"
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
                  
                  <View className="relative mb-6">
                    <TextInput
                      className="bg-white rounded-xl px-4 py-3 text-base pr-12"
                      placeholder="Confirm Password"
                      placeholderTextColor="#6b7280"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-3"
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Text className="text-gray-500 text-lg">
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    className="bg-green-600 rounded-xl py-3 items-center mb-4 shadow-lg"
                    style={{ elevation: 3 }}
                    onPress={handleSignUp}
                  >
                    <Text className="text-white font-bold text-lg">Create Account</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => router.push("/signin")} className="mb-4">
                    <Text className="text-white text-center text-sm">
                      Already have an account? <Text className="underline font-semibold">Sign In</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Eco-friendly footer */}
              <View className="mt-6 items-center">
                <Text className="text-white text-xs text-center opacity-90" style={{textShadowColor: '#000', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2}}>
                  🌍 Together we can make shopping more sustainable
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
} 