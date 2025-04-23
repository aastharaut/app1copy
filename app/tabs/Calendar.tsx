
// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
// import { Calendar, DateData } from "react-native-calendars";
// import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { format, addDays, isBefore, isAfter } from "date-fns";

// import { app } from "../../FirebaseConfig";
// import { parseISO } from "date-fns/parseISO";

// const db = getFirestore(app);
// const auth = getAuth(app);

// interface UserCycleData {
//   userId: string;
//   lastPeriodDate1: Timestamp | Date;
//   lastPeriodDate2: Timestamp | Date;
//   periodLength: number;
//   cycleLength: number;
//   currentCycleDay?: number;
//   currentPhase?: string;
//   predictedNextPeriodDate?: Timestamp | Date;
//   predictedOvulationDate?: Timestamp | Date;
//   lastUpdated?: any;
// }

// const CalendarScreen: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [cycleData, setCycleData] = useState<UserCycleData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
//   const [user, setUser] = useState<any>(null);

//   // Fetch authenticated user
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//         setLoading(false);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   // Fetch cycle data when user is available
//   useEffect(() => {
//     if (!user) return;

//     const fetchCycleData = async () => {
//       try {
//         setLoading(true);
//         const cycleRef = doc(db, "cycles", user.uid);
//         const docSnap = await getDoc(cycleRef);
        
//         if (docSnap.exists()) {
//           setCycleData(docSnap.data() as UserCycleData);
//         } else {
//           console.log("No cycle data found");
//         }
//       } catch (error) {
//         console.error("Error fetching cycle data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCycleData();
//   }, [user]);

//   // Convert Firestore Timestamp to Date
//   const toDate = (timestamp: any): Date => {
//     if (timestamp?.toDate) {
//       return timestamp.toDate();
//     }
//     return timestamp instanceof Date ? timestamp : new Date(timestamp);
//   };

//   // Calculate and set marked dates
//   useEffect(() => {
//     if (!cycleData) return;

//     const today = new Date();
//     const marked: Record<string, any> = {};

//     // Highlight today
//     marked[format(today, 'yyyy-MM-dd')] = {
//       customStyles: {
//         container: {
//           backgroundColor: '#EDEDED',
//           borderRadius: 16,
//         },
//         text: {
//           color: 'black',
//           fontWeight: 'bold'
//         }
//       }
//     };

//     // Get dates from cycle data
//     const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
//     const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

//     // Mark past periods (from lastPeriodDate2 if available)
//     if (lastPeriod2) {
//       const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
//       let currentDate = new Date(lastPeriod2);
      
//       while (isBefore(currentDate, periodEndDate2)) {
//         const dateStr = format(currentDate, 'yyyy-MM-dd');
//         marked[dateStr] = {
//           dotColor: '#FFC0CB',
//           marked: true,
//           activeOpacity: 0
//         };
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     // Current period (from lastPeriodDate1)
//     const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
    
//     if (isBefore(today, periodEndDate1)) {
//       let currentDate = new Date(lastPeriod1);
      
//       while (isBefore(currentDate, periodEndDate1)) {
//         const dateStr = format(currentDate, 'yyyy-MM-dd');
        
//         marked[dateStr] = {
//           customStyles: {
//             container: {
//               backgroundColor: '#FF6B6B',
//               borderRadius: 16,
//             },
//             text: {
//               color: 'white'
//             }
//           }
//         };
        
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     // Ovulation (pale blue) - using your calculation method
//     const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
//     const ovulationStart = addDays(nextPeriodStart, -14);
//     const ovulationEnd = addDays(ovulationStart, 3);
    
//     let currentDate = new Date(ovulationStart);
//     while (isBefore(currentDate, ovulationEnd)) {
//       const dateStr = format(currentDate, 'yyyy-MM-dd');
      
//       marked[dateStr] = {
//         customStyles: {
//           container: {
//             backgroundColor: '#ADD8E6',
//             borderRadius: 16,
//           },
//           text: {
//             color: 'black'
//           }
//         }
//       };
      
//       currentDate = addDays(currentDate, 1);
//     }

//     // Upcoming periods (next 3 cycles - light pink background)
//     for (let i = 1; i <= 3; i++) {
//       const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
//       const periodEnd = addDays(periodStart, cycleData.periodLength);
      
//       let currentDate = new Date(periodStart);
      
//       while (isBefore(currentDate, periodEnd)) {
//         const dateStr = format(currentDate, 'yyyy-MM-dd');
        
//         marked[dateStr] = {
//           customStyles: {
//             container: {
//               backgroundColor: '#FFE6E6',
//               borderRadius: 16,
//             },
//             text: {
//               color: '#FF6B6B'
//             }
//           }
//         };
        
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     setMarkedDates(marked);
//   }, [cycleData]);

//   const onDayPress = (day: DateData) => {
//     setSelectedDate(day.dateString);
//   };

