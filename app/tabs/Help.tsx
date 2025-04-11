// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { doc, getDoc, setDoc, collection, addDoc, updateDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import { db, auth } from '../../FirebaseConfig'; // Adjust this import based on your Firebase config path
// import * as Haptics from 'expo-haptics';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../FirebaseConfig';
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
              { image: require('../../assets/symptoms/medicine.png'), label: 'Light' },
              { image: require('../../assets/symptoms/blood_2.png'), label: 'Medium' },
              { image: require('../../assets/symptoms/blood.png'), label: 'Heavy' },
              { image: require('../../assets/symptoms/blood_3.png'), label: 'Spotting' }
            ]
          },
          {
            name: 'Feelings',
            selected: null,
            options: [
              { image: require('../../assets/symptoms/happy.png'), label: 'Happy' },
              { image: require('../../assets/symptoms/worried.png'), label: 'Anxious' },
              { image: require('../../assets/symptoms/emotions.png'), label: 'Mood Swings' },
              { image: require('../../assets/symptoms/drunk.png'), label: 'Sad' }
            ]
          },
          {  
            name: 'Pain',
            selected: null,
            options: [
              { image: require('../../assets/symptoms/pain_1.png'), label: 'Back' },
              { image: require('../../assets/symptoms/pain_3.png'), label: 'Lower Belly' },
              { image: require('../../assets/symptoms/breast.png'), label: 'Breast' },
              { image: require('../../assets/symptoms/pain_in_joints.png'), label: 'Joints' }
            ]
          },
          {
            name: 'Energy',
            selected: null,
            options: [
              { image: require('../../assets/symptoms/lotus.png'), label: 'Zen' },
              { image: require('../../assets/symptoms/corpse.png'), label: 'No Energy' },
              { image: require('../../assets/symptoms/extended.png'), label: 'Good' },
              { image: require('../../assets/symptoms/women.png'), label: 'High'}
            ]
          },
          {
            name: 'Cravings',
            selected: null,
            options: [
              { image: require('../../assets/symptoms/chips.png'), label: 'Salty' },
              { image: require('../../assets/symptoms/burger.png'), label: 'Carbs' },
              { image: require('../../assets/symptoms/curry.png'), label: 'Spicy'} ,
              { image: require('../../assets/symptoms/ice_cream.png'), label: 'Sweet' }
            ]
          },
          {
            name: 'Skin',
            selected: null,
            options: [
              { image: require('../../assets/symptoms/skin_1.png'), label: 'Great' },
              { image: require('../../assets/symptoms/skin_2.png'), label: 'Acne' },
              { image: require('../../assets/symptoms/skin_3.png'), label: 'Oily and Congested' },
              { image: require('../../assets/symptoms/skin.png'), label: 'Rough and Dry' }
            ]
          },
          {
            name: 'Exercise',
            selected: null,
            options: [
              { image: require('../../assets/symptoms/dumbbell.png'), label: 'Weights' },
              { image: require('../../assets/symptoms/treadmill.png'), label: 'Cardio' },
              { image: require('../../assets/symptoms/yoga_mat.png'), label: 'Mat-exercises' },
              { image: require('../../assets/symptoms/rings.png'), label: 'Gymnastics' }
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
      <View style={styles.header}>
        {/* <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#6C63FF" />
        </TouchableOpacity> */}
        <View style={styles.headerDate}>
          <Text style={styles.headerDay}>
            {weekDays.find(day => day.isSelected)?.date.getDate()}
          </Text>
          <View>
            <Text style={styles.headerWeekday}>
              {dayNames[weekDays.find(day => day.isSelected)?.date.getDay() || 0]}
            </Text>
            <Text style={styles.headerYear}>
              {weekDays.find(day => day.isSelected)?.date.getFullYear()}
            </Text>
          </View>
        </View>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>
      
      {/* Weekday selector */}
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
    backgroundColor: '#F8F9FA',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  backButton: {
    padding: 8,
  },
  headerDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerDay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  headerWeekday: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },
  headerYear: {
    fontSize: 14,
    color: '#888',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
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
//           {weekDays.find(day => day.isSelected)?.date.getDate()} {dayNames[weekDays.find(day => day.isSelected)?.date.getDay() || 0]}
//         </Text>
//         <Text style={styles.yearText}>{weekDays.find(day => day.isSelected)?.date.getFullYear()}</Text>
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
//                   accessibilityLabel={`Select ${category.name} option ${optionIndex + 1}`}
//                 >
//                   <Image source={option} style={styles.symptomIcon} />
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>
      
//       <View style={styles.footer}>
//         {saveSuccess && (
//           <View style={styles.saveSuccessContainer}>
//             <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
//             <Text style={styles.saveSuccessText}>Symptoms saved successfully!</Text>
//           </View>
//         )}
//         <TouchableOpacity 
//           style={[styles.saveButton, saving && styles.savingButton]} 
//           onPress={handleSave} 
//           disabled={saving}
//           accessible={true} 
//           accessibilityLabel={saving ? "Saving symptoms" : "Save symptoms"}
//         >
//           {saving ? (
//             <ActivityIndicator color="white" size="small" />
//           ) : (
//             <Text style={styles.saveButtonText}>Save</Text>
//           )}
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFBEB',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#8A2BE2',
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
//   savingButton: {
//     backgroundColor: '#9D5BDB', // Lighter purple when saving
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   saveSuccessContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     backgroundColor: '#E8F5E9',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   saveSuccessText: {
//     color: '#4CAF50',
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '500',
//   }
// });

// export default SymptomTrackerScreen

// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   SafeAreaView, 
//   TouchableOpacity, 
//   ScrollView, 
//   Image 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router';

// type WeekDay = {
//   day: number;
//   dayName: string;
//   date: Date;
//   isSelected: boolean;
// };

// type SymptomOption = {
//   image: any;
//   label: string;
// };

// type SymptomCategory = {
//   name: string;
//   selected: number | null;
//   options: SymptomOption[];
// };

// type SavedSymptom = {
//   category: string;
//   selected: number | null;
// };

// const SymptomTrackerScreen = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
  
//   const selectedDate = params.date ? new Date(String(params.date)) : new Date();
//   const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
//   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   const generateWeekDays = useCallback((): WeekDay[] => {
//     const today = new Date(currentDate);
//     const dayOfWeek = today.getDay();
//     const monday = new Date(today);
//     monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    
//     return Array.from({ length: 7 }, (_, i): WeekDay => {
//       const date = new Date(monday);
//       date.setDate(monday.getDate() + i);
//       return {
//         day: date.getDate(),
//         dayName: dayNames[date.getDay()].substring(0, 3),
//         date,
//         isSelected: date.toDateString() === currentDate.toDateString()
//       };
//     });
//   }, [currentDate]);

//   const [weekDays, setWeekDays] = useState<WeekDay[]>(generateWeekDays());

//   useEffect(() => {
//     setWeekDays(generateWeekDays());
//   }, [generateWeekDays]);

//   const handleDaySelect = useCallback((index: number) => {
//     setCurrentDate(weekDays[index].date);
//   }, [weekDays]);

//   const symptomCategories: SymptomCategory[] = [
//     {
//       name: 'Period',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/medicine.png'), label: 'Light' },
//         { image: require('../../assets/symptoms/blood_2.png'), label: 'Medium' },
//         { image: require('../../assets/symptoms/blood.png'), label: 'Heavy' },
//         { image: require('../../assets/symptoms/blood_3.png'), label: 'Spotting' }
//       ]
//     },
//     {
//       name: 'Feelings',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/happy.png'), label: 'Happy' },
//         { image: require('../../assets/symptoms/worried.png'), label: 'Anxious' },
//         { image: require('../../assets/symptoms/emotions.png'), label: 'Mood Swings' },
//         { image: require('../../assets/symptoms/drunk.png'), label: 'Sad' }
//       ]
//     },
//     {  
//       name: 'Pain',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/pain_1.png'), label: 'Back' },
//         { image: require('../../assets/symptoms/pain_3.png'), label: 'Lower Belly' },
//         { image: require('../../assets/symptoms/breast.png'), label: 'Breast' },
//         { image: require('../../assets/symptoms/pain_in_joints.png'), label: 'Joints' }
//       ]
//     },
//     {
//       name: 'Energy',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/lotus.png'), label: 'Zen' },
//         { image: require('../../assets/symptoms/corpse.png'), label: 'No Energy' },
//         { image: require('../../assets/symptoms/extended.png'), label: 'Good' },
//         { image: require('../../assets/symptoms/women.png'), label: 'High'}
//       ]
//     },
//     {
//       name: 'Cravings',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/chips.png'), label: 'Salty' },
//         { image: require('../../assets/symptoms/burger.png'), label: 'Carbs' },
//         { image: require('../../assets/symptoms/curry.png'), label: 'Spicy'} ,
//         { image: require('../../assets/symptoms/ice_cream.png'), label: 'Sweet' }
//       ]
//     },
//     {
//       name: 'Skin',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/skin_1.png'), label: 'Great' },
//         { image: require('../../assets/symptoms/skin_2.png'), label: 'Acne' },
//         { image: require('../../assets/symptoms/skin_3.png'), label: 'Oily and Congested' },
//         { image: require('../../assets/symptoms/skin.png'), label: 'Rough and Dry' }
//       ]
//     },
//     {
//       name: 'Exercise',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/dumbbell.png'), label: 'Weights' },
//         { image: require('../../assets/symptoms/treadmill.png'), label: 'Cardio' },
//         { image: require('../../assets/symptoms/yoga_mat.png'), label: 'Mat-exercises' },
//         { image: require('../../assets/symptoms/rings.png'), label: 'Gymnastics' }
//       ]
//     }
//   ];

//   const [symptoms, setSymptoms] = useState<SymptomCategory[]>(symptomCategories);

//   const handleSymptomSelect = useCallback((categoryIndex: number, optionIndex: number) => {
//     setSymptoms(prev => prev.map((cat, i) => 
//       i === categoryIndex 
//         ? { ...cat, selected: cat.selected === optionIndex ? null : optionIndex } 
//         : cat
//     ));
//   }, []);

//   const handleSave = () => {
//     console.log('Symptoms data:', {
//       date: currentDate,
//       symptoms: symptoms.map(s => ({ name: s.name, selected: s.selected }))
//     });
//     router.back();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="close" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           {dayNames[currentDate.getDay()]}, {currentDate.getDate()} {currentDate.toLocaleString('default', { month: 'short' })}
//         </Text>
//         <Text style={styles.yearText}>{currentDate.getFullYear()}</Text>
//       </View>
      
//       {/* Week Calendar - Your preferred layout */}
//       <View style={styles.weekScrollContainer}>
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.weekContainer}
//         >
//           {weekDays.map((day, index) => (
//             <TouchableOpacity 
//               key={index}
//               style={[styles.dayButton, day.isSelected && styles.selectedDay]}
//               onPress={() => handleDaySelect(index)}
//             >
//               <Text style={styles.dayName}>{day.dayName}</Text>
//               <Text style={[styles.dayNumber, day.isSelected && styles.selectedDayText]}>
//                 {day.day}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>
      
//       {/* Symptoms List - Your preferred layout */}
//       <ScrollView 
//         style={styles.symptomsScrollView}
//         contentContainerStyle={styles.symptomsContainer}
//       >
//         {symptoms.map((category, categoryIndex) => (
//           <View key={`${category.name}-${categoryIndex}`} style={styles.categoryContainer}>
//             <Text style={styles.categoryName}>{category.name}</Text>
//             <View style={styles.optionsRow}>
//               {category.options.map((option, optionIndex) => (
//                 <TouchableOpacity
//                   key={optionIndex}
//                   style={[styles.symptomOption, category.selected === optionIndex && styles.selectedSymptom]}
//                   onPress={() => handleSymptomSelect(categoryIndex, optionIndex)}
//                 >
//                   <Image source={option.image} style={styles.symptomIcon} />
//                   <Text style={styles.labelText}>{option.label}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>
      
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//           <Text style={styles.saveButtonText}>Save</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFBEB',
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
//   // Week Calendar Styles
//   weekScrollContainer: {
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEAE0',
//   },
//   weekContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//   },
//   dayButton: {
//     alignItems: 'center',
//     width: 40,
//     marginHorizontal: 5,
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
//     backgroundColor: '#8A2BE2',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedDayText: {
//     color: 'white',
//   },
//   // Symptoms List Styles
//   symptomsScrollView: {
//     flex: 1,
//   },
//   symptomsContainer: {
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
//     marginBottom: 15,
//   },
//   symptomOption: {
//     alignItems: 'center',
//     width: 80,
//   },
//   selectedSymptom: {
//     borderWidth: 2,
//     borderColor: '#8A2BE2',
//     borderRadius: 10,
//     padding: 5,
//   },
//   symptomIcon: {
//     width: 50,
//     height: 50,
//     resizeMode: 'contain',
//   },
//   labelText: {
//     fontSize: 12,
//     marginTop: 5,
//     textAlign: 'center',
//   },
//   // Footer Styles
//   footer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#EEEAE0',
//   },
//   saveButton: {
//     backgroundColor: '#8A2BE2',
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

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
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
//   options: { image: any; label: string }[];
// };

// const SymptomTrackerScreen = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const selectedDate = params.date ? new Date(String(params.date)) : new Date();
//   const dayOfWeek = selectedDate.getDay();
//   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   const generateWeekDays = (): WeekDay[] => {
//     const today = new Date(selectedDate);
//     const day = today.getDate();
//     const month = today.getMonth();
//     const year = today.getFullYear();
//     const monday = new Date(year, month, day - dayOfWeek + 1);
    
//     return Array.from({ length: 7 }, (_, i) => {
//       const date = new Date(monday);
//       date.setDate(monday.getDate() + i);
//       return {
//         day: date.getDate(),
//         dayName: dayNames[date.getDay()].substring(0, 3),
//         date: date,
//         isSelected: i === dayOfWeek - 1 || (dayOfWeek === 0 && i === 6)
//       };
//     });
//   };

//   const [weekDays, setWeekDays] = useState<WeekDay[]>(generateWeekDays());
//   useEffect(() => setWeekDays(generateWeekDays()), [selectedDate]);

//   const symptomCategories: SymptomCategory[] = [
//     {
//       name: 'Period',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/medicine.png'), label: 'Light' },
//         { image: require('../../assets/symptoms/blood_2.png'), label: 'Medium' },
//         { image: require('../../assets/symptoms/blood.png'), label: 'Heavy' },
//         { image: require('../../assets/symptoms/blood_3.png'), label: 'Spotting' }
//       ]
//     },
//     {
//       name: 'Feelings',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/happy.png'), label: 'Happy' },
//         { image: require('../../assets/symptoms/worried.png'), label: 'Anxious' },
//         { image: require('../../assets/symptoms/emotions.png'), label: 'Mood Swings' },
//         { image: require('../../assets/symptoms/drunk.png'), label: 'Sad' }
//       ]
//     },
//     {
//       name: 'Pain',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/pain_1.png'), label: 'Back' },
//         { image: require('../../assets/symptoms/pain_3.png'), label: 'Lower Belly' },
//         { image: require('../../assets/symptoms/breast.png'), label: 'Breast' },
//         { image: require('../../assets/symptoms/pain_in_joints.png'), label: 'Joints' }
//       ]
//     },
//     {
//       name: 'Energy',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/lotus.png'), label: 'Zen' },
//         { image: require('../../assets/symptoms/corpse.png'), label: 'No Energy' },
//         { image: require('../../assets/symptoms/extended.png'), label: 'Good' },
//         { image: require('../../assets/symptoms/women.png'), label: 'High'}
//       ]
//     },
//     {
//       name: 'Cravings',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/chips.png'), label: 'Salty' },
//         { image: require('../../assets/symptoms/burger.png'), label: 'Carbs' },
//         { image: require('../../assets/symptoms/curry.png'), label: 'Spicy'} ,
//         { image: require('../../assets/symptoms/ice_cream.png'), label: 'Sweet' }
//       ]
//     },
//     {
//       name: 'Skin',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/skin_1.png'), label: 'Great' },
//         { image: require('../../assets/symptoms/skin_2.png'), label: 'Acne' },
//         { image: require('../../assets/symptoms/skin_3.png'), label: 'Oily and Congested' },
//         { image: require('../../assets/symptoms/skin.png'), label: 'Rough and Dry' }
//       ]
//     },
//     {
//       name: 'Exercise',
//       selected: null,
//       options: [
//         { image: require('../../assets/symptoms/dumbbell.png'), label: 'Weights' },
//         { image: require('../../assets/symptoms/treadmill.png'), label: 'Cardio' },
//         { image: require('../../assets/symptoms/yoga_mat.png'), label: 'Mat-exercises' },
//         { image: require('../../assets/symptoms/rings.png'), label: 'Gymnastics' }
//       ]
//     }
//   ];

//   const [symptoms, setSymptoms] = useState<SymptomCategory[]>(symptomCategories);
//   const handleSymptomSelect = (categoryIndex: number, optionIndex: number) => {
//     setSymptoms(symptoms.map((cat, i) => i === categoryIndex ? { ...cat, selected: cat.selected === optionIndex ? null : optionIndex } : cat));
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="close" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Today, {selectedDate.getDate()} {dayNames[dayOfWeek]}</Text>
//       </View>

//       <ScrollView style={styles.symptomsContainer}>
//         {symptoms.map((category, categoryIndex) => (
//           <View key={categoryIndex} style={styles.categoryContainer}>
//             <Text style={styles.categoryName}>{category.name}</Text>
//             <View style={styles.optionsRow}>
//               {category.options.map((option, optionIndex) => (
//                 <TouchableOpacity key={optionIndex} style={[styles.symptomOption, category.selected === optionIndex && styles.selectedSymptom]} onPress={() => handleSymptomSelect(categoryIndex, optionIndex)}>
//                   <Image source={option.image} style={styles.symptomIcon} />
//                   <Text style={styles.labelText}>{option.label}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFFBEB' },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
//   backButton: { padding: 8 },
//   headerText: { fontSize: 16, fontWeight: '600' },
//   symptomsContainer: { flex: 1, padding: 16 },
//   categoryContainer: { marginBottom: 20 },
//   categoryName: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
//   optionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   symptomOption: { alignItems: 'center', width: 80 },
//   selectedSymptom: { borderWidth: 2, borderColor: '#8A2BE2', borderRadius: 10 },
//   symptomIcon: { width: 50, height: 50, resizeMode: 'contain' },
//   labelText: { fontSize: 12, marginTop: 5, textAlign: 'center' }
// });

// export default SymptomTrackerScreen;
