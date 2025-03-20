import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
  options: any[]; // Image sources
};

const SymptomTrackerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get date from params or use current date
  const selectedDate = params.date ? new Date(String(params.date)) : new Date();
  const dayOfWeek = selectedDate.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Function to generate the week's days
  const generateWeekDays = (): WeekDay[] => {
    const today = new Date(selectedDate);
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    // Get Monday of the current week
    const monday = new Date(year, month, day - dayOfWeek + 1);
    
    const weekDays: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDays.push({
        day: date.getDate(),
        dayName: dayNames[date.getDay()].substring(0, 3),
        date: date,
        isSelected: i === dayOfWeek - 1 || (dayOfWeek === 0 && i === 6) // Handle Sunday
      });
    }
    
    return weekDays;
  };

  const [weekDays, setWeekDays] = useState<WeekDay[]>(generateWeekDays());

  // Update weekDays whenever the selectedDate changes
  useEffect(() => {
    setWeekDays(generateWeekDays());
  }, [selectedDate]);

  // Symptom categories with their icons
  const symptomCategories: SymptomCategory[] = [
    {
      name: 'Period',
      selected: 1,
      options: [
        require('../../assets/symptoms/medicine.png'),
        require('../../assets/symptoms/blood_2.png'),
        require('../../assets/symptoms/blood.png'),
        require('../../assets/symptoms/blood_3.png')
      ]
    },
    {
      name: 'Feelings',
      selected: 3,
      options: [
        require('../../assets/symptoms/happy.png'),
        require('../../assets/symptoms/worried.png'),
        require('../../assets/symptoms/emotions.png'),
        require('../../assets/symptoms/drunk.png')
      ]
    },
    {
      name: 'Pain',
      selected: null,
      options: [
        require('../../assets/symptoms/pain_1.png'),
        require('../../assets/symptoms/pain_3.png'),
        require('../../assets/symptoms/breast.png'),
        require('../../assets/symptoms/pain_in_joints.png')
      ]
    },
    {
      name: 'Energy',
      selected: null,
      options: [
        require('../../assets/symptoms/lotus.png'),
        require('../../assets/symptoms/corpse.png'),
        require('../../assets/symptoms/extended.png'),
        require('../../assets/symptoms/women.png')
      ]
    },
    {
      name: 'Cravings',
      selected: null,
      options: [
        require('../../assets/symptoms/chips.png'),
        require('../../assets/symptoms/burger.png'),
        require('../../assets/symptoms/curry.png'),
        require('../../assets/symptoms/ice_cream.png')
      ]
    },
    {
      name: 'Skin',
      selected: null,
      options: [
        require('../../assets/symptoms/skin_1.png'),
        require('../../assets/symptoms/skin_2.png'),
        require('../../assets/symptoms/skin_3.png'),
        require('../../assets/symptoms/skin.png')
      ]
    },
    {
      name: 'Exercise',
      selected: null,
      options: [
        require('../../assets/symptoms/dumbbell.png'),
        require('../../assets/symptoms/treadmill.png'),
        require('../../assets/symptoms/yoga_mat.png'),
        require('../../assets/symptoms/rings.png')
      ]
    }
  ];

  const [symptoms, setSymptoms] = useState<SymptomCategory[]>(symptomCategories);

  const handleDaySelect = (index: number): void => {
    const newWeekDays = weekDays.map((day, i) => ({
      ...day,
      isSelected: i === index
    }));
    setWeekDays(newWeekDays);
    // Update selected date and potentially fetch existing data
  };

  // Handle symptom selection
  const handleSymptomSelect = (categoryIndex: number, optionIndex: number): void => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[categoryIndex].selected = 
      updatedSymptoms[categoryIndex].selected === optionIndex ? null : optionIndex;
    setSymptoms(updatedSymptoms);
  };

  // Save symptoms
  const handleSave = (): void => {
    // In a real app, this would save the symptoms to storage/API
    console.log('Saving symptoms for:', selectedDate);
    console.log('Symptoms:', symptoms.map(s => ({ 
      category: s.name, 
      selected: s.selected 
    })));
    
    // Show confirmation toast
    ToastAndroid.show('Symptoms saved successfully!', ToastAndroid.SHORT);

    // Navigate back
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton} 
          accessible={true} 
          accessibilityLabel="Close screen"
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Today, {selectedDate.getDate()} {dayNames[dayOfWeek]}
        </Text>
        <Text style={styles.yearText}>{selectedDate.getFullYear()}</Text>
      </View>
      
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.dayButton, day.isSelected && styles.selectedDay]}
            onPress={() => handleDaySelect(index)}
            accessible={true}
            accessibilityLabel={`Select ${day.dayName}, ${day.day}`}
          >
            <Text style={styles.dayName}>{day.dayName}</Text>
            <Text style={[styles.dayNumber, day.isSelected && styles.selectedDayText]}>
              {day.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView style={styles.symptomsContainer}>
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
                  accessible={true}
                  accessibilityLabel={`Select ${category.name} option`}
                >
                  <Image source={option} style={styles.symptomIcon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessible={true} accessibilityLabel="Save symptoms">
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB', // Light cream/yellow background
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
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAE0',
  },
  dayButton: {
    alignItems: 'center',
    width: 40,
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
    backgroundColor: '#8A2BE2', // Purple for selected day
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayText: {
    color: 'white',
  },
  symptomsContainer: {
    flex: 1,
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
  },
  symptomOption: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedSymptom: {
    borderWidth: 2,
    borderColor: '#8A2BE2', // Purple border for selected symptom
  },
  symptomIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEAE0',
  },
  saveButton: {
    backgroundColor: '#8A2BE2', // Purple button
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