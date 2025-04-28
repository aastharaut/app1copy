// 1. First, create a service to interact with your ML API
// Create a new file: services/mlPredictionService.ts

interface MLPredictionInput {
    ovulation_day: number;
    menses_length: number;
    // Add other features your model might need
  }
  
  interface MLPredictionResult {
    prediction: number;
    status: string;
  }
  
  export const getPrediction = async (input: MLPredictionInput): Promise<MLPredictionResult> => {
    try {
      // Replace with your deployed Firebase Function URL
      const response = await fetch('https://your-region-your-project.cloudfunctions.net/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ML prediction error:', error);
      // Return default in case of error
      return { prediction: 28, status: 'error' };
    }
  };
  