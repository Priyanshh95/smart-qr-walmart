import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
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
    <SafeAreaView className="bg-green-900 flex-1">
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
          <View className="flex-1 justify-center items-center px-4">
            <Image source={require("../../assets/images/logo.png")} className="w-60 h-60 mt-2 mb-2" />
            <Text className="text-white text-xl font-bold mb-2 text-center">NutriTrace</Text>
            <View
              className="rounded-2xl shadow p-6 w-full max-w-md"
              style={{ backgroundColor: '#f0fdf4' }}
            >
              <Text className="text-green-900 text-2xl font-bold mb-2 text-center">Sign Up</Text>
              <Text className="text-gray-500 mb-6 text-center">Create your account to get started.</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Name"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Email"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
              <View className="relative">
                <TextInput
                  className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base pr-12"
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
              <View className="relative">
                <TextInput
                  className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base pr-12"
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
                className="bg-yellow-500 rounded-lg py-3 items-center mb-2"
                onPress={handleSignUp}
              >
                <Text className="text-white font-bold text-base">Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/signin")}
                className="mt-2">
                <Text className="text-green-900 text-center">Already have an account? <Text className="underline">Sign In</Text></Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 