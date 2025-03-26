// import React from "react";
// import { View } from "react-native";
// import AppCurrentCycle from "../tabs/AppCurrentCycle"; // Path is correct

// const CycleScreen = () => {
//   return (
//     <View style={{ flex: 1 }}>
//       <AppCurrentCycle />
//     </View>
//   );
// };

// export default CycleScreen;

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppCurrentCycle from '../tabs/AppCurrentCycle';
import { useAuth } from '../context/AuthContext';

const CycleScreen = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppCurrentCycle userId={user.uid} />
    </View>
  );
};

export default CycleScreen;