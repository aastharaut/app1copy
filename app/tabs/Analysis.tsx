// // src/screens/PredictScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { predictCycle } from '../../api/api';

// const PredictScreen = () => {
//   const [ovulationDay, setOvulationDay] = useState('');
//   const [mensesLength, setMensesLength] = useState('');
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handlePredict = async () => {
//     if (!ovulationDay || !mensesLength) {
//       Alert.alert('Error', 'Please enter both values');
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await predictCycle(
//         parseFloat(ovulationDay),
//         parseFloat(mensesLength)
//       );
//       setPrediction(result.prediction);
//     } catch (error) {
//       Alert.alert('Prediction Failed', error.response?.data?.detail || 'Server error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Ovulation Day (1-30):</Text>
//       <TextInput
//         keyboardType="numeric"
//         value={ovulationDay}
//         onChangeText={setOvulationDay}
//         placeholder="e.g., 15"
//       />

//       <Text>Menses Length (1-14):</Text>
//       <TextInput
//         keyboardType="numeric"
//         value={mensesLength}
//         onChangeText={setMensesLength}
//         placeholder="e.g., 5"
//       />

//       <Button
//         title={loading ? "Calculating..." : "Predict Cycle Length"}
//         onPress={handlePredict}
//         disabled={loading}
//       />

//       {prediction && (
//         <Text style={{ marginTop: 20 }}>
//           Predicted Cycle Length: {prediction} days
//         </Text>
//       )}
//     </View>
//   );
// };

// export default PredictScreen;

import React from 'react';
import { View, Text } from 'react-native';

const ComponentName = () => {
  return (
    <View>
      <Text>ComponentName</Text>
    </View>
  );
};

export default ComponentName;