import { Stack } from 'expo-router';

export default function CycleLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}  // Crucial for index route
      />
      <Stack.Screen name="current" />
      <Stack.Screen name="tracker" />
      <Stack.Screen name="period" />
    </Stack>
  );
}