//   const renderDayDetails = () => {
//     if (!selectedDate || !cycleData) return null;
    
//     const date = parseISO(selectedDate);
//     let details = [];
    
//     const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
//     const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

//     // Check if it's in past period (lastPeriodDate2)
//   // Check if it's in past period (lastPeriodDate2)
//   if (lastPeriod2) {
//     const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
//     if (isAfter(date, lastPeriod2) && isBefore(date, periodEndDate2)) {
//       details.push("Past menstrual day");
//     }
//   }
    
//     // Check if it's in current period (lastPeriodDate1)
//     const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
//     if (isAfter(date, lastPeriod1) && isBefore(date, periodEndDate1)) {
//       details.push("Current menstrual day");
//     }
    
//     // Check if it's an ovulation day
//     const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
//     const ovulationStart = addDays(nextPeriodStart, -14);
//     const ovulationEnd = addDays(ovulationStart, 3);
    
//     if (isAfter(date, ovulationStart) && isBefore(date, ovulationEnd)) {
//       details.push("Ovulation window");
//     }
    
//     // Check if it's an upcoming period day
//     for (let i = 1; i <= 3; i++) {
//       const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
//       const periodEnd = addDays(periodStart, cycleData.periodLength);
      
//       if (isAfter(date, periodStart) && isBefore(date, periodEnd)) {
//         details.push(`Predicted period day (Cycle ${i})`);
//         break;
//       }
//     }
    
//     return (
//       <View style={styles.detailsContainer}>
//         <Text style={styles.detailsTitle}>{format(date, 'MMMM do, yyyy')}</Text>
//         {details.length > 0 ? (
//           details.map((detail, index) => (
//             <Text key={index} style={styles.detailText}>• {detail}</Text>
//           ))
//         ) : (
//           <Text style={styles.detailText}>No cycle events this day</Text>
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//         <Text style={styles.loadingText}>Loading your cycle data...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Please sign in to view your cycle calendar</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.header}>Your Cycle Calendar</Text>
        
//         <Calendar
//           onDayPress={onDayPress}
//           markedDates={markedDates}
//           markingType={'custom'}
//           theme={{
//             pastScrollRange: 12,
//             futureScrollRange: 12,
//             scrollEnabled: 'true',
//             showScrollIndicator: 'true',
//             markingType: 'custom',
//             markedDates: 'markedDates',
//             onDayPress: 'onDayPress' ,
//             backgroundColor: '#ffffff',
//             calendarBackground: '#ffffff',
//             textSectionTitleColor: '#6C63FF',
//             selectedDayBackgroundColor: '#6C63FF',
//             selectedDayTextColor: '#ffffff',
//             todayTextColor: '#6C63FF',
//             dayTextColor: '#2d4150',
//             textDisabledColor: '#d9e1e8',
//             dotColor: '#6C63FF',
//             selectedDotColor: '#ffffff',
//             arrowColor: '#6C63FF',
//             monthTextColor: '#6C63FF',
//             indicatorColor: '#6C63FF',
//             textDayFontWeight: '500',
//             textMonthFontWeight: 'bold',
//             textDayHeaderFontWeight: '500',
//             textDayFontSize: 14,
//             textMonthFontSize: 18,
//             textDayHeaderFontSize: 14,
//           }}
//           style={styles.calendar}
//         />

//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
//             <Text style={styles.legendText}>Current Period</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: '#FFE6E6' }]} />
//             <Text style={styles.legendText}>Upcoming Period</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: '#ADD8E6' }]} />
//             <Text style={styles.legendText}>Ovulation</Text>
//           </View>
//           {cycleData?.lastPeriodDate2 && (
//             <View style={styles.legendItem}>
//               <View style={[styles.legendColor, { backgroundColor: '#FFC0CB' }]} />
//               <Text style={styles.legendText}>Past Period</Text>
//             </View>
//           )}
//         </View>

//         {renderDayDetails()}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContainer: {
//     paddingBottom: 30,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#6C63FF',
//     fontSize: 16,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#6C63FF',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   calendar: {
//     marginHorizontal: 16,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     margin: 16,
//     padding: 12,
//     backgroundColor: '#F8F9FA',
//     borderRadius: 8,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 4,
//     width: '45%',
//   },
//   legendColor: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#555',
//   },
//   detailsContainer: {
//     margin: 16,
//     padding: 16,
//     backgroundColor: '#F8F9FA',
//     borderRadius: 8,
//   },
//   detailsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#6C63FF',
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#555',
//     marginVertical: 2,
//   },
// });

// export default CalendarScreen;

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import { Calendar, DateData } from "react-native-calendars";
// import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { format, addDays, isBefore, isAfter } from "date-fns";
// import { app } from "../../FirebaseConfig";
// import { parseISO } from "date-fns/parseISO";

// const db = getFirestore(app);
// const auth = getAuth(app);

