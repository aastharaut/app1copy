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
// import React, { useState } from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { Calendar, DateData } from "react-native-calendars";

// const CalendarScreen: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<string>("");

//   // Example cycle data (Replace with actual logic)
//   const menstruationDates = ["2025-03-01", "2025-03-02", "2025-03-03"];
//   const pastMenstruationDates = ["2025-02-01", "2025-02-02", "2025-02-03"];
//   const ovulationDates = ["2025-03-14", "2025-03-15", "2025-03-16"];
//   const upcomingPeriodDates = ["2025-03-30", "2025-03-31", "2025-04-01"];

//   const onDayPress = (day: DateData) => {
//     setSelectedDate(day.dateString);
//   };

//   // Create marked dates object
//   const markedDates: Record<string, any> = {};

//   menstruationDates.forEach((date) => {
//     markedDates[date] = { marked: true, selectedColor: "red" };
//   });

//   pastMenstruationDates.forEach((date) => {
//     markedDates[date] = { marked: true, dotColor: "#FF6666" }; // Lighter red
//   });

//   ovulationDates.forEach((date) => {
//     markedDates[date] = { marked: true, dotColor: "#ADD8E6" }; // Pale blue
//   });

//   upcomingPeriodDates.forEach((date) => {
//     markedDates[date] = { marked: true, dotColor: "#FFC0CB" }; // Lighter red
//   });

//   if (selectedDate) {
//     markedDates[selectedDate] = { selected: true, selectedColor: "blue" };
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <Calendar
//           onDayPress={onDayPress}
//           markedDates={markedDates}
//           theme={{
//             todayTextColor: "red",
//             arrowColor: "blue",
//           }}
//         />
//       </ScrollView>

//       {selectedDate ? (
//         <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingTop: 50,
//   },
//   selectedDateText: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "black",
//     textAlign: "center",
//   },
// });

// export default CalendarScreen;
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format, addDays, isBefore, isAfter } from "date-fns";

import { app } from "../../FirebaseConfig";
import { parseISO } from "date-fns/parseISO";

const db = getFirestore(app);
const auth = getAuth(app);

