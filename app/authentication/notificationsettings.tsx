import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { saveNotificationPreferences } from '../../api/notifications';
import { useAuth } from '../context/AuthContext'; // Adjust import based on your auth setup

const NotificationSettingsScreen = () => {
  const router = useRouter();
  const { user } = useAuth(); // Adjust based on your authentication setup
  const [masterToggle, setMasterToggle] = useState(true);
  const [phaseToggles, setPhaseToggles] = useState({
    menstruation: true,
    follicular: true,
    ovulation: true,
    fertile: true,
    luteal: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // Load saved preferences here
    // This is a placeholder for actual data loading
  }, []);
  
  const handleMasterToggle = (value: boolean) => {
    setMasterToggle(value);
    // If turning off master, turn off all phases
    if (!value) {
      setPhaseToggles({
        menstruation: false,
        follicular: false,
        ovulation: false,
        fertile: false,
        luteal: false,
      });
    } 
    // If turning on master, don't automatically turn on all phases
  };
  
  const handlePhaseToggle = (phase: string, value: boolean) => {
    setPhaseToggles(prev => ({
      ...prev,
      [phase]: value,
    }));
    
    // If turning on any phase, ensure master is on
    if (value) {
      setMasterToggle(true);
    }
  };
  
  const saveSettings = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    
    setIsSaving(true);
    try {
      await saveNotificationPreferences(
        user.uid,
        masterToggle,
        phaseToggles
      );
      Alert.alert('Success', 'Notification preferences saved!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Notification Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Notifications</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Enable All Notifications</Text>
            <Switch
              value={masterToggle}
              onValueChange={handleMasterToggle}
              trackColor={{ false: '#D1D5DB', true: '#6C63FF' }}
              thumbColor={masterToggle ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cycle Phase Notifications</Text>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Menstrual Phase</Text>
            <Switch
              value={phaseToggles.menstruation}
              onValueChange={(value) => handlePhaseToggle('menstruation', value)}
              disabled={!masterToggle}
              trackColor={{ false: '#D1D5DB', true: '#FF3B30' }}
              thumbColor={phaseToggles.menstruation ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Follicular Phase</Text>
            <Switch
              value={phaseToggles.follicular}
              onValueChange={(value) => handlePhaseToggle('follicular', value)}
              disabled={!masterToggle}
              trackColor={{ false: '#D1D5DB', true: '#5856D6' }}
              thumbColor={phaseToggles.follicular ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Ovulation Phase</Text>
            <Switch
              value={phaseToggles.ovulation}
              onValueChange={(value) => handlePhaseToggle('ovulation', value)}
              disabled={!masterToggle}
              trackColor={{ false: '#D1D5DB', true: '#5AC8FA' }}
              thumbColor={phaseToggles.ovulation ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Fertile Window</Text>
            <Switch
              value={phaseToggles.fertile}
              onValueChange={(value) => handlePhaseToggle('fertile', value)}
              disabled={!masterToggle}
              trackColor={{ false: '#D1D5DB', true: '#4CD964' }}
              thumbColor={phaseToggles.fertile ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Luteal Phase</Text>
            <Switch
              value={phaseToggles.luteal}
              onValueChange={(value) => handlePhaseToggle('luteal', value)}
              disabled={!masterToggle}
              trackColor={{ false: '#D1D5DB', true: '#FF9500' }}
              thumbColor={phaseToggles.luteal ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.savingButton]}
          onPress={saveSettings}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    margin: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  savingButton: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NotificationSettingsScreen;
