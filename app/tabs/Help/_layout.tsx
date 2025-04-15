import { Stack } from 'expo-router';

export default function HelpLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="DoctorsList" 
        options={{ headerShown: false }}  // Crucial for index route
      />
      <Stack.Screen name="AppointmentBooking" />
      <Stack.Screen name="MedicationTracker" />
    </Stack>
  );
}