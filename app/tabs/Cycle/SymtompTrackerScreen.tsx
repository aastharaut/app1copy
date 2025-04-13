// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ToastAndroid } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router';

// // Type definitions
// type WeekDay = {
//   day: number;
//   dayName: string;
//   date: Date;
//   isSelected: boolean;
// };

// type SymptomCategory = {
//   name: string;
//   selected: number | null;
//   options: any[]; // Image sources
// };

// const SymptomTrackerScreen = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
  
//   // Get date from params or use current date
//   const selectedDate = params.date ? new Date(String(params.date)) : new Date();
//   const dayOfWeek = selectedDate.getDay();
//   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   // Function to generate the week's days
//   const generateWeekDays = (): WeekDay[] => {
//     const today = new Date(selectedDate);
//     const day = today.getDate();
//     const month = today.getMonth();
//     const year = today.getFullYear();
    
//     // Get Monday of the current week
//     const monday = new Date(year, month, day - dayOfWeek + 1);
    
//     const weekDays: WeekDay[] = [];
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(monday);
//       date.setDate(monday.getDate() + i);
//       weekDays.push({
//         day: date.getDate(),
//         dayName: dayNames[date.getDay()].substring(0, 3),
//         date: date,
//         isSelected: i === dayOfWeek - 1 || (dayOfWeek === 0 && i === 6) // Handle Sunday
//       });
//     }
    
//     return weekDays;
//   };

//   const [weekDays, setWeekDays] = useState<WeekDay[]>(generateWeekDays());

//   // Update weekDays whenever the selectedDate changes
//   useEffect(() => {
//     // Only update weekDays when selectedDate changes
//     setWeekDays(generateWeekDays());
//   }, [selectedDate]);  // This ensures the weekDays update only when the selectedDate changes
  
//   // Symptom categories with their icons
//   const symptomCategories: SymptomCategory[] = [
//     {
//       name: 'Period',
//       selected: 1,
//       options: [
//         require('../../../assets/symptoms/medicine.png'),
//         require('../../../assets/symptoms/blood_2.png'),
//         require('../../../assets/symptoms/blood.png'),
//         require('../../../assets/symptoms/blood_3.png')
//       ]
//     },
//     {
//       name: 'Feelings',
//       selected: 3,
//       options: [
//         require('../../../assets/symptoms/happy.png'),
//         require('../../../assets/symptoms/worried.png'),
//         require('../../../assets/symptoms/emotions.png'),
//         require('../../../assets/symptoms/drunk.png')
//       ]
//     },
//     {
//       name: 'Pain',
//       selected: null,
//       options: [
//         require('../../../assets/symptoms/pain_1.png'),
//         require('../../../assets/symptoms/pain_3.png'),
//         require('../../../assets/symptoms/breast.png'),
//         require('../../../assets/symptoms/pain_in_joints.png')
//       ]
//     },
//     {
//       name: 'Energy',
//       selected: null,
//       options: [
//         require('../../../assets/symptoms/lotus.png'),
//         require('../../../assets/symptoms/corpse.png'),
//         require('../../../assets/symptoms/extended.png'),
//         require('../../../assets/symptoms/women.png')
//       ]
//     },
//     {
//       name: 'Cravings',
//       selected: null,
//       options: [
//         require('../../../assets/symptoms/chips.png'),
//         require('../../../assets/symptoms/burger.png'),
//         require('../../../assets/symptoms/curry.png'),
//         require('../../../assets/symptoms/ice_cream.png')
//       ]
//     },
//     {
//       name: 'Skin',
//       selected: null,
//       options: [
//         require('../../../assets/symptoms/skin_1.png'),
//         require('../../../assets/symptoms/skin_2.png'),
//         require('../../../assets/symptoms/skin_3.png'),
//         require('../../../assets/symptoms/skin.png')
//       ]
//     },
//     {
//       name: 'Exercise',
//       selected: null,
//       options: [
//         require('../../../assets/symptoms/dumbbell.png'),
//         require('../../../assets/symptoms/treadmill.png'),
//         require('../../../assets/symptoms/yoga_mat.png'),
//         require('../../../assets/symptoms/rings.png')
//       ]
//     }
//   ];

//   const [symptoms, setSymptoms] = useState<SymptomCategory[]>(symptomCategories);

//   const handleDaySelect = (index: number): void => {
//     const newWeekDays = weekDays.map((day, i) => ({
//       ...day,
//       isSelected: i === index
//     }));
//     setWeekDays(newWeekDays);
//     // Update selected date and potentially fetch existing data
//   };

//   // Handle symptom selection
  
//   const handleSymptomSelect = (categoryIndex: number, optionIndex: number): void => {
//     const updatedSymptoms = [...symptoms];
//     const currentSelection = updatedSymptoms[categoryIndex].selected;
    
