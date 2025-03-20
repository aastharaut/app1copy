import React, { useState } from "react";
import { 
  Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, 
  KeyboardAvoidingView, Platform 
} from "react-native";
import { useRouter } from "expo-router";
//import Ionicons from "@react-native-vector-icons/Ionicons";
import { auth } from "../../FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter a valid email!");
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent! Check your inbox.");
      router.push("/authentication/login");
    } catch (error) {
      console.log("Password Reset Error:", error);
      Alert.alert("Reset Failed", "Please check your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <Text style={styles.headerSubtitle}>Enter your email to receive a reset link</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          {/* <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} /> */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#CCC"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, (!email || isLoading) && styles.buttonDisabled]} 
          onPress={handlePasswordReset} 
          disabled={!email || isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push("/authentication/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B0082",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#5D1A9D",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6E29B5",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 55,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: "100%",
  },
  button: {
    backgroundColor: "#8A2BE2",
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#8A2BE2",
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

