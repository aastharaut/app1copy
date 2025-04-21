import { Stack } from 'expo-router';

export default function ChatbotLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}  // Crucial for index route
      />
      <Stack.Screen name="Moniqa" />
    </Stack>
  );
}