// interface UserCycleData {
//   userId: string;
//   lastPeriodDate1: Timestamp | Date;
//   lastPeriodDate2: Timestamp | Date;
//   periodLength: number;
//   cycleLength: number;
//   currentCycleDay?: number;
//   currentPhase?: string;
//   predictedNextPeriodDate?: Timestamp | Date;
//   predictedOvulationDate?: Timestamp | Date;
//   lastUpdated?: any;
// }

// const CalendarScreen: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [cycleData, setCycleData] = useState<UserCycleData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
//   const [user, setUser] = useState<any>(null);

//   // Fetch authenticated user
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//         setLoading(false);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   // Fetch cycle data when user is available
//   useEffect(() => {
//     if (!user) return;
//     const fetchCycleData = async () => {
//       try {
//         setLoading(true);
//         const cycleRef = doc(db, "cycles", user.uid);
//         const docSnap = await getDoc(cycleRef);
//         if (docSnap.exists()) {
//           setCycleData(docSnap.data() as UserCycleData);
//         } else {
//           console.log("No cycle data found");
//         }
//       } catch (error) {
//         console.error("Error fetching cycle data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCycleData();
//   }, [user]);

//   // Convert Firestore Timestamp to Date
//   const toDate = (timestamp: any): Date => {
//     if (timestamp?.toDate) {
//       return timestamp.toDate();
//     }
//     return timestamp instanceof Date ? timestamp : new Date(timestamp);
//   };

//   // Calculate and set marked dates
//   useEffect(() => {
//     if (!cycleData) return;
//     const today = new Date();
//     const marked: Record<string, any> = {};

//     // Highlight today
//     marked[format(today, "yyyy-MM-dd")] = {
//       customStyles: {
//         container: {
//           backgroundColor: "#EDEDED",
//           borderRadius: 16,
//         },
//         text: {
//           color: "black",
//           fontWeight: "bold",
//         },
//       },
//     };

//     // Get dates from cycle data
//     const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
//     const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

//     // Mark past periods (from lastPeriodDate2 if available)
//     if (lastPeriod2) {
//       const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
//       let currentDate = new Date(lastPeriod2);
//       while (isBefore(currentDate, periodEndDate2)) {
//         const dateStr = format(currentDate, "yyyy-MM-dd");
//         marked[dateStr] = {
//           dotColor: "#FFC0CB",
//           marked: true,
//           activeOpacity: 0,
//         };
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     // Current period (from lastPeriodDate1)
//     const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
//     if (isBefore(today, periodEndDate1)) {
//       let currentDate = new Date(lastPeriod1);
//       while (isBefore(currentDate, periodEndDate1)) {
//         const dateStr = format(currentDate, "yyyy-MM-dd");
//         marked[dateStr] = {
//           customStyles: {
//             container: {
//               backgroundColor: "#FF6B6B",
//               borderRadius: 16,
//             },
//             text: {
//               color: "white",
//             },
//           },
//         };
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     // Ovulation (pale blue)
//     const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
//     const ovulationStart = addDays(nextPeriodStart, -14);
//     const ovulationEnd = addDays(ovulationStart, 3);
//     let currentDate = new Date(ovulationStart);
//     while (isBefore(currentDate, ovulationEnd)) {
//       const dateStr = format(currentDate, "yyyy-MM-dd");
//       marked[dateStr] = {
//         customStyles: {
//           container: {
//             backgroundColor: "#ADD8E6",
//             borderRadius: 16,
//           },
//           text: {
//             color: "black",
//           },
//         },
//       };
//       currentDate = addDays(currentDate, 1);
//     }

//     // Upcoming periods (next 3 cycles - light pink background)
//     for (let i = 1; i <= 3; i++) {
//       const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
//       const periodEnd = addDays(periodStart, cycleData.periodLength);
//       let currentDate = new Date(periodStart);
//       while (isBefore(currentDate, periodEnd)) {
//         const dateStr = format(currentDate, "yyyy-MM-dd");
//         marked[dateStr] = {
//           customStyles: {
//             container: {
//               backgroundColor: "#FFE6E6",
//               borderRadius: 16,
//             },
//             text: {
//               color: "#FF6B6B",
//             },
//           },
//         };
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     setMarkedDates(marked);
//   }, [cycleData]);

//   const onDayPress = (day: DateData) => {
//     setSelectedDate(day.dateString);
//   };

//   const renderDayDetails = () => {
//     if (!selectedDate || !cycleData) return null;
//     const date = parseISO(selectedDate);
//     let details = [];

//     const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
//     const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

//     // Check if it's in past period (lastPeriodDate2)
//     if (lastPeriod2) {
//       const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
//       if (isAfter(date, lastPeriod2) && isBefore(date, periodEndDate2)) {
//         details.push("Past menstrual day");
//       }
//     }

