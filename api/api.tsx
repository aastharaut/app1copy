// import axios from 'axios';


// const API_URL = __DEV__ 
//   ? 'http://10.0.2.2:8000'  // Android emulator
//   : 'http://localhost:8000'; // iOS simulator or production URL

// type PredictResponse = {
//   prediction: number;
//   status: string;
// };

// export const predictCycle = async (
//   ovulationDay: number,
//   mensesLength: number
// ): Promise<PredictResponse> => {
//   try {
//     const response: Axios.AxiosResponse<PredictResponse> = await axios.post(`${API_URL}/predict`, {
//       ovulation_day: ovulationDay,
//       menses_length: mensesLength
//     });
//     return response.data;
//   } catch (error: unknown) {
//     const err = error as any;
//     console.error('API Error:', err.response?.data || err.message);
//     throw err;
//   }
// };

// export const checkHealth = async (): Promise<any> => {
//   return await axios.get(`${API_URL}/`);
// };
