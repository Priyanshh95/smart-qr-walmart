import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '../../assets/colors'
import Ionicons from '@expo/vector-icons/Ionicons'

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.dark.text,
        tabBarStyle: {
          backgroundColor: Colors.SECONDARY,
          paddingBottom: 14,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ color}) => (
        <Ionicons name="home" color={color} size={24} />
      ) }} />
      <Tabs.Screen name="history" options={{ title: "History", tabBarIcon: ({ color}) => (
        <Ionicons name="time" color={color} size={24} />
      ) }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color}) => (
        <Ionicons name="person" color={color} size={24} />
      ) }} />
    </Tabs>
  )
}

export default TabsLayout