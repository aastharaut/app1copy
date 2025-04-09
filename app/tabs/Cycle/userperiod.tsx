// // Period Tracker Onboarding Component
// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './PeriodTrackerOnboarding.css';

// const PeriodTrackerOnboarding = () => {
//   // State management for form data
//   const [formData, setFormData] = useState({
//     lastPeriodStartDate: null,
//     previousPeriodStartDate: null,
//     lastPeriodDuration: 5, // Default duration in days
//     previousPeriodDuration: 5, // Default duration in days
//     isUnsureLastPeriod: false,
//     isUnsurePreviousPeriod: false,
//   });

//   // Error state
//   const [errors, setErrors] = useState({});
  
//   // Validation function
//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.lastPeriodStartDate && !formData.isUnsureLastPeriod) {
//       newErrors.lastPeriodStartDate = "Please select your last period start date or check 'Not sure'";
//     }
    
//     if (formData.previousPeriodStartDate && formData.lastPeriodStartDate) {
//       // Ensure previous period is before last period
//       if (new Date(formData.previousPeriodStartDate) >= new Date(formData.lastPeriodStartDate)) {
//         newErrors.previousPeriodStartDate = "Previous period must be before your last period";
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle date selection for last period
//   const handleLastPeriodDateChange = (date) => {
//     setFormData({
//       ...formData,
//       lastPeriodStartDate: date,
//       isUnsureLastPeriod: false,
//     });
//   };

//   // Handle date selection for previous period
//   const handlePreviousPeriodDateChange = (date) => {
//     setFormData({
//       ...formData,
//       previousPeriodStartDate: date,
//       isUnsurePreviousPeriod: false,
//     });
//   };

//   // Handle duration changes
//   const handleDurationChange = (event, periodType) => {
//     const value = parseInt(event.target.value);
//     setFormData({
//       ...formData,
//       [periodType]: value,
//     });
//   };

//   // Handle "Not sure" checkbox for last period
//   const handleUnsureLastPeriod = (event) => {
//     const checked = event.target.checked;
//     setFormData({
//       ...formData,
//       isUnsureLastPeriod: checked,
//       lastPeriodStartDate: checked ? null : formData.lastPeriodStartDate,
//     });
//   };

//   // Handle "Not sure" checkbox for previous period
//   const handleUnsurePreviousPeriod = (event) => {
//     const checked = event.target.checked;
//     setFormData({
//       ...formData,
//       isUnsurePreviousPeriod: checked,
//       previousPeriodStartDate: checked ? null : formData.previousPeriodStartDate,
//     });
//   };

//   // Form submission handler
//   const handleSubmit = (event) => {
//     event.preventDefault();
    
//     if (validateForm()) {
//       // Calculate prediction range based on data
//       const predictions = calculatePredictions(formData);
      
//       // Here you would typically:
//       // 1. Save the user's data to your database
//       // 2. Navigate to the next step or dashboard
//       // 3. Display their predicted next period
      
//       console.log("Form submitted successfully:", formData);
//       console.log("Predictions:", predictions);
      
//       // Example of calling an API to save data
//       // saveUserData(formData);
      
//       // Example of navigating to next screen
//       // history.push('/dashboard', { predictions });
//     }
//   };

//   // Function to calculate predictions based on provided data
//   const calculatePredictions = (data) => {
//     let cycleLength = 28; // Default cycle length
//     let predictionRange = 3; // Default range in days (±3 days)
    
//     // If we have both period start dates, calculate the cycle length
//     if (data.lastPeriodStartDate && data.previousPeriodStartDate) {
//       const lastDate = new Date(data.lastPeriodStartDate);
//       const prevDate = new Date(data.previousPeriodStartDate);
//       const diffTime = Math.abs(lastDate - prevDate);
//       cycleLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     }
    
//     // If user is unsure about dates, increase the prediction range
//     if (data.isUnsureLastPeriod || data.isUnsurePreviousPeriod) {
//       predictionRange = 5; // Wider range for uncertainty
//     }
    
