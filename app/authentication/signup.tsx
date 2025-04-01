// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { createUserWithEmailAndPassword, updateProfile, AuthError } from "firebase/auth";
// import { auth } from "../../FirebaseConfig"; // Update this path to where your firebase config is located
// import { doc, setDoc } from "firebase/firestore";


// export default function SignUpScreen() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [age, setAge] = useState("");
//   const [bmi, setBmi] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSignUp = async () => {
//     setIsLoading(true);
    
//     try {
//       // Create user with email and password
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
      
//       // Update user profile with name
//       await updateProfile(userCredential.user, {
//         displayName: name
//       });

//       console.log('User registered successfully!');
      
//       // Navigate to home or dashboard screen after successful signup
//       router.push("./cycle"); // Update this to your app's main screen route
      
//     } catch (error) {
//       let errorMessage = 'Registration failed';

      
//          // Type guard to check if error is a Firebase AuthError
//       if (error && typeof error === 'object' && 'code' in error) {
//         // Now TypeScript knows error has a 'code' property
//         if (error.code === 'auth/email-already-in-use') {
//           errorMessage = 'This email is already in use';
//         } else if (error.code === 'auth/invalid-email') {
//           errorMessage = 'Please enter a valid email address';
//         } else if (error.code === 'auth/weak-password') {
//           errorMessage = 'Password should be at least 6 characters';
//         }
//       }
      
//       Alert.alert('Sign Up Error', errorMessage);
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const goToLogin = () => {
//     router.push("/authentication/login");
//   };

//   const isFormValid = () => {
//     return (
//       name.trim() !== "" &&
//       email.trim() !== "" &&
//       password.trim() !== "" &&
//       confirmPassword.trim() !== "" &&
//       password === confirmPassword
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.headerContainer}>
//           <Text style={styles.headerTitle}>HormonIQ</Text>
//           <Text style={styles.headerSubtitle}>Balance your hormones.</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.welcomeText}>Create Account</Text>

//           <View style={styles.inputContainer}>
//             <Ionicons name="person-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Full Name"
//               placeholderTextColor="#CCC"
//               value={name}
//               onChangeText={setName}
//               autoCapitalize="words"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor="#CCC"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#CCC"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               autoCapitalize="none"
//             />
//             <TouchableOpacity
//               style={styles.eyeIcon}
//               onPress={() => setShowPassword(!showPassword)}
//             >
//               <Ionicons
//                 name={showPassword ? "eye-off-outline" : "eye-outline"}
//                 size={20}
//                 color="#FFFFFF"
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Confirm Password"
//               placeholderTextColor="#CCC"
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               secureTextEntry={!showConfirmPassword}
//               autoCapitalize="none"
//             />
//             <TouchableOpacity
//               style={styles.eyeIcon}
//               onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               <Ionicons
//                 name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
//                 size={20}
//                 color="#FFFFFF"
//               />
//             </TouchableOpacity>
//           </View>

//           {password !== confirmPassword && confirmPassword !== "" && (
//             <Text style={styles.passwordMismatch}>Passwords don't match</Text>
//           )}

//           <View style={styles.termsContainer}>
//             <Text style={styles.termsText}>
//               By signing up, you agree to our{" "}
//               <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
//               <Text style={styles.termsLink}>Privacy Policy</Text>
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={[styles.signupButton, !isFormValid() && styles.signupButtonDisabled]}
//             onPress={handleSignUp}
//             disabled={!isFormValid() || isLoading}
//           >
//             <Text style={styles.signupButtonText}>
//               {isLoading ? "Creating Account..." : "Sign Up"}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.loginContainer}>
//             <Text style={styles.loginText}>Already have an account? </Text>
//             <TouchableOpacity onPress={goToLogin}>
//               <Text style={styles.loginLink}>Log In</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#4B0082", // Matching indigo theme
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   headerContainer: {
//     alignItems: "center",
//     marginTop: 50,
//     marginBottom: 25,
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: "#FFFFFF",
//     marginTop: 5,
//     fontStyle: "italic",
//   },
//   formContainer: {
//     flex: 1,
//     backgroundColor: "#5D1A9D", // Slightly lighter indigo for form area
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingHorizontal: 25,
//     paddingTop: 30,
//     paddingBottom: 40,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     marginBottom: 25,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#6E29B5", // Even lighter indigo for input fields
//     borderRadius: 10,
//     marginBottom: 16,
//     paddingHorizontal: 15,
//     height: 55,
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     color: "#FFFFFF",
//     fontSize: 16,
//     height: "100%",
//   },
//   eyeIcon: {
//     padding: 5,
//   },
//   passwordMismatch: {
//     color: "#FF6B6B", // Red for error
//     fontSize: 14,
//     marginTop: -10,
//     marginBottom: 10,
//     marginLeft: 5,
//   },
//   termsContainer: {
//     marginVertical: 20,
//   },
//   termsText: {
//     color: "#E0C2FF",
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   termsLink: {
//     color: "#D4A7FF",
//     fontWeight: "bold",
//   },
//   signupButton: {
//     backgroundColor: "#8A2BE2", // Vibrant purple for button
//     borderRadius: 10,
//     height: 55,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   signupButtonDisabled: {
//     opacity: 0.6,
//   },
//   signupButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   loginContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   loginText: {
//     color: "#E0C2FF",
//     fontSize: 14,
//   },
//   loginLink: {
//     color: "#D4A7FF",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
//import { registerUser } from "@/api/users";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isFormValid()) return;
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const userDocRef = doc(db, "Users", userCredential.user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        age: parseInt(age),
        BMI: parseFloat(bmi),
        createdAt: new Date().toISOString(),
      });
      router.push("./login");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleAuthError = (error: unknown) => {
    let errorMessage = "Registration failed";
  
    if (typeof error === "object" && error !== null && "code" in error) {
      const errorCode = (error as { code: string }).code;
  
      switch (errorCode) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password must be at least 6 characters";
          break;
      }
    }
  
    Alert.alert("Error", errorMessage);
  };

  const goToLogin = () => {
    router.push("/authentication/login");
  };
  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      age.trim() !== "" &&
      bmi.trim() !== "" &&
      password.trim() !== "" &&
      password === confirmPassword
    );
  };



  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>HormonIQ</Text>
          <Text style={styles.headerSubtitle}>Balance your hormones.</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#CCC"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
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

          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor="#CCC"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="speedometer-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="BMI"
              placeholderTextColor="#CCC"
              value={bmi}
              onChangeText={setBmi}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#CCC"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#CCC"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {password !== confirmPassword && confirmPassword !== "" && (
            <Text style={styles.passwordMismatch}>Passwords don't match</Text>
          )}

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, !isFormValid() && styles.signupButtonDisabled]}
            onPress={handleSignUp}
            disabled={!isFormValid() || isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4B0082", //indigo theme
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 25,
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
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#5D1A9D", // Slightly lighter indigo for form area
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6E29B5", // Even lighter indigo for input fields
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 55,
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
  eyeIcon: {
    padding: 5,
  },
  passwordMismatch: {
    color: "#FF6B6B", // Red for error
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsText: {
    color: "#E0C2FF",
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: "#D4A7FF",
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#8A2BE2", // Vibrant purple for button
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#E0C2FF",
    fontSize: 14,
  },
  loginLink: {
    color: "#D4A7FF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