//     if (currentSelection !== optionIndex) {
//       updatedSymptoms[categoryIndex].selected = optionIndex;
//       setSymptoms(updatedSymptoms);
//     } else {
//       updatedSymptoms[categoryIndex].selected = null;
//       setSymptoms(updatedSymptoms);
//     }
//   };
  
//   // Save symptoms !!!!!!
//   const handleSave = (): void => {
//     // In a real app, this would save the symptoms to storage/API
//     console.log('Saving symptoms for:', selectedDate);
//     console.log('Symptoms:', symptoms.map(s => ({ 
//       category: s.name, 
//       selected: s.selected 
//     })));
    
//     // Navigate back
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => router.back()} 
//           style={styles.backButton} 
//           accessible={true} 
//           accessibilityLabel="Close screen"
//         >
//           <Ionicons name="close" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           Today, {selectedDate.getDate()} {dayNames[dayOfWeek]}
//         </Text>
//         <Text style={styles.yearText}>{selectedDate.getFullYear()}</Text>
//       </View>
      
//       <View style={styles.weekContainer}>
//         {weekDays.map((day, index) => (
//           <TouchableOpacity 
//             key={index} 
//             style={[styles.dayButton, day.isSelected && styles.selectedDay]}
//             onPress={() => handleDaySelect(index)}
//             accessible={true}
//             accessibilityLabel={`Select ${day.dayName}, ${day.day}`}
//           >
//             <Text style={styles.dayName}>{day.dayName}</Text>
//             <Text style={[styles.dayNumber, day.isSelected && styles.selectedDayText]}>
//               {day.day}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
      