//     // Calculate the predicted next period start date
//     const nextPeriodDate = new Date(data.lastPeriodStartDate);
//     nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
    
//     // Calculate range dates
//     const earliestDate = new Date(nextPeriodDate);
//     earliestDate.setDate(earliestDate.getDate() - predictionRange);
    
//     const latestDate = new Date(nextPeriodDate);
//     latestDate.setDate(latestDate.getDate() + predictionRange);
    
//     return {
//       predictedDate: nextPeriodDate,
//       earliestDate: earliestDate,
//       latestDate: latestDate,
//       cycleLength: cycleLength,
//       predictionRange: predictionRange
//     };
//   };

//   // Format date to display to user
//   const formatDate = (date) => {
//     if (!date) return "";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="period-tracker-onboarding">
//       <h1>Welcome to Your Period Tracker</h1>
//       <p className="description">
//         Let's set up your personalized tracking. The more information you provide,
//         the more accurate your predictions will be.
//       </p>
      
//       <form onSubmit={handleSubmit}>
//         {/* Last Period Section */}
//         <div className="form-section">
//           <h2>When did your last period start?</h2>
//           <p className="required-field">* Required</p>
          
//           <div className="calendar-container">
//             {!formData.isUnsureLastPeriod && (
//               <>
//                 <Calendar
//                   onChange={handleLastPeriodDateChange}
//                   value={formData.lastPeriodStartDate}
//                   maxDate={new Date()} // Can't select future dates
//                   className={errors.lastPeriodStartDate ? "error-calendar" : ""}
//                 />
//                 {formData.lastPeriodStartDate && (
//                   <p className="selected-date">
//                     Selected: {formatDate(formData.lastPeriodStartDate)}
//                   </p>
//                 )}
//               </>
//             )}
            
//             <div className="checkbox-container">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={formData.isUnsureLastPeriod}
//                   onChange={handleUnsureLastPeriod}
//                 />
//                 I'm not sure about the exact date
//               </label>
//             </div>
            
//             {errors.lastPeriodStartDate && (
//               <p className="error-message">{errors.lastPeriodStartDate}</p>
//             )}
//           </div>
          
//           <div className="duration-container">
//             <label htmlFor="lastPeriodDuration">
//               How many days did it last?
//             </label>
//             <select
//               id="lastPeriodDuration"
//               value={formData.lastPeriodDuration}
//               onChange={(e) => handleDurationChange(e, 'lastPeriodDuration')}
//             >
//               {[...Array(10)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1} {i === 0 ? 'day' : 'days'}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         {/* Previous Period Section */}
//         <div className="form-section">
//           <h2>When did your period before that start?</h2>
//           <p>(Optional, but helps with more accurate predictions)</p>
          
//           <div className="calendar-container">
//             {!formData.isUnsurePreviousPeriod && (
//               <>
//                 <Calendar
//                   onChange={handlePreviousPeriodDateChange}
//                   value={formData.previousPeriodStartDate}
//                   maxDate={formData.lastPeriodStartDate || new Date()} // Can't be after last period
//                   className={errors.previousPeriodStartDate ? "error-calendar" : ""}
//                 />
//                 {formData.previousPeriodStartDate && (
//                   <p className="selected-date">
//                     Selected: {formatDate(formData.previousPeriodStartDate)}
//                   </p>
//                 )}
//               </>
//             )}
            
//             <div className="checkbox-container">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={formData.isUnsurePreviousPeriod}
//                   onChange={handleUnsurePreviousPeriod}
//                 />
//                 I'm not sure about the exact date
//               </label>
//             </div>
            
//             {errors.previousPeriodStartDate && (
//               <p className="error-message">{errors.previousPeriodStartDate}</p>
//             )}
//           </div>
          
//           <div className="duration-container">
//             <label htmlFor="previousPeriodDuration">
//               How many days did it last?
//             </label>
//             <select
//               id="previousPeriodDuration"
//               value={formData.previousPeriodDuration}
//               onChange={(e) => handleDurationChange(e, 'previousPeriodDuration')}
//             >
//               {[...Array(10)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1} {i === 0 ? 'day' : 'days'}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <div className="button-container">
//           <button type="submit" className="submit-button">
//             Complete Setup
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// /* PeriodTrackerOnboarding.css */
// .period-tracker-onboarding {
//     max-width: 800px;
//     margin: 0 auto;
//     padding: 20px;
//     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//     color: #333;
//   }
  
