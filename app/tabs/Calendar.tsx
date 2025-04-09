// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Calendar, DateData } from 'react-native-calendars';

// const CalendarScreen: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<string>('');

//   const onDayPress = (day: DateData) => {
//     setSelectedDate(day.dateString);
//   };

//   return (
//     <View style={styles.container}>
//       <Calendar
//         onDayPress={onDayPress}
//         markedDates={{
//           [selectedDate]: { selected: true, selectedColor: 'blue' },
//         }}
//         theme={{
//           selectedDayBackgroundColor: 'blue',
//           todayTextColor: 'red',
//           arrowColor: 'blue',
//         }}
//       />
//       {selectedDate ? (
//         <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   selectedDateText: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//   },
// });

// export default CalendarScreen;
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Example cycle data (Replace with actual logic)
  const menstruationDates = ["2025-03-01", "2025-03-02", "2025-03-03"];
  const pastMenstruationDates = ["2025-02-01", "2025-02-02", "2025-02-03"];
  const ovulationDates = ["2025-03-14", "2025-03-15", "2025-03-16"];
  const upcomingPeriodDates = ["2025-03-30", "2025-03-31", "2025-04-01"];

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // Create marked dates object
  const markedDates: Record<string, any> = {};

  menstruationDates.forEach((date) => {
    markedDates[date] = { marked: true, selectedColor: "red" };
  });

  pastMenstruationDates.forEach((date) => {
    markedDates[date] = { marked: true, dotColor: "#FF6666" }; // Lighter red
  });

  ovulationDates.forEach((date) => {
    markedDates[date] = { marked: true, dotColor: "#ADD8E6" }; // Pale blue
  });

  upcomingPeriodDates.forEach((date) => {
    markedDates[date] = { marked: true, dotColor: "#FFC0CB" }; // Lighter red
  });

  if (selectedDate) {
    markedDates[selectedDate] = { selected: true, selectedColor: "blue" };
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            todayTextColor: "red",
            arrowColor: "blue",
          }}
        />
      </ScrollView>

      {selectedDate ? (
        <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  selectedDateText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});

export default CalendarScreen;
