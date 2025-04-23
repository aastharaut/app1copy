import { Stack } from 'expo-router';

export default function HelpLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="DoctorList" 
        options={{ headerShown: false }}  // Crucial for index route
      />
      <Stack.Screen name="Appointmentbooking"
              options={{ headerShown: false }}  // Crucial for index route
              />
      <Stack.Screen name="Doctorprofile" 
              options={{ headerShown: false }}  // Crucial for index route
/>
      <Stack.Screen name="MedicationTracker" />
      <Stack.Screen name="Appointmentdetails" />
    </Stack>
  );
}