//   .period-tracker-onboarding h1 {
//     text-align: center;
//     color: #d23f72;
//     margin-bottom: 10px;
//   }
  
//   .description {
//     text-align: center;
//     margin-bottom: 30px;
//     color: #666;
//   }
  
//   .form-section {
//     background-color: #fff;
//     border-radius: 12px;
//     padding: 20px;
//     margin-bottom: 25px;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   }
  
//   .form-section h2 {
//     color: #d23f72;
//     margin-top: 0;
//     font-size: 1.3em;
//   }
  
//   .required-field {
//     color: #d23f72;
//     font-size: 0.9em;
//     margin-top: -10px;
//     margin-bottom: 15px;
//   }
  
//   .calendar-container {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-bottom: 20px;
//   }
  
//   /* Customize the calendar appearance */
//   .react-calendar {
//     width: 350px;
//     max-width: 100%;
//     border: none;
//     border-radius: 8px;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   }
  
//   .react-calendar__tile--active {
//     background: #d23f72;
//     color: white;
//   }
  
//   .react-calendar__tile--active:enabled:hover,
//   .react-calendar__tile--active:enabled:focus {
//     background: #b22e5e;
//   }
  
//   .error-calendar {
//     border: 2px solid #ff3860;
//   }
  
//   .selected-date {
//     margin-top: 10px;
//     font-weight: bold;
//     color: #d23f72;
//   }
  
//   .checkbox-container {
//     margin: 15px 0;
//     display: flex;
//     align-items: center;
//   }
  
//   .checkbox-container input[type="checkbox"] {
//     margin-right: 10px;
//     transform: scale(1.2);
//   }
  
//   .duration-container {
//     margin: 15px 0;
//     text-align: center;
//   }
  
//   .duration-container label {
//     display: block;
//     margin-bottom: 8px;
//     font-weight: 500;
//   }
  
//   .duration-container select {
//     padding: 8px 12px;
//     border: 1px solid #ddd;
//     border-radius: 6px;
//     font-size: 1em;
//     background-color: white;
//     cursor: pointer;
//   }
  
//   .error-message {
//     color: #ff3860;
//     font-size: 0.9em;
//     margin-top: 5px;
//   }
  
//   .button-container {
//     display: flex;
//     justify-content: center;
//     margin-top: 30px;
//   }
  
//   .submit-button {
//     background-color: #d23f72;
//     color: white;
//     border: none;
//     border-radius: 30px;
//     padding: 12px 40px;
//     font-size: 1.1em;
//     font-weight: bold;
//     cursor: pointer;
//     transition: background-color 0.3s;
//   }
  
//   .submit-button:hover {
//     background-color: #b22e5e;
//   }
  
//   /* Responsive adjustments */
//   @media (max-width: 600px) {
//     .period-tracker-onboarding {
//       padding: 15px;
//     }
    
//     .form-section {
//       padding: 15px;
//     }
    
//     .react-calendar {
//       width: 300px;
//     }
    
//     .submit-button {
//       width: 100%;
//     }
//   }

// export default PeriodTrackerOnboarding;



// components/PeriodOnboardingPopup.tsx
// import React, { useState } from 'react';
// import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// //import { predictCycleLength } from '../lib/aiModel'; // Your trained model

// const PeriodOnboardingPopup = ({ visible, onComplete, userId }) => {
//   const [step, setStep] = useState(1);
//   const [lastPeriod, setLastPeriod] = useState('');
//   const [previousPeriod, setPreviousPeriod] = useState('');
//   const [periodLength, setPeriodLength] = useState(5);

//   const handleSubmit = async () => {
//     // Call your AI model for prediction
//     const predictedCycle = await predictCycleLength({
//       lastPeriodDate: lastPeriod,
//       previousPeriodDate: previousPeriod,
//       periodLength
//     });