//     // Check if it's in current period (lastPeriodDate1)
//     const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
//     if (isAfter(date, lastPeriod1) && isBefore(date, periodEndDate1)) {
//       details.push("Current menstrual day");
//     }

//     // Check if it's an ovulation day
//     const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
//     const ovulationStart = addDays(nextPeriodStart, -14);
//     const ovulationEnd = addDays(ovulationStart, 3);
//     if (isAfter(date, ovulationStart) && isBefore(date, ovulationEnd)) {
//       details.push("Ovulation window");
//     }

//     // Check if it's an upcoming period day
//     for (let i = 1; i <= 3; i++) {
//       const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
//       const periodEnd = addDays(periodStart, cycleData.periodLength);
//       if (isAfter(date, periodStart) && isBefore(date, periodEnd)) {
//         details.push(`Predicted period day (Cycle ${i})`);
//         break;
//       }
//     }

//     return (
//       <View style={styles.detailsContainer}>
//         <Text style={styles.detailsTitle}>{format(date, "MMMM do, yyyy")}</Text>
//         {details.length > 0 ? (
//           details.map((detail, index) => (
//             <Text key={index} style={styles.detailText}>• {detail}</Text>
//           ))
//         ) : (
//           <Text style={styles.detailText}>No cycle events this day</Text>
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//         <Text style={styles.loadingText}>Loading your cycle data...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Please sign in to view your cycle calendar</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
//       <Text style={styles.header}>Your Cycle Calendar</Text>
//       <Calendar
//         onDayPress={onDayPress}
//         markedDates={markedDates}
//         markingType={"custom"}
//         theme={{
//           pastScrollRange: 12,
//           futureScrollRange: 12,
//           scrollEnabled: true,
//           showScrollIndicator: true,
//           markingType: "custom",
//           markedDates: "markedDates",
//           onDayPress: "onDayPress",
//           backgroundColor: "#ffffff",
//           calendarBackground: "#ffffff",
//           textSectionTitleColor: "#6C63FF",
//           selectedDayBackgroundColor: "#6C63FF",
//           selectedDayTextColor: "#ffffff",
//           todayTextColor: "#6C63FF",
//           dayTextColor: "#2d4150",
//           textDisabledColor: "#d9e1e8",
//           dotColor: "#6C63FF",
//           selectedDotColor: "#ffffff",
//           arrowColor: "#6C63FF",
//           monthTextColor: "#6C63FF",
//           indicatorColor: "#6C63FF",
//           textDayFontWeight: "500",
//           textMonthFontWeight: "bold",
//           textDayHeaderFontWeight: "500",
//           textDayFontSize: 14,
//           textMonthFontSize: 18,
//           textDayHeaderFontSize: 14,
//         }}
//         style={styles.calendar}
//       />
//       <View style={styles.legendContainer}>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: "#FF6B6B" }]} />
//           <Text style={styles.legendText}>Current Period</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: "#FFE6E6" }]} />
//           <Text style={styles.legendText}>Upcoming Period</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: "#ADD8E6" }]} />
//           <Text style={styles.legendText}>Ovulation</Text>
//         </View>
//         {cycleData?.lastPeriodDate2 && (
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: "#FFC0CB" }]} />
//             <Text style={styles.legendText}>Past Period</Text>
//           </View>
//         )}
//       </View>
//       {renderDayDetails()}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContainer: {
//     paddingBottom: 30,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     color: "#6C63FF",
//     fontSize: 16,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#6C63FF",
//     textAlign: "center",
//     marginVertical: 20,
//   },
//   calendar: {
//     marginHorizontal: 16,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   legendContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-around",
//     margin: 16,
//     padding: 12,
//     backgroundColor: "#F8F9FA",
//     borderRadius: 8,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 4,
//     width: "45%",
//   },
//   legendColor: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   legendText: {
//     fontSize: 12,
//     color: "#555",
//   },
//   detailsContainer: {
//     margin: 16,
//     padding: 16,
//     backgroundColor: "#F8F9FA",
//     borderRadius: 8,
//   },
//   detailsTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#6C63FF",
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: 14,
//     color: "#555",
//     marginVertical: 2,
//   },
// });

// export default CalendarScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { CalendarList } from "react-native-calendars";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { useRouter } from "expo-router";

// interface UserCycleData {
//   userId: string;
//   lastPeriodDate1: Date | null;
//   lastPeriodDate2: Date | null;
//   periodLength: number;
//   cycleLength: number;
//   trackedDays?: number[];
// }