//       <ScrollView style={styles.symptomsContainer}>
//         {symptoms.map((category, categoryIndex) => (
//           <View key={categoryIndex} style={styles.categoryContainer}>
//             <Text style={styles.categoryName}>{category.name}</Text>
//             <View style={styles.optionsRow}>
//               {category.options.map((option, optionIndex) => (
//                 <TouchableOpacity 
//                   key={optionIndex}
//                   style={[
//                     styles.symptomOption,
//                     category.selected === optionIndex && styles.selectedSymptom
//                   ]}
//                   onPress={() => handleSymptomSelect(categoryIndex, optionIndex)}
//                   accessible={true}
//                   accessibilityLabel={`Select ${category.name} option`}
//                 >
//                   <Image source={option} style={styles.symptomIcon} />
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>
      
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessible={true} accessibilityLabel="Save symptoms">
//           <Text style={styles.saveButtonText}>Save</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFBEB', // Light cream/yellow background
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEAE0',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   yearText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   weekContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEAE0',
//   },
//   dayButton: {
//     alignItems: 'center',
//     width: 40,
//   },
//   dayName: {
//     fontSize: 12,
//     color: '#888',
//     marginBottom: 5,
//   },
//   dayNumber: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   selectedDay: {
//     backgroundColor: '#8A2BE2', // Purple for selected day
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedDayText: {
//     color: 'white',
//   },
//   symptomsContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   categoryContainer: {
//     marginBottom: 20,
//   },
//   categoryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   optionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   symptomOption: {
//     width: 60,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//     backgroundColor: '#FFF',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   selectedSymptom: {
//     borderWidth: 2,
//     borderColor: '#8A2BE2', // Purple border for selected symptom
//   },
//   symptomIcon: {
//     width: 40,
//     height: 40,
//     resizeMode: 'contain',
//   },
//   footer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEAE0',
//   },
//   saveButton: {
//     backgroundColor: '#8A2BE2', // Purple button
//     borderRadius: 25,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default SymptomTrackerScreen;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../FirebaseConfig';
import * as Haptics from 'expo-haptics';


// Type definitions
type WeekDay = {
  day: number;
  dayName: string;
  date: Date;
  isSelected: boolean;
};

type SymptomCategory = {
  name: string;
  selected: number | null;
  options: {
    image: any; // Use 'any' for require() imports
    label: string;
  }[];
};

type SavedSymptom = {
  category: string;
  selected: number | null;
};
  // Symptom categories with their icons
  const symptomCategoriesData: SymptomCategory[] = [
    {
            name: 'Period',
            selected: null,
            options: [
              { image: require('../../../assets/symptoms/medicine.png'), label: 'Light' },
              { image: require('../../../assets/symptoms/blood_2.png'), label: 'Medium' },
              { image: require('../../../assets/symptoms/blood.png'), label: 'Heavy' },
              { image: require('../../../assets/symptoms/blood_3.png'), label: 'Spotting' }
            ]
          },
          {
            name: 'Feelings',
            selected: null,
            options: [
              { image: require('../../../assets/symptoms/happy.png'), label: 'Happy' },
              { image: require('../../../assets/symptoms/worried.png'), label: 'Anxious' },
              { image: require('../../../assets/symptoms/emotions.png'), label: 'Mood Swings' },
              { image: require('../../../assets/symptoms/drunk.png'), label: 'Sad' }
            ]
          },
          {  
            name: 'Pain',
            selected: null,
            options: [
              { image: require('../../../assets/symptoms/pain_1.png'), label: 'Back' },
              { image: require('../../../assets/symptoms/pain_3.png'), label: 'Lower Belly' },
              { image: require('../../../assets/symptoms/breast.png'), label: 'Breast' },
              { image: require('../../../assets/symptoms/pain_in_joints.png'), label: 'Joints' }
            ]
          },
          {
            name: 'Energy',
            selected: null,
            options: [
              { image: require('../../../assets/symptoms/lotus.png'), label: 'Zen' },
              { image: require('../../../assets/symptoms/corpse.png'), label: 'No Energy' },
              { image: require('../../../assets/symptoms/extended.png'), label: 'Good' },
              { image: require('../../../assets/symptoms/women.png'), label: 'High'}
            ]
          },
          {
            name: 'Cravings',
            selected: null,
            options: [
              { image: require('../../../assets/symptoms/chips.png'), label: 'Salty' },
              { image: require('../../../assets/symptoms/burger.png'), label: 'Carbs' },
              { image: require('../../../assets/symptoms/curry.png'), label: 'Spicy'} ,
              { image: require('../../../assets/symptoms/ice_cream.png'), label: 'Sweet' }
            ]
          },
          {
            name: 'Skin',
            selected: null,
            options: [
              { image: require('../../../assets/symptoms/skin_1.png'), label: 'Great' },
              { image: require('../../../assets/symptoms/skin_2.png'), label: 'Acne' },
              { image: require('../../../assets/symptoms/skin_3.png'), label: 'Oily and Congested' },
              { image: require('../../../assets/symptoms/skin.png'), label: 'Rough and Dry' }
            ]
          },
          {
            name: 'Exercise',
            selected: null,
            options: [
              { image: require('../../../assets/symptoms/dumbbell.png'), label: 'Weights' },
              { image: require('../../../assets/symptoms/treadmill.png'), label: 'Cardio' },
              { image: require('../../../assets/symptoms/yoga_mat.png'), label: 'Mat-exercises' },
              { image: require('../../../assets/symptoms/rings.png'), label: 'Gymnastics' }
            ]
          }
      ];

      const SymptomTrackerScreen = () => {
      const router = useRouter();
      const params = useLocalSearchParams();
        
        // Memoize selected date to prevent unnecessary changes
        const selectedDate = useMemo(() => 
          params.date ? new Date(String(params.date)) : new Date()
        , [params.date]);
      
        const dayNames = useMemo(() => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], []);
      
        // State management
        const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
        const [symptoms, setSymptoms] = useState<SymptomCategory[]>(symptomCategoriesData);
        const [loading, setLoading] = useState<boolean>(false);
        const [saving, setSaving] = useState<boolean>(false);
        const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
        const [selectedDateString, setSelectedDateString] = useState<string>('');

  // Refs for tracking previous values
  const prevSelectedDate = useRef<string>();
  //const prevSymptoms = useRef<SymptomCategory[]>(symptomCategoriesData);

  // Generate week days function
  const generateWeekDays = useMemo(() => (date: Date): WeekDay[] => {
    const today = new Date(date);
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const dayOfWeek = today.getDay();
    
    // Get Monday of the current week
    const monday = new Date(year, month, day - dayOfWeek + 1);
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        day: date.getDate(),
        dayName: dayNames[date.getDay()].substring(0, 3),
        date: date,
        isSelected: i === dayOfWeek - 1 || (dayOfWeek === 0 && i === 6)
      };
    });
  }, [dayNames]);

  // Format date to YYYY-MM-DD for Firestore
  const formatDateForFirestore = useMemo(() => (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

    // Fetch symptom data for the selected date
    const fetchSymptomData = async (dateStr: string) => {
      if (!auth.currentUser) {
        console.error('No user logged in');
        return;
      }
      
      setLoading(true);
      
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'daily_logs', `${userId}_${dateStr}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const updatedSymptoms = [...symptomCategoriesData];
    
          data.symptoms?.forEach((symptom: SavedSymptom) => {
            const categoryIndex = updatedSymptoms.findIndex(s => s.name === symptom.category);
            if (categoryIndex !== -1) {
              updatedSymptoms[categoryIndex].selected = symptom.selected;
            }
          });
    
          setSymptoms(updatedSymptoms);
    
         
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      } finally {
        setLoading(false);
      }
    };
// Initialize and update state
useEffect(() => {
  const dateStr = formatDateForFirestore(selectedDate);
  
  // Only update if date has actually changed
  if (dateStr !== prevSelectedDate.current) {
    setWeekDays(generateWeekDays(selectedDate));
    setSelectedDateString(dateStr);
    fetchSymptomData(dateStr);
    prevSelectedDate.current = dateStr;
  }
}, [selectedDate, formatDateForFirestore, generateWeekDays]);

const handleDaySelect = (index: number): void => {
  const newSelectedDate = new Date(weekDays[index].date);
  const dateStr = formatDateForFirestore(newSelectedDate);
  
  // Only proceed if selecting a different date
  if (dateStr !== selectedDateString) {
    const newWeekDays = weekDays.map((day, i) => ({
      ...day,
      isSelected: i === index
    }));
    
    setWeekDays(newWeekDays);
    setSelectedDateString(dateStr);
    setSymptoms([...symptomCategoriesData]);
    fetchSymptomData(dateStr);
  }
};
const handleSymptomSelect = (categoryIndex: number, optionIndex: number): void => {
  Haptics.selectionAsync();
  
  const updatedSymptoms = [...symptoms];
  const currentSelection = updatedSymptoms[categoryIndex].selected;
  // Store previous symptoms before updating
  //prevSymptoms.current = [...symptoms];
  if (currentSelection !== optionIndex) {
    updatedSymptoms[categoryIndex].selected = optionIndex;
  } else {
    updatedSymptoms[categoryIndex].selected = null;
  }
  
  setSymptoms(updatedSymptoms);
  setSaveSuccess(false);
};

  const handleSave = async (): Promise<void> => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to save symptoms');
      return;
    }
  
    setSaving(true);
    setSaveSuccess(false);
  
    try {
      const userId = auth.currentUser.uid;
      const symptomsToSave = symptoms.map(s => ({
        category: s.name,
        selected: s.selected,
      }));
  
      // Check if Period symptom is selected
      const hasPeriod = symptoms.some(s => s.name === 'Period' && s.selected !== null);
  
      // Save daily log (without any cycle management)
      await setDoc(doc(db, 'daily_logs', `${userId}_${selectedDateString}`), {
        userId,
        date: selectedDateString,
        symptoms: symptomsToSave,
        hasPeriod, // Simple flag for period symptoms
        updatedAt: serverTimestamp(),
      });
  
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Navigate back after a short delay to show success feedback
    setTimeout(() => {
      router.replace('/tabs/Cycle') //if you need specific navigation
    }, 1000);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to save symptoms.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
        <Text style={styles.loadingText}>Loading symptom data...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
    {/* Header with weekday selector */}
    <View style={styles.header}>
      {/* Weekday selector now in header */}
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.dayButton, 
              day.isSelected && styles.selectedDay
            ]}
            onPress={() => handleDaySelect(index)}
          >
            <Text style={[
              styles.dayName,
              day.isSelected && styles.selectedDayName
            ]}>
              {day.dayName}
            </Text>
            <Text style={[
              styles.dayNumber,
              day.isSelected && styles.selectedDayNumber
            ]}>
              {day.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
      
      {/* Symptoms list */}
      <ScrollView 
        style={styles.symptomsContainer}
        contentContainerStyle={styles.symptomsContent}
      >
        {symptoms.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <View style={styles.optionsRow}>
              {category.options.map((option, optionIndex) => (
                <TouchableOpacity 
                  key={optionIndex}
                  style={[
                    styles.symptomOption,
                    category.selected === optionIndex && styles.selectedSymptom
                  ]}
                  onPress={() => handleSymptomSelect(categoryIndex, optionIndex)}
                >
                  <Image 
                    source={option.image} 
                    style={styles.symptomIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Save button */}
      <View style={styles.footer}>
        {saveSuccess && (
          <View style={styles.saveSuccessContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.saveSuccessText}>Symptoms saved successfully!</Text>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.savingButton]} 
          onPress={handleSave} 
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Symptoms</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '500',
  },
  header: {
    backgroundColor: 'white',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 8,
    width: 42,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedDay: {
    backgroundColor: '#6C63FF',
    borderRadius: 21,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayName: {
    color: 'rgba(255,255,255,0.8)',
  },
  selectedDayNumber: {
    color: 'white',
  },
  symptomsContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  symptomsContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoryContainer: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  symptomOption: {
    width: '22%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    padding: 8,
  },
  selectedSymptom: {
    backgroundColor: '#F0EFFF',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  symptomIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingButton: {
    backgroundColor: '#7D76E5',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveSuccessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveSuccessText: {
    color: '#4CAF50',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SymptomTrackerScreen;