//     // Save to Firestore
//     await updateDoc(doc(db, "Users", userId), {
//       'cycleSettings': {
//         lastPeriodDate: new Date(lastPeriod),
//         previousPeriodDate: new Date(previousPeriod),
//         periodLength,
//         predictedCycleLength: predictedCycle.length,
//         predictedPeriodDate: predictedCycle.nextPeriod,
//         predictedOvulationDate: predictedCycle.ovulationDate,
//         currentPhase: predictedCycle.currentPhase,
//         onboardingComplete: true
//       }
//     });

//     onComplete();
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.popup}>
//           {step === 1 && (
//             <>
//               <Text style={styles.title}>When was your last period?</Text>
//               <Calendar
//                 onDayPress={(day) => {
//                   setLastPeriod(day.dateString);
//                   setStep(2);
//                 }}
//                 markedDates={{
//                   [lastPeriod]: { selected: true }
//                 }}
//               />
//             </>
//           )}

//           {step === 2 && (
//             <>
//               <Text style={styles.title}>When was your previous period?</Text>
//               <Calendar
//                 onDayPress={(day) => {
//                   setPreviousPeriod(day.dateString);
//                   setStep(3);
//                 }}
//                 markedDates={{
//                   [previousPeriod]: { selected: true }
//                 }}
//                 maxDate={lastPeriod}
//               />
//               <TouchableOpacity onPress={() => setStep(1)}>
//                 <Text style={styles.backButton}>Back</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {step === 3 && (
//             <>
//               <Text style={styles.title}>How many days does your period usually last?</Text>
//               <View style={styles.daysContainer}>
//                 {[3,4,5,6,7].map(days => (
//                   <TouchableOpacity 
//                     key={days} 
//                     style={[styles.dayButton, periodLength === days && styles.selectedDay]}
//                     onPress={() => setPeriodLength(days)}
//                   >
//                     <Text>{days} days</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               <TouchableOpacity 
//                 style={styles.submitButton}
//                 onPress={handleSubmit}
//                 disabled={!lastPeriod || !previousPeriod}
//               >
//                 <Text style={styles.buttonText}>Calculate My Cycle</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setStep(2)}>
//                 <Text style={styles.backButton}>Back</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   popup: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '90%'
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginVertical: 10
//   },
//   dayButton: {
//     padding: 10,
//     margin: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5
//   },
//   selectedDay: {
//     backgroundColor: '#8A2BE2',
//     borderColor: '#8A2BE2'
//   },
//   submitButton: {
//     backgroundColor: '#8A2BE2',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   backButton: {
//     color: '#8A2BE2',
//     marginTop: 10,
//     textAlign: 'center'
//   }
// });

// export default PeriodOnboardingPopup;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Alert,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { getFirestore, doc, updateDoc } from "firebase/firestore";
// import { auth } from "../../FirebaseConfig";

// export default function UserPeriodScreen() {
//   const router = useRouter();
//   const db = getFirestore();

//   const [lastPeriodDate1, setLastPeriodDate1] = useState(new Date());
//   const [lastPeriodDate2, setLastPeriodDate2] = useState(new Date());
//   const [showPicker1, setShowPicker1] = useState(false);
//   const [showPicker2, setShowPicker2] = useState(false);
//   const [periodLength, setPeriodLength] = useState("");

//   const calculateNextPeriodDate = (lastDate: Date, avgLength: number) => {
//     const next = new Date(lastDate);
//     next.setDate(next.getDate() + avgLength);
//     return next;
//   };

//   const calculateOvulationDate = (nextPeriodDate: Date) => {
//     const ovulation = new Date(nextPeriodDate);
//     ovulation.setDate(ovulation.getDate() - 14); // Assuming luteal phase = 14 days
//     return ovulation;
//   };

//   const handleSubmit = async () => {
//     if (!periodLength || isNaN(Number(periodLength))) {
//       Alert.alert("Invalid Input", "Please enter a valid period length.");
//       return;
//     }

