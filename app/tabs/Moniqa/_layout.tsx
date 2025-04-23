import { Stack } from 'expo-router';

export default function MoniqaLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}  // Crucial for index route
      />
      <Stack.Screen name="Chat" options={{ headerShown: false}} />
    </Stack>
  );
}