interface UserCycleData {
  userId: string;
  lastPeriodDate1: Timestamp | Date;
  lastPeriodDate2: Timestamp | Date;
  periodLength: number;
  cycleLength: number;
  currentCycleDay?: number;
  currentPhase?: string;
  predictedNextPeriodDate?: Timestamp | Date;
  predictedOvulationDate?: Timestamp | Date;
  lastUpdated?: any;
}

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [cycleData, setCycleData] = useState<UserCycleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [user, setUser] = useState<any>(null);

  // Fetch authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch cycle data when user is available
  useEffect(() => {
    if (!user) return;

    const fetchCycleData = async () => {
      try {
        setLoading(true);
        const cycleRef = doc(db, "cycles", user.uid);
        const docSnap = await getDoc(cycleRef);
        
        if (docSnap.exists()) {
          setCycleData(docSnap.data() as UserCycleData);
        } else {
          console.log("No cycle data found");
        }
      } catch (error) {
        console.error("Error fetching cycle data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCycleData();
  }, [user]);

  // Convert Firestore Timestamp to Date
  const toDate = (timestamp: any): Date => {
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  };

  // Calculate and set marked dates
  useEffect(() => {
    if (!cycleData) return;

    const today = new Date();
    const marked: Record<string, any> = {};

    // Highlight today
    marked[format(today, 'yyyy-MM-dd')] = {
      customStyles: {
        container: {
          backgroundColor: '#EDEDED',
          borderRadius: 16,
        },
        text: {
          color: 'black',
          fontWeight: 'bold'
        }
      }
    };

    // Get dates from cycle data
    const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
    const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

    // Mark past periods (from lastPeriodDate2 if available)
    if (lastPeriod2) {
      const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
      let currentDate = new Date(lastPeriod2);
      
      while (isBefore(currentDate, periodEndDate2)) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        marked[dateStr] = {
          dotColor: '#FFC0CB',
          marked: true,
          activeOpacity: 0
        };
        currentDate = addDays(currentDate, 1);
      }
    }

    // Current period (from lastPeriodDate1)
    const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
    
    if (isBefore(today, periodEndDate1)) {
      let currentDate = new Date(lastPeriod1);
      
      while (isBefore(currentDate, periodEndDate1)) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        marked[dateStr] = {
          customStyles: {
            container: {
              backgroundColor: '#FF6B6B',
              borderRadius: 16,
            },
            text: {
              color: 'white'
            }
          }
        };
        
        currentDate = addDays(currentDate, 1);
      }
    }

    // Ovulation (pale blue) - using your calculation method
    const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
    const ovulationStart = addDays(nextPeriodStart, -14);
    const ovulationEnd = addDays(ovulationStart, 3);
    
    let currentDate = new Date(ovulationStart);
    while (isBefore(currentDate, ovulationEnd)) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      marked[dateStr] = {
        customStyles: {
          container: {
            backgroundColor: '#ADD8E6',
            borderRadius: 16,
          },
          text: {
            color: 'black'
          }
        }
      };
      
      currentDate = addDays(currentDate, 1);
    }

    // Upcoming periods (next 3 cycles - light pink background)
    for (let i = 1; i <= 3; i++) {
      const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
      const periodEnd = addDays(periodStart, cycleData.periodLength);
      
      let currentDate = new Date(periodStart);
      
      while (isBefore(currentDate, periodEnd)) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        marked[dateStr] = {
          customStyles: {
            container: {
              backgroundColor: '#FFE6E6',
              borderRadius: 16,
            },
            text: {
              color: '#FF6B6B'
            }
          }
        };
        
        currentDate = addDays(currentDate, 1);
      }
    }

    setMarkedDates(marked);
  }, [cycleData]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const renderDayDetails = () => {
    if (!selectedDate || !cycleData) return null;
    
    const date = parseISO(selectedDate);
    let details = [];
    
    const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
    const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

    // Check if it's in past period (lastPeriodDate2)
  // Check if it's in past period (lastPeriodDate2)
  if (lastPeriod2) {
    const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
    if (isAfter(date, lastPeriod2) && isBefore(date, periodEndDate2)) {
      details.push("Past menstrual day");
    }
  }
    
    // Check if it's in current period (lastPeriodDate1)
    const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
    if (isAfter(date, lastPeriod1) && isBefore(date, periodEndDate1)) {
      details.push("Current menstrual day");
    }
    
    // Check if it's an ovulation day
    const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
    const ovulationStart = addDays(nextPeriodStart, -14);
    const ovulationEnd = addDays(ovulationStart, 3);
    
    if (isAfter(date, ovulationStart) && isBefore(date, ovulationEnd)) {
      details.push("Ovulation window");
    }
    
    // Check if it's an upcoming period day
    for (let i = 1; i <= 3; i++) {
      const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
      const periodEnd = addDays(periodStart, cycleData.periodLength);
      
      if (isAfter(date, periodStart) && isBefore(date, periodEnd)) {
        details.push(`Predicted period day (Cycle ${i})`);
        break;
      }
    }
    
    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>{format(date, 'MMMM do, yyyy')}</Text>
        {details.length > 0 ? (
          details.map((detail, index) => (
            <Text key={index} style={styles.detailText}>• {detail}</Text>
          ))
        ) : (
          <Text style={styles.detailText}>No cycle events this day</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading your cycle data...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Please sign in to view your cycle calendar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Your Cycle Calendar</Text>
        
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType={'custom'}
          theme={{
            pastScrollRange: 12,
            futureScrollRange: 12,
            scrollEnabled: 'true',
            showScrollIndicator: 'true',
            markingType: 'custom',
            markedDates: 'markedDates',
            onDayPress: 'onDayPress' ,
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#6C63FF',
            selectedDayBackgroundColor: '#6C63FF',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#6C63FF',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#6C63FF',
            selectedDotColor: '#ffffff',
            arrowColor: '#6C63FF',
            monthTextColor: '#6C63FF',
            indicatorColor: '#6C63FF',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 14,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
        />

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>Current Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFE6E6' }]} />
            <Text style={styles.legendText}>Upcoming Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ADD8E6' }]} />
            <Text style={styles.legendText}>Ovulation</Text>
          </View>
          {cycleData?.lastPeriodDate2 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFC0CB' }]} />
              <Text style={styles.legendText}>Past Period</Text>
            </View>
          )}
        </View>

        {renderDayDetails()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6C63FF',
    fontSize: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C63FF',
    textAlign: 'center',
    marginVertical: 20,
  },
  calendar: {
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    width: '45%',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#555',
  },
  detailsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
});

export default CalendarScreen;