//     const avgLength = Number(periodLength);
//     const mostRecentPeriod = lastPeriodDate1 > lastPeriodDate2 ? lastPeriodDate1 : lastPeriodDate2;
//     const nextPeriod = calculateNextPeriodDate(mostRecentPeriod, avgLength);
//     const ovulation = calculateOvulationDate(nextPeriod);

//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, {
//           lastPeriodDate1,
//           lastPeriodDate2,
//           periodLength: avgLength,
//           predictedNextPeriodDate: nextPeriod,
//           predictedOvulationDate: ovulation,
//         });
//         router.replace("/Navigation/cycle");
//       }
//     } catch (err) {
//       Alert.alert("Error", "Failed to save data.");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.header}>Track Your Period</Text>

//         <Text style={styles.label}>Last Period Date 1</Text>
//         <TouchableOpacity onPress={() => setShowPicker1(true)} style={styles.inputContainer}>
//           <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
//           <Text style={styles.inputText}>
//             {lastPeriodDate1.toDateString()}
//           </Text>
//         </TouchableOpacity>
//         {showPicker1 && (
//           <DateTimePicker
//             value={lastPeriodDate1}
//             mode="date"
//             display="default"
//             maximumDate={new Date()}
//             onChange={(event, selectedDate) => {
//               setShowPicker1(false);
//               if (selectedDate) setLastPeriodDate1(selectedDate);
//             }}
//           />
//         )}

//         <Text style={styles.label}>Last Period Date 2</Text>
//         <TouchableOpacity onPress={() => setShowPicker2(true)} style={styles.inputContainer}>
//           <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
//           <Text style={styles.inputText}>
//             {lastPeriodDate2.toDateString()}
//           </Text>
//         </TouchableOpacity>
//         {showPicker2 && (
//           <DateTimePicker
//             value={lastPeriodDate2}
//             mode="date"
//             display="default"
//             maximumDate={new Date()}
//             onChange={(event, selectedDate) => {
//               setShowPicker2(false);
//               if (selectedDate) setLastPeriodDate2(selectedDate);
//             }}
//           />
//         )}

//         <Text style={styles.label}>Average Cycle Length (in days)</Text>
//         <View style={styles.inputContainer}>
//           <Ionicons name="repeat-outline" size={20} color="#fff" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. 28"
//             placeholderTextColor="#CCC"
//             keyboardType="number-pad"
//             value={periodLength}
//             onChangeText={setPeriodLength}
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSubmit}
//         >
//           <Text style={styles.submitText}>Continue</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#4B0082",
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingTop: 60,
//   },
//   header: {
//     fontSize: 28,
//     color: "#FFF",
//     fontWeight: "bold",
//     marginBottom: 30,
//     textAlign: "center",
//   },
//   label: {
//     fontSize: 16,
//     color: "#E0C2FF",
//     marginBottom: 10,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#6E29B5",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     height: 55,
//     marginBottom: 20,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     color: "#FFF",
//     fontSize: 16,
//     height: "100%",
//   },
//   inputText: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   submitButton: {
//     backgroundColor: "#8A2BE2",
//     height: 55,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 30,
//   },
//   submitText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   Alert,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { getFirestore, doc, updateDoc } from "firebase/firestore";
// import { auth } from "../../FirebaseConfig";

// export default function UserPeriodScreen() {
//   const router = useRouter();
//   const db = getFirestore();

//   const [lastPeriodDate1, setLastPeriodDate1] = useState(new Date());
//   const [lastPeriodDate2, setLastPeriodDate2] = useState(new Date());
//   const [showPicker1, setShowPicker1] = useState(false);
//   const [showPicker2, setShowPicker2] = useState(false);
//   const [periodLength, setPeriodLength] = useState("");
//   const [cycleLength, setCycleLength] = useState(28); // Default cycle length

//   // Calculate cycle length whenever period dates change
//   useEffect(() => {
//     calculateCycleLength();
//   }, [lastPeriodDate1, lastPeriodDate2]);

//   // Calculate cycle length based on the two provided dates
//   const calculateCycleLength = () => {
//     const date1 = new Date(lastPeriodDate1);
//     const date2 = new Date(lastPeriodDate2);
    
//     // Ensure date1 is the more recent date
//     if (date1 > date2) {
//       const diffTime = Math.abs(date1.getTime() - date2.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       setCycleLength(diffDays);
//     } else if (date2 > date1) {
//       const diffTime = Math.abs(date2.getTime() - date1.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       setCycleLength(diffDays);
//     }
//   };

//   // Calculate next period date based on the most recent period and cycle length
//   const calculateNextPeriodDate = () => {
//     // Determine most recent period date
//     const mostRecentDate = lastPeriodDate1 > lastPeriodDate2 ? lastPeriodDate1 : lastPeriodDate2;
//     const nextPeriod = new Date(mostRecentDate);
//     nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
//     return nextPeriod;
//   };

//    // Calculate ovulation date (typically 14 days before next period)
//    const calculateOvulationDate = (nextPeriodDate: Date): Date => {
//     const ovulation = new Date(nextPeriodDate);
//     ovulation.setDate(ovulation.getDate() - 14); // Standard luteal phase is ~14 days
//     return ovulation;
//   };

//   // Calculate current cycle day and phase
//   const calculateCurrentCycleInfo = () => {
//     const today = new Date();
//     const mostRecentDate = lastPeriodDate1 > lastPeriodDate2 ? lastPeriodDate1 : lastPeriodDate2;
//     const diffTime = Math.abs(today.getTime() - mostRecentDate.getTime());
//     let currentCycleDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 is first day of period
    
//     // Adjust if we're beyond the expected cycle length
//     if (currentCycleDay > cycleLength) {
//       currentCycleDay = currentCycleDay % cycleLength;
//       if (currentCycleDay === 0) currentCycleDay = cycleLength;
//     }
    
//     // Determine the current phase
//     const periodLengthNum = Number(periodLength) || 5; // Default to 5 if not provided
//     let currentPhase = "";
    
//     if (currentCycleDay <= periodLengthNum) {
//       currentPhase = "Menstrual Phase";
//     } else if (currentCycleDay <= cycleLength - 14) {
//       currentPhase = "Follicular Phase";
//     } else if (currentCycleDay <= cycleLength - 10) {
//       currentPhase = "Ovulatory Phase";
//     } else {
//       currentPhase = "Luteal Phase";
//     }
    
//     return { currentCycleDay, currentPhase };
//   };

//   const handleSubmit = async () => {
//     if (!periodLength || isNaN(Number(periodLength))) {
//       Alert.alert("Invalid Input", "Please enter a valid period length.");
//       return;
//     }

//     const periodLengthNum = Number(periodLength);
//     if (periodLengthNum <= 0 || periodLengthNum > 15) {
//       Alert.alert("Invalid Input", "Period length should be between 1 and 15 days.");
//       return;
//     }

//     const nextPeriod = calculateNextPeriodDate();
//     const ovulation = calculateOvulationDate(nextPeriod);
//     const { currentCycleDay, currentPhase } = calculateCurrentCycleInfo();

//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const userRef = doc(db, "users", user.uid);
//         await updateDoc(userRef, {
//           lastPeriodDate1,
//           lastPeriodDate2,
//           periodLength: periodLengthNum,
//           cycleLength,
//           predictedNextPeriodDate: nextPeriod,
//           predictedOvulationDate: ovulation,
//           currentCycleDay,
//           currentPhase,
//           lastUpdated: new Date()
//         });
//         router.replace("/Navigation/cycle");
//       }
//     } catch (err) {
//       console.error("Error updating user data:", err);
//       Alert.alert("Error", "Failed to save data.");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.header}>Track Your Period</Text>

//         <Text style={styles.label}>Most Recent Period Start Date</Text>
//         <TouchableOpacity onPress={() => setShowPicker1(true)} style={styles.inputContainer}>
//           <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
//           <Text style={styles.inputText}>
//             {lastPeriodDate1.toDateString()}
//           </Text>
//         </TouchableOpacity>
//         {showPicker1 && (
//           <DateTimePicker
//             value={lastPeriodDate1}
//             mode="date"
//             display="default"
//             maximumDate={new Date()}
//             onChange={(event, selectedDate) => {
//               setShowPicker1(false);
//               if (selectedDate) setLastPeriodDate1(selectedDate);
//             }}
//           />
//         )}