// const CalendarScreen = ({ userId }: { userId: string }) => {
//   const router = useRouter();
//   const [userData, setUserData] = useState<UserCycleData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user data from Firestore
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!userId) {
//         setError("User ID is required");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         console.log("Fetching cycle data for user:", userId);

//         const db = getFirestore();
//         const userRef = doc(db, "cycles", userId);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const data = userSnap.data() as UserCycleData;
//           console.log("Fetched user data:", data);
//           setUserData(data);
//         } else {
//           console.log("No cycle data found for user:", userId);
//           setError("No cycle data found. Please add your period information.");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setError("Failed to load cycle data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   // Calculate marked dates for the calendar
//   const getMarkedDates = () => {
//     if (!userData || !userData.lastPeriodDate1) return {};

//     const markedDates: { [key: string]: any } = {};
//     const { lastPeriodDate1, lastPeriodDate2, periodLength, cycleLength } = userData;

//     // Convert lastPeriodDate1 to a normalized date
//     const startDate = new Date(lastPeriodDate1);
//     startDate.setHours(0, 0, 0, 0);

//     // Mark current cycle's period (red)
//     for (let i = 0; i < periodLength; i++) {
//       const periodDay = new Date(startDate);
//       periodDay.setDate(periodDay.getDate() + i);
//       const key = periodDay.toISOString().split("T")[0];
//       markedDates[key] = { selected: true, color: "#FF3B30", textColor: "#fff" }; // Red for current period
//     }

//     // Mark past periods (dark pink)
//     if (lastPeriodDate2) {
//       const pastStartDate = new Date(lastPeriodDate2);
//       for (let i = 0; i < periodLength; i++) {
//         const pastPeriodDay = new Date(pastStartDate);
//         pastPeriodDay.setDate(pastPeriodDay.getDate() + i);
//         const key = pastPeriodDay.toISOString().split("T")[0];
//         markedDates[key] = { selected: true, color: "#880837", textColor: "#fff" }; // Dark pink for past periods
//       }
//     }

//     // Predict next three periods (light pink)
//     let nextPeriodDate = new Date(startDate);
//     for (let i = 0; i < 3; i++) {
//       nextPeriodDate = new Date(nextPeriodDate);
//       nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
//       for (let j = 0; j < periodLength; j++) {
//         const futurePeriodDay = new Date(nextPeriodDate);
//         futurePeriodDay.setDate(futurePeriodDay.getDate() + j);
//         const key = futurePeriodDay.toISOString().split("T")[0];
//         markedDates[key] = { selected: true, color: "#F4C2C2", textColor: "#000" }; // Light pink for future periods
//       }
//     }

//     // Mark ovulation days (pale blue)
//     const ovulationDay = new Date(startDate);
//     ovulationDay.setDate(ovulationDay.getDate() + cycleLength - 14); // Luteal phase is ~14 days
//     const ovulationKey = ovulationDay.toISOString().split("T")[0];
//     markedDates[ovulationKey] = { selected: true, color: "#B3E5FC", textColor: "#000" }; // Pale blue for ovulation

//     return markedDates;
//   };

//   if (loading) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Text style={styles.loadingText}>Loading calendar...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.push("/")}
//         >
//           <Text style={styles.buttonText}>Add Period Data</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CalendarList
//         markedDates={getMarkedDates()}
//         markingType="period"
//         pastScrollRange={6} // Allow scrolling back 6 months
//         futureScrollRange={6} // Allow scrolling forward 6 months
//         scrollEnabled={true}
//         showScrollIndicator={true}
//         theme={{
//           backgroundColor: "#1E1B2E",
//           calendarBackground: "#1E1B2E",
//           textSectionTitleColor: "#D1C4E9",
//           selectedDayBackgroundColor: "#8B5CF6",
//           selectedDayTextColor: "#fff",
//           todayTextColor: "#FFD700",
//           dayTextColor: "#fff",
//           textDisabledColor: "#666",
//           dotColor: "#8B5CF6",
//           selectedDotColor: "#fff",
//           arrowColor: "#fff",
//           monthTextColor: "#fff",
//         }}
//       />
//       <TouchableOpacity
//         style={styles.logButton}
//         onPress={() => router.push("/")}
//       >
//         <Text style={styles.logButtonText}>Log New Period</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#1E1B2E",
//     padding: 20,
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#1E1B2E",
//   },
//   loadingText: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   errorText: {
//     color: "#fff",
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#8B5CF6",
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   logButton: {
//     backgroundColor: "#FF3B30",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   logButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//   },
// });

// export default CalendarScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import { CalendarList } from "react-native-calendars";
// import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// //import { addDays, format, parseISO, isBefore, isAfter } from "date-fns";
// import { addDays, format, isBefore, isAfter } from "date-fns";
// import { parseISO } from "date-fns/parseISO";

// const db = getFirestore();
// const auth = getAuth();

// interface UserCycleData {
//   userId: string;
//   lastPeriodDate1: Timestamp | Date;
//   lastPeriodDate2: Timestamp | Date;
//   periodLength: number;
//   cycleLength: number;
//   currentCycleDay?: number;
//   currentPhase?: string;
//   predictedNextPeriodDate?: Timestamp | Date;
//   predictedOvulationDate?: Timestamp | Date;
//   lastUpdated?: any;
// }

// const CalendarScreen: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [cycleData, setCycleData] = useState<UserCycleData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
//   const [user, setUser] = useState<any>(null);

//   // Fetch authenticated user
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//         setLoading(false);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   // Fetch cycle data when user is available
//   useEffect(() => {
//     if (!user) return;

//     const fetchCycleData = async () => {
//       try {
//         setLoading(true);
//         const cycleRef = doc(db, "cycles", user.uid);
//         const docSnap = await getDoc(cycleRef);
//         if (docSnap.exists()) {
//           setCycleData(docSnap.data() as UserCycleData);
//         } else {
//           console.log("No cycle data found");
//         }
//       } catch (error) {
//         console.error("Error fetching cycle data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCycleData();
//   }, [user]);

//   // Convert Firestore Timestamp to Date
//   const toDate = (timestamp: any): Date => {
//     if (timestamp?.toDate) {
//       return timestamp.toDate();
//     }
//     return timestamp instanceof Date ? timestamp : new Date(timestamp);
//   };

//   // Calculate and set marked dates
//   useEffect(() => {
//     if (!cycleData) return;

//     const today = new Date();
//     const marked: Record<string, any> = {};

//     // Highlight today
//     marked[format(today, "yyyy-MM-dd")] = {
//       customStyles: {
//         container: {
//           backgroundColor: "#EDEDED",
//           borderRadius: 16,
//         },
//         text: {
//           color: "black",
//           fontWeight: "bold",
//         },
//       },
//     };

//     // Get dates from cycle data
//     const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
//     const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

//     // Mark past periods (from lastPeriodDate2 if available)
//     if (lastPeriod2) {
//       const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
//       let currentDate = new Date(lastPeriod2);
//       while (isBefore(currentDate, periodEndDate2)) {
//         const dateStr = format(currentDate, "yyyy-MM-dd");
//         marked[dateStr] = {
//           dotColor: "#FFC0CB", // Dark pink for past periods
//           marked: true,
//           activeOpacity: 0,
//         };
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     // Current period (from lastPeriodDate1)
//     const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
//     if (isBefore(today, periodEndDate1)) {
//       let currentDate = new Date(lastPeriod1);
//       while (isBefore(currentDate, periodEndDate1)) {
//         const dateStr = format(currentDate, "yyyy-MM-dd");
//         marked[dateStr] = {
//           customStyles: {
//             container: {
//               backgroundColor: "#FF3B30", // Red for current period
//               borderRadius: 16,
//             },
//             text: {
//               color: "white",
//             },
//           },
//         };
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     // Ovulation (pale blue)
//     const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
//     const ovulationStart = addDays(nextPeriodStart, -14);
//     const ovulationEnd = addDays(ovulationStart, 3);
//     let currentDate = new Date(ovulationStart);
//     while (isBefore(currentDate, ovulationEnd)) {
//       const dateStr = format(currentDate, "yyyy-MM-dd");
//       marked[dateStr] = {
//         customStyles: {
//           container: {
//             backgroundColor: "#B3E5FC", // Pale blue for ovulation
//             borderRadius: 16,
//           },
//           text: {
//             color: "black",
//           },
//         },
//       };
//       currentDate = addDays(currentDate, 1);
//     }

//     // Upcoming periods (next 3 cycles - light pink background)
//     for (let i = 1; i <= 3; i++) {
//       const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
//       const periodEnd = addDays(periodStart, cycleData.periodLength);
//       let currentDate = new Date(periodStart);
//       while (isBefore(currentDate, periodEnd)) {
//         const dateStr = format(currentDate, "yyyy-MM-dd");
//         marked[dateStr] = {
//           customStyles: {
//             container: {
//               backgroundColor: "#F4C2C2", // Light pink for upcoming periods
//               borderRadius: 16,
//             },
//             text: {
//               color: "#FF3B30",
//             },
//           },
//         };
//         currentDate = addDays(currentDate, 1);
//       }
//     }

//     setMarkedDates(marked);
//   }, [cycleData]);

//   const onDayPress = (day: any) => {
//     setSelectedDate(day.dateString);
//   };

//   const renderDayDetails = () => {
//     if (!selectedDate || !cycleData) return null;

//     const date = parseISO(selectedDate);
//     let details = [];

//     const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
//     const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

//     // Check if it's in past period (lastPeriodDate2)
//     if (lastPeriod2) {
//       const periodEndDate2 = addDays(lastPeriod2, cycleData.periodLength);
//       if (isAfter(date, lastPeriod2) && isBefore(date, periodEndDate2)) {
//         details.push("Past menstrual day");
//       }
//     }

//     // Check if it's in current period (lastPeriodDate1)
//     const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
//     if (isAfter(date, lastPeriod1) && isBefore(date, periodEndDate1)) {
//       details.push("Current menstrual day");
//     }

//     // Check if it's an ovulation day
//     const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
//     const ovulationStart = addDays(nextPeriodStart, -14);
//     const ovulationEnd = addDays(ovulationStart, 3);
//     if (isAfter(date, ovulationStart) && isBefore(date, ovulationEnd)) {
//       details.push("Ovulation window");
//     }

//     // Check if it's an upcoming period day
//     for (let i = 1; i <= 3; i++) {
//       const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
//       const periodEnd = addDays(periodStart, cycleData.periodLength);
//       if (isAfter(date, periodStart) && isBefore(date, periodEnd)) {
//         details.push(`Predicted period day (Cycle ${i})`);
//         break;
//       }
//     }

//     return (
//       <View style={styles.detailsContainer}>
//         <Text style={styles.detailsTitle}>{format(date, "MMMM do, yyyy")}</Text>
//         {details.length > 0 ? (
//           details.map((detail, index) => (
//             <Text key={index} style={styles.detailText}>• {detail}</Text>
//           ))
//         ) : (
//           <Text style={styles.detailText}>No cycle events this day</Text>
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//         <Text style={styles.loadingText}>Loading your cycle data...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Please sign in to view your cycle calendar</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Your Cycle Calendar</Text>
//       <CalendarList
//         onDayPress={onDayPress}
//         markedDates={markedDates}
//         markingType={"custom"}
//         pastScrollRange={6} // Allow scrolling back 6 months
//         futureScrollRange={6} // Allow scrolling forward 6 months
//         scrollEnabled={true}
//         showScrollIndicator={true}
//         theme={{
//           backgroundColor: "#ffffff",
//           calendarBackground: "#ffffff",
//           textSectionTitleColor: "#6C63FF",
//           selectedDayBackgroundColor: "#6C63FF",
//           selectedDayTextColor: "#ffffff",
//           todayTextColor: "#6C63FF",
//           dayTextColor: "#2d4150",
//           textDisabledColor: "#d9e1e8",
//           dotColor: "#6C63FF",
//           selectedDotColor: "#ffffff",
//           arrowColor: "#6C63FF",
//           monthTextColor: "#6C63FF",
//           indicatorColor: "#6C63FF",
//           textDayFontWeight: "500",
//           textMonthFontWeight: "bold",
//           textDayHeaderFontWeight: "500",
//           textDayFontSize: 14,
//           textMonthFontSize: 18,
//           textDayHeaderFontSize: 14,
//         }}
//         style={styles.calendar}
//       />
//       <View style={styles.legendContainer}>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: "#FF3B30" }]} />
//           <Text style={styles.legendText}>Current Period</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: "#F4C2C2" }]} />
//           <Text style={styles.legendText}>Upcoming Period</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendColor, { backgroundColor: "#B3E5FC" }]} />
//           <Text style={styles.legendText}>Ovulation</Text>
//         </View>
//         {cycleData?.lastPeriodDate2 && (
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, { backgroundColor: "#FFC0CB" }]} />
//             <Text style={styles.legendText}>Past Period</Text>
//           </View>
//         )}
//       </View>
//       {renderDayDetails()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#6C63FF",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 20,
//     color: "#6C63FF",
//   },
//   calendar: {
//     marginBottom: 20,
//   },
//   legendContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-around",
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   legendColor: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   legendText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   detailsContainer: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   detailsTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   detailText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 5,
//   },
// });

