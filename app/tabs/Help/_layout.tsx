import { Stack } from 'expo-router';

export default function HelpLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="DoctorList" 
        options={{ headerShown: false }}  // Crucial for index route
      />
      <Stack.Screen name="Appointmentbooking" />
      <Stack.Screen name="Doctorprofile" />
      <Stack.Screen name="MedicationTracker" />
    </Stack>
  );
}