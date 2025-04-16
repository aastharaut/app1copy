import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const Profile = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setEmail(userData.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        name,
      });

      setEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || !user.email) return;

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password updated successfully!");
      setChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMessage = "Failed to change password.";

      Alert.alert("Error", errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/authentication/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}></View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome name="user" size={60} color="#4B0082" />
            </View>
            {editing ? (
              <TextInput
                style={styles.editableName}
                value={name}
                onChangeText={setName}
                autoFocus
                />
              ) : (
              <Text style={styles.name}>{name}</Text>
              )}
              <Text style={styles.email}>{email}</Text>
          </View>
        </View>


        {/* Account Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            {editing ? (
              <TouchableOpacity onPress={handleSaveChanges}>
                <Text style={styles.editButton}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Username</Text>
            {editing ? (
              <TextInput
                style={styles.editableInput}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text style={styles.settingValue}>{name}</Text>
            )}
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email</Text>
            <Text style={styles.settingValue}>{email}</Text>
          </View>

          {changingPassword ? (
            <View style={styles.passwordSection}>
              <Text style={styles.passwordSectionTitle}>Change Password</Text>

              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry
                  placeholder="Current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry
                  placeholder="New password (must be 6 characters)"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.passwordButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setChangingPassword(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.savePasswordButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.savePasswordButtonText}>
                    Save Password
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => setChangingPassword(true)}
            >
              <Text style={styles.changePasswordButtonText}>
                Change Password
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? "#4B0082" : "#f4f3f4"}
              trackColor={{ false: "#F3F0FF", true: "#E5D4FF" }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#4B0082" : "#f4f3f4"}
              trackColor={{ false: "#F3F0FF", true: "#E5D4FF" }}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F3F0FF",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F0FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F0FF",
  },
  header: {
    marginBottom: 50,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 5,
    shadowColor: "#4B0082",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: "#E5D4FF",
    padding: 20,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
  },
  editableName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
    borderBottomWidth: 1,
    borderColor: "#6E29B5",
    marginBottom: 5,
    padding: 2,
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: "#5D1A9D",
  },
  section: {
    marginTop: 20, // Add spacing between the two sections
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#4B0082",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.50,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
  },
  editButton: {
    fontSize: 16,
    color: "#8A2BE2",
    fontWeight: "bold",
  },
  settingItem: {
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 14,
    color: "#6E29B5",
    marginBottom: 5,
  },
  settingValue: {
    fontSize: 16,
    color: "#4B0082",
  },
  editableInput: {
    borderBottomWidth: 1,
    borderColor: "#8A2BE2",
    paddingVertical: 4,
    fontSize: 16,
    color: "#4B0082",
  },
  passwordSection: {
    marginTop: 10,
  },
  passwordSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 10,
  },
  passwordInputContainer: {
    marginBottom: 10,
  },
  passwordLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#8A2BE2",
    borderRadius: 8,
    padding: 10,
    color: "#4B0082",
  },
  passwordButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4B0082",
    fontWeight: "600",
  },
  savePasswordButton: {
    flex: 1,
    backgroundColor: "#5D1A9D",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  savePasswordButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  changePasswordButton: {
    marginTop: 15,
    paddingVertical: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  changePasswordButtonText: {
    color: "#6E29B5",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#6E29B5",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#6E29B5",
  },
  logoutButtonText: {
    color: "#6E29B5",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 12,
  },
});