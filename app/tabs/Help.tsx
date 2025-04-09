import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type WeekDay = {
  day: number;
  dayName: string;
  date: Date;
  isSelected: boolean;
};

type SymptomCategory = {
  name: string;
  selected: number | null;
  options: { image: any; label: string }[];
};

const SymptomTrackerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const selectedDate = params.date ? new Date(String(params.date)) : new Date();
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const generateWeekDays = useCallback((): WeekDay[] => {
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    
    return Array.from({ length: 7 }, (_, i): WeekDay => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        day: date.getDate(),
        dayName: dayNames[date.getDay()].substring(0, 3),
        date,
        isSelected: date.toDateString() === currentDate.toDateString()
      };
    });
  }, [currentDate]);

  const [weekDays, setWeekDays] = useState<WeekDay[]>(generateWeekDays());

  useEffect(() => {
    setWeekDays(generateWeekDays());
  }, [generateWeekDays]);

  const handleDaySelect = useCallback((index: number) => {
    setCurrentDate(weekDays[index].date);
  }, [weekDays]);

  const symptomCategories: SymptomCategory[] = [
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

  const [symptoms, setSymptoms] = useState<SymptomCategory[]>(symptomCategories);

  const handleSymptomSelect = useCallback((categoryIndex: number, optionIndex: number) => {
    setSymptoms(prev => prev.map((cat, i) => 
      i === categoryIndex 
        ? { ...cat, selected: cat.selected === optionIndex ? null : optionIndex } 
        : cat
    ));
  }, []);

  const handleSave = () => {
    console.log('Symptoms data:', {
      date: currentDate,
      symptoms: symptoms.map(s => ({ name: s.name, selected: s.selected }))
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {dayNames[currentDate.getDay()]}, {currentDate.getDate()} {currentDate.toLocaleString('default', { month: 'short' })}
        </Text>
        <Text style={styles.yearText}>{currentDate.getFullYear()}</Text>
      </View>
      
      {/* Week Calendar - Your preferred layout */}
      <View style={styles.weekScrollContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekContainer}
        >
          {weekDays.map((day, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.dayButton, day.isSelected && styles.selectedDay]}
              onPress={() => handleDaySelect(index)}
            >
              <Text style={styles.dayName}>{day.dayName}</Text>
              <Text style={[styles.dayNumber, day.isSelected && styles.selectedDayText]}>
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Symptoms List - Your preferred layout */}
      <ScrollView 
        style={styles.symptomsScrollView}
        contentContainerStyle={styles.symptomsContainer}
      >
        {symptoms.map((category, categoryIndex) => (
          <View key={`${category.name}-${categoryIndex}`} style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <View style={styles.optionsRow}>
              {category.options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  style={[styles.symptomOption, category.selected === optionIndex && styles.selectedSymptom]}
                  onPress={() => handleSymptomSelect(categoryIndex, optionIndex)}
                >
                  <Image source={option.image} style={styles.symptomIcon} />
                  <Text style={styles.labelText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAE0',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Week Calendar Styles
  weekScrollContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAE0',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  dayButton: {
    alignItems: 'center',
    width: 40,
    marginHorizontal: 5,
  },
  dayName: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayText: {
    color: 'white',
  },
  // Symptoms List Styles
  symptomsScrollView: {
    flex: 1,
  },
  symptomsContainer: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  symptomOption: {
    alignItems: 'center',
    width: 80,
  },
  selectedSymptom: {
    borderWidth: 2,
    borderColor: '#8A2BE2',
    borderRadius: 10,
    padding: 5,
  },
  symptomIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  labelText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  // Footer Styles
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEAE0',
  },
  saveButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SymptomTrackerScreen;

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
