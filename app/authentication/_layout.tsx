import { Stack } from 'expo-router';

export default function HelpLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }}  // Crucial for index route
      />
      <Stack.Screen name="signup"options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }}/>
      <Stack.Screen name="settings"options={{ headerShown: false }} />

    </Stack>
  );
}