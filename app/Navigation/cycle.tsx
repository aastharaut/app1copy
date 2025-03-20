import React from "react";
import { View } from "react-native";
import AppCurrentCycle from "../tabs/AppCurrentCycle"; // Path is correct

const CycleScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppCurrentCycle />
    </View>
  );
};

export default CycleScreen;