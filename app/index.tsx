import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; // Start below

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // 1.5 seconds
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        router.replace("/authentication/login"); // Ensures splash doesn't come back on back press
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Animation
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      /> */}

      {/* App Name Animation */}
      <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
        HormonIQ
      </Animated.Text>

      {/* Slogan Animation */}
      <Animated.Text style={[styles.slogan, { opacity: fadeAnim }]}>
        Balance your hormones.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4B0082", // Indigo Theme
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  slogan: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
    fontStyle: "italic",
  },
});