//         <Text style={styles.label}>Previous Period Start Date</Text>
//         <TouchableOpacity onPress={() => setShowPicker2(true)} style={styles.inputContainer}>
//           <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
//           <Text style={styles.inputText}>
//             {lastPeriodDate2.toDateString()}
//           </Text>
//         </TouchableOpacity>
//         {showPicker2 && (
//           <DateTimePicker
//             value={lastPeriodDate2}
//             mode="date"
//             display="default"
//             maximumDate={new Date()}
//             onChange={(event, selectedDate) => {
//               setShowPicker2(false);
//               if (selectedDate) setLastPeriodDate2(selectedDate);
//             }}
//           />
//         )}

//         <Text style={styles.label}>Period Length (in days)</Text>
//         <View style={styles.inputContainer}>
//           <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. 5"
//             placeholderTextColor="#CCC"
//             keyboardType="number-pad"
//             value={periodLength}
//             onChangeText={setPeriodLength}
//           />
//         </View>

//         <View style={styles.cycleInfoContainer}>
//           <Text style={styles.cycleInfoText}>
//             Estimated cycle length: {cycleLength} days
//           </Text>
//           <Text style={styles.cycleInfoSubtext}>
//             (Calculated from your provided period dates)
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSubmit}
//         >
//           <Text style={styles.submitText}>Continue</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#121212",
//   },
//   scrollContainer: {
//     padding: 20,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 30,
//     textAlign: "center",
//   },
//   label: {
//     fontSize: 16,
//     color: "#fff",
//     marginBottom: 8,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#333",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     marginBottom: 20,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     color: "#fff",
//     fontSize: 16,
//   },
//   inputText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   cycleInfoContainer: {
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     padding: 12,
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   cycleInfoText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   cycleInfoSubtext: {
//     color: "#ccc",
//     fontSize: 12,
//     marginTop: 4,
//   },
//   submitButton: {
//     backgroundColor: "#FF6B6B",
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, updateDoc } from "firebase/firestore";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../FirebaseConfig'; // Import from your config file