// export default CalendarScreen;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { addDays, format, isBefore, isAfter, isEqual } from "date-fns";
import { parseISO } from "date-fns/parseISO";
//import { addDays, format, isBefore, isAfter, parseISO, isEqual } from "date-fns";

const db = getFirestore();
const auth = getAuth();

interface UserCycleData {
  userId: string;
  lastPeriodDate1: Timestamp | Date;
  lastPeriodDate2: Timestamp | Date | null;
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
  const toDate = (timestamp: Timestamp | Date | null | undefined): Date => {
    if (!timestamp) return new Date();
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  };

  // Calculate and set marked dates
  useEffect(() => {
    if (!cycleData || !user) return;

    const today = new Date();
    const marked: Record<string, any> = {};
    const periodLength = cycleData?.periodLength || 5;
    const cycleLength = cycleData?.cycleLength || 28;

    marked[format(today, "yyyy-MM-dd")] = {
      customStyles: {
        container: {
          backgroundColor: "#EDEDED",
          borderRadius: 16,
        },
        text: {
          color: "black",
          fontWeight: "bold",
        },
      },
    };


    // Get dates from cycle data
    const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
    const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

    // Mark past periods (from lastPeriodDate2 if available)
    // Update your date comparison logic in the marked dates useEffect:
if (lastPeriod2) {
  const periodEndDate2 = addDays(lastPeriod2, periodLength);
  let currentDate = new Date(lastPeriod2);
  
  // Include equality checks
  while (isBefore(currentDate, periodEndDate2) || isEqual(currentDate, periodEndDate2)) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    marked[dateStr] = {
      customStyles: {
        container: {
          backgroundColor: "#FFC0CB", // Red for current period
          borderRadius: 16,
        },
        text: {
          color: "black",
        },
      },
    };
    currentDate = addDays(currentDate, 1);
  }
}

    // Current period (from lastPeriodDate1)
    const periodEndDate1 = addDays(lastPeriod1, cycleData.periodLength);
    if (isBefore(today, periodEndDate1)) {
      let currentDate = new Date(lastPeriod1);
      while (isBefore(currentDate, periodEndDate1)) {
        const dateStr = format(currentDate, "yyyy-MM-dd");
        marked[dateStr] = {
          customStyles: {
            container: {
              backgroundColor: "#FF3B30", // Red for current period
              borderRadius: 16,
            },
            text: {
              color: "white",
            },
          },
        };
        currentDate = addDays(currentDate, 1);
      }
    }

    // Ovulation (pale blue)
    const nextPeriodStart = addDays(lastPeriod1, cycleData.cycleLength);
    const ovulationStart = addDays(nextPeriodStart, -14);
    const ovulationEnd = addDays(ovulationStart, 3);
    let currentDate = new Date(ovulationStart);
    while (isBefore(currentDate, ovulationEnd)) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      marked[dateStr] = {
        customStyles: {
          container: {
            backgroundColor: "#B3E5FC", // Pale blue for ovulation
            borderRadius: 16,
          },
          text: {
            color: "black",
          },
        },
      };
      currentDate = addDays(currentDate, 1);
    }

