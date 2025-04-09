// ///api/api.tsx
// import axios from 'axios';

// const API_URL = __DEV__ 
//   ? 'http://10.0.2.2:8000'  // Android emulator
//   : 'http://localhost:8000'; // iOS simulator or production URL

// export const predictCycle = async (ovulationDay, mensesLength) => {
//   try {
//     const response = await axios.post(`${API_URL}/predict`, {
//       ovulation_day: ovulationDay,
//       menses_length: mensesLength
//     });
//     return response.data;
//   } catch (error) {
//     console.error('API Error:', error.response?.data || error.message);
//     throw error;
//   }
// };

// export const checkHealth = async () => {
//   return await axios.get(`${API_URL}/`);
// };