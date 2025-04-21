import React from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4B0082", // Purple when active
        tabBarInactiveTintColor: "#999", // Grey when inactive
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // White tab bar
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="Calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="calendar-heart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Analysis"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <AntDesign name="dotchart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Cycle"
        options={{
          title: "Cycle",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
             name="selection-ellipse"
              size={size} 
              color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Moniqa"
        options={{
          title: "Moniqa",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="robot-happy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Help"
        options={{
          title: "Help",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      
    </Tabs>
    
  );
};



export default _layout;

const styles = StyleSheet.create({});