    // Upcoming periods (next 3 cycles - light pink background)
    for (let i = 1; i <= 3; i++) {
      const periodStart = addDays(lastPeriod1, cycleData.cycleLength * i);
      const periodEnd = addDays(periodStart, cycleData.periodLength);
      let currentDate = new Date(periodStart);
      while (isBefore(currentDate, periodEnd)) {
        const dateStr = format(currentDate, "yyyy-MM-dd");
        marked[dateStr] = {
          customStyles: {
            container: {
              backgroundColor: "#F4C2C2", // Light pink for upcoming periods
              borderRadius: 16,
            },
            text: {
              color: "#FF3B30",
            },
          },
        };
        currentDate = addDays(currentDate, 1);
      }
    }

    setMarkedDates(marked);
  }, [cycleData]);

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const renderDayDetails = () => {
    if (!selectedDate || !cycleData) return null;

    const date = parseISO(selectedDate);
    let details = [];

    const lastPeriod1 = toDate(cycleData.lastPeriodDate1);
    const lastPeriod2 = cycleData.lastPeriodDate2 ? toDate(cycleData.lastPeriodDate2) : null;

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

    // return (
    //   <View style={styles.detailsContainer}>
    //     <Text style={styles.detailsTitle}>{format(date, "MMMM do, yyyy")}</Text>
    //     {details.length > 0 ? (
    //       details.map((detail, index) => (
    //         <Text key={index} style={styles.detailText}>• {detail}</Text>
    //       ))
    //     ) : (
    //       <Text style={styles.detailText}>No cycle events this day</Text>
    //     )}
    //   </View>
    // );
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Cycle Calendar</Text>
      <View style={styles.calendarContainer}>
        {/* Use CalendarList with vertical scrolling */}
        <CalendarList
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType={"custom"}
          // Increase these values for more "infinite" scrolling
          pastScrollRange={24} // Allow scrolling back 24 months (2 years)
          futureScrollRange={24} // Allow scrolling forward 24 months (2 years)
          scrollEnabled={true}
          showScrollIndicator={true}
          calendarHeight={330} // Fixed height for calendar
          horizontal={false} // Vertical scrolling
          pagingEnabled={false} // Disable paging for smoother vertical scroll
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#4B0082",
            selectedDayBackgroundColor: "#4B0082",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#4B0082",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#4B0082",
            selectedDotColor: "#ffffff",
            arrowColor: "#4B0082",
            monthTextColor: "#4B0082",
            indicatorColor: "#4B0082",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 14,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
      {selectedDate ? renderDayDetails() : null}
      <View style={styles.bottomContainer}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#FF3B30" }]} />
            <Text style={styles.legendText}>Current Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#F4C2C2" }]} />
            <Text style={styles.legendText}>Upcoming Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#B3E5FC" }]} />
            <Text style={styles.legendText}>Ovulation</Text>
          </View>
          {cycleData?.lastPeriodDate2 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#FFC0CB" }]} />
              <Text style={styles.legendText}>Past Period</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4B0082",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#4B0082",
  },
  calendarContainer: {
    flex: 1,
    marginBottom: 10,
  },
  bottomContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // changed from "space-around"
    paddingHorizontal: 10, // reduced from 20
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    width: '48%', // limit to 2 items per row
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
  detailsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 100, // Increased margin to ensure content isn't hidden by the legend
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
});

export default CalendarScreen;