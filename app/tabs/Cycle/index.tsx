import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AppCurrentCycle from './AppCurrentCycle';
import { auth } from '../../../FirebaseConfig'; // Adjust path as needed
import { onAuthStateChanged } from 'firebase/auth';

const CycleScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please sign in to view your cycle</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppCurrentCycle userId={userId} />
    </View>
  );
};

export default CycleScreen;