export default function UserPeriodScreen() {
  const router = useRouter();
  const db = getFirestore();

  const [lastPeriodDate1, setLastPeriodDate1] = useState(new Date());
  const [lastPeriodDate2, setLastPeriodDate2] = useState(new Date());
  const [showPicker1, setShowPicker1] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);
  const [periodLength, setPeriodLength] = useState("");
  const [cycleLength, setCycleLength] = useState(28); // Default cycle length

  // Calculate cycle length whenever period dates change
  useEffect(() => {
    calculateCycleLength();
  }, [lastPeriodDate1, lastPeriodDate2]);

  // Calculate cycle length based on the two provided dates
  const calculateCycleLength = () => {
    const date1 = new Date(lastPeriodDate1);
    const date2 = new Date(lastPeriodDate2);
    
    // Ensure date1 is the more recent date
    if (date1 > date2) {
      const diffTime = Math.abs(date1.getTime() - date2.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCycleLength(diffDays);
    } else if (date2 > date1) {
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCycleLength(diffDays);
    }
  };

  // Calculate next period date based on the most recent period and cycle length
  const calculateNextPeriodDate = () => {
    // Determine most recent period date
    const mostRecentDate = lastPeriodDate1 > lastPeriodDate2 ? lastPeriodDate1 : lastPeriodDate2;
    const nextPeriod = new Date(mostRecentDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
    return nextPeriod;
  };

  // Calculate ovulation date (typically 14 days before next period)
  const calculateOvulationDate = (nextPeriodDate: Date): Date => {
    const ovulation = new Date(nextPeriodDate);
    ovulation.setDate(ovulation.getDate() - 14); // Standard luteal phase is ~14 days
    return ovulation;
  };

  // Calculate current cycle day and phase
  const calculateCurrentCycleInfo = () => {
    const today = new Date();
    const mostRecentDate = lastPeriodDate1 > lastPeriodDate2 ? lastPeriodDate1 : lastPeriodDate2;
    const diffTime = Math.abs(today.getTime() - mostRecentDate.getTime());
    let currentCycleDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 is first day of period
    
    // Adjust if we're beyond the expected cycle length
    if (currentCycleDay > cycleLength) {
      currentCycleDay = currentCycleDay % cycleLength;
      if (currentCycleDay === 0) currentCycleDay = cycleLength;
    }
    
    // Determine the current phase
    const periodLengthNum = Number(periodLength) || 5; // Default to 5 if not provided
    let currentPhase = "";
    
    if (currentCycleDay <= periodLengthNum) {
      currentPhase = "Menstrual Phase";
    } else if (currentCycleDay <= cycleLength - 14) {
      currentPhase = "Follicular Phase";
    } else if (currentCycleDay <= cycleLength - 10) {
      currentPhase = "Ovulatory Phase";
    } else {
      currentPhase = "Luteal Phase";
    }
    
    return { currentCycleDay, currentPhase };
  };

  const handleSubmit = async () => {
    if (!periodLength || isNaN(Number(periodLength))) {
      Alert.alert("Invalid Input", "Please enter a valid period length.");
      return;
    }

    const periodLengthNum = Number(periodLength);
    if (periodLengthNum <= 0 || periodLengthNum > 15) {
      Alert.alert("Invalid Input", "Period length should be between 1 and 15 days.");
      return;
    }

    const nextPeriod = calculateNextPeriodDate();
    const ovulation = calculateOvulationDate(nextPeriod);
    const { currentCycleDay, currentPhase } = calculateCurrentCycleInfo();
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      // SAFE DOCUMENT UPDATE (key fix: uses setDoc + merge)
      await setDoc(
        doc(db, "users", user.uid), // Consistent with signup.tsx ("users" lowercase)
        {
          // Period data
          lastPeriodDate1,
          lastPeriodDate2,
          periodLength: periodLengthNum,
          cycleLength,
          
          // Calculated fields
          predictedNextPeriodDate: nextPeriod,
          predictedOvulationDate: ovulation,
          currentCycleDay,
          currentPhase,
          
          // Metadata
          isProfileComplete: true, // Mark onboarding complete
          lastUpdated: serverTimestamp() // Better than new Date()
        },
        { merge: true } //Critical: merges with existing doc
      );
  
      router.replace("/Navigation/cycle");
    } catch (err) {
      console.error("Firebase update error:", err);
      Alert.alert("Error", "Failed to save data.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Track Your Period</Text>

        <Text style={styles.label}>Most Recent Period Start Date</Text>
        <TouchableOpacity onPress={() => setShowPicker1(true)} style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.inputText}>
            {lastPeriodDate1.toDateString()}
          </Text>
        </TouchableOpacity>
        {showPicker1 && (
          <DateTimePicker
            value={lastPeriodDate1}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowPicker1(false);
              if (selectedDate) setLastPeriodDate1(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Previous Period Start Date</Text>
        <TouchableOpacity onPress={() => setShowPicker2(true)} style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.inputText}>
            {lastPeriodDate2.toDateString()}
          </Text>
        </TouchableOpacity>
        {showPicker2 && (
          <DateTimePicker
            value={lastPeriodDate2}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowPicker2(false);
              if (selectedDate) setLastPeriodDate2(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Period Length (in days)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. 5"
            placeholderTextColor="#CCC"
            keyboardType="number-pad"
            value={periodLength}
            onChangeText={setPeriodLength}
          />
        </View>

        <View style={styles.cycleInfoContainer}>
          <Text style={styles.cycleInfoText}>
            Estimated cycle length: {cycleLength} days
          </Text>
          <Text style={styles.cycleInfoSubtext}>
            (Calculated from your provided period dates)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  inputText: {
    color: "#fff",
    fontSize: 16,
  },
  cycleInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  cycleInfoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  cycleInfoSubtext: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});