import React from "react";
import { View } from "react-native";
import AppCurrentCycle from "../tabs/AppCurrentCycle"; // Adjust path if needed

const CycleScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppCurrentCycle />
    </View>
  );
};

export default CycleScreen;
