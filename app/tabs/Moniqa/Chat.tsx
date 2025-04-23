// import { View, TextInput, FlatList, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
// import { useState, useRef, useEffect } from 'react';
// import { Send, ArrowLeft } from 'lucide-react-native';
// import { useRouter } from 'expo-router';

// // Define message types
// type Message = {
//   id: string;
//   text: string;
//   sender: 'user' | 'bot';
//   timestamp: Date;
// };

// // Predefined responses for common PCOS/women's health topics
// const healthResponses = {
//   pcos: {
//     general: "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder common among women. It involves irregular periods, elevated androgen levels, and small cysts on the ovaries. Managing PCOS involves a combination of lifestyle changes, medication, and regular monitoring.",
//     symptoms: "Common PCOS symptoms include irregular periods, excess hair growth, acne, weight gain (especially around the abdomen), difficulty losing weight, darkening of skin, and hair thinning. If you're experiencing several of these symptoms, I recommend consulting with a healthcare provider.",
//     diet: "A PCOS-friendly diet focuses on anti-inflammatory foods and stabilizing blood sugar. Include lean proteins, healthy fats (avocados, nuts, olive oil), high-fiber foods, and complex carbohydrates. Limit processed foods, sugars, and refined carbs. Consider smaller, more frequent meals to maintain stable blood sugar levels.",
//     exercise: "For PCOS, a combination of moderate cardio (30-60 minutes, 3-5 days/week) and strength training (2-3 days/week) is recommended. Activities like walking, swimming, cycling, and yoga can be particularly beneficial. Exercise helps improve insulin sensitivity and reduce inflammation."
//   },
//   menstrual: {
//     general: "A typical menstrual cycle lasts 21-35 days, with bleeding usually lasting 2-7 days. Tracking your cycle can help identify patterns and irregularities. Various factors including stress, weight changes, and health conditions can affect your cycle.",
//     irregular: "Irregular periods can be caused by stress, significant weight change, PCOS, thyroid issues, or other hormonal imbalances. If your cycles are consistently irregular, consider consulting with a healthcare provider.",
//     pain: "Period pain (dysmenorrhea) is common and can be managed with heat therapy, gentle exercise, adequate hydration, anti-inflammatory foods, and over-the-counter pain relievers. If pain is severe or debilitating, please consult a healthcare provider.",
//     pms: "Premenstrual Syndrome (PMS) symptoms can include mood swings, breast tenderness, fatigue, and bloating. Management strategies include regular exercise, stress reduction techniques, adequate sleep, limiting caffeine and alcohol, and consuming a balanced diet rich in complex carbs, calcium, and vitamin B6."
//   },
//   nutrition: {
//     womensHealth: "Women's nutritional needs vary throughout life stages and menstrual cycles. Focus on iron-rich foods (leafy greens, beans, lean meats), calcium (dairy, fortified plant milks, leafy greens), omega-3 fatty acids (fatty fish, flaxseeds, walnuts), and folate (legumes, asparagus, eggs). Stay hydrated and consider tracking nutritional intake.",
//     hormoneBalance: "For hormone balance, include healthy fats (avocados, olive oil, nuts), fiber-rich foods (vegetables, fruits, whole grains), quality protein with each meal, cruciferous vegetables (broccoli, cauliflower), and adaptogenic herbs. Limit alcohol, caffeine, and added sugars.",
//     mealPlanning: "When meal planning, aim for balanced plates with 1/2 vegetables, 1/4 lean protein, and 1/4 complex carbs with healthy fats. Prepare foods in batches, keep healthy snacks available, and stay consistent with meal timing to support stable blood sugar levels."
//   },
//   exercise: {
//     cycleBased: "During menstruation: gentle movement like walking, yoga, or swimming. Follicular phase: good time for high-intensity workouts. Ovulatory phase: ideal for challenging strength training. Luteal phase: moderate exercise like pilates or light cardio. Always listen to your body and adjust as needed.",
//     pcosFriendly: "For PCOS, aim for 150 minutes of moderate activity weekly, combining cardio with strength training. HIIT (High-Intensity Interval Training) can be particularly effective for insulin resistance. Add in stress-reducing activities like yoga or tai chi. Consistency is more important than intensity.",
//     beginners: "If you're new to exercise, start with walking 10-15 minutes daily, gradually increasing duration and intensity. Add bodyweight exercises like modified push-ups, squats, and lunges. Consider working with a fitness professional to develop a personalized plan that accounts for your health conditions."
//   }
// };

// // Function to generate responses based on user input
// const generateResponse = (input: string): string => {
//   const lowercaseInput = input.toLowerCase();
  
//   // Check for PCOS related queries
//   if (lowercaseInput.includes('pcos') || lowercaseInput.includes('polycystic')) {
//     if (lowercaseInput.includes('symptom') || lowercaseInput.includes('sign')) {
//       return healthResponses.pcos.symptoms;
//     } else if (lowercaseInput.includes('diet') || lowercaseInput.includes('eat') || lowercaseInput.includes('food') || lowercaseInput.includes('nutrition')) {
//       return healthResponses.pcos.diet;
//     } else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('workout') || lowercaseInput.includes('fitness')) {
//       return healthResponses.pcos.exercise;
//     } else {
//       return healthResponses.pcos.general;
//     }
//   }
  
//   // Check for menstrual health queries
//   else if (lowercaseInput.includes('period') || lowercaseInput.includes('menstrual') || lowercaseInput.includes('cycle')) {
//     if (lowercaseInput.includes('irregular') || lowercaseInput.includes('late') || lowercaseInput.includes('early')) {
//       return healthResponses.menstrual.irregular;
//     } else if (lowercaseInput.includes('pain') || lowercaseInput.includes('cramp') || lowercaseInput.includes('hurt')) {
//       return healthResponses.menstrual.pain;
//     } else if (lowercaseInput.includes('pms') || lowercaseInput.includes('mood') || lowercaseInput.includes('syndrome')) {
//       return healthResponses.menstrual.pms;
//     } else {
//       return healthResponses.menstrual.general;
//     }
//   }
  
//   // Check for nutrition queries
//   else if (lowercaseInput.includes('diet') || lowercaseInput.includes('food') || lowercaseInput.includes('eat') || lowercaseInput.includes('nutrition')) {
//     if (lowercaseInput.includes('hormone') || lowercaseInput.includes('balance')) {
//       return healthResponses.nutrition.hormoneBalance;
//     } else if (lowercaseInput.includes('meal') || lowercaseInput.includes('plan') || lowercaseInput.includes('prep')) {
//       return healthResponses.nutrition.mealPlanning;
//     } else {
//       return healthResponses.nutrition.womensHealth;
//     }
//   }
  
//   // Check for exercise queries
//   else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('workout') || lowercaseInput.includes('fitness') || lowercaseInput.includes('activity')) {
//     if (lowercaseInput.includes('cycle') || lowercaseInput.includes('phase')) {
//       return healthResponses.exercise.cycleBased;
//     } else if (lowercaseInput.includes('pcos') || lowercaseInput.includes('polycystic')) {
//       return healthResponses.exercise.pcosFriendly;
//     } else if (lowercaseInput.includes('beginner') || lowercaseInput.includes('start')) {
//       return healthResponses.exercise.beginners;
//     } else {
//       return healthResponses.exercise.cycleBased;
//     }
//   }
  
//   // Default response
//   else {
//     return "I'm Moniqa, your women's health assistant. I can provide information about PCOS, menstrual cycles, hormonal health, nutrition, and exercise recommendations. How can I help you today?";
//   }
// };

// export default function ChatMessagingScreen() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       text: "Hi, I'm Moniqa! I can answer your questions about PCOS, menstrual health, nutrition, and exercise. How can I help you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const flatListRef = useRef<FlatList>(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     if (flatListRef.current && messages.length > 1) {
//       flatListRef.current.scrollToEnd({ animated: true });
//     }
//   }, [messages]);

//   const handleSend = () => {
//     if (inputText.trim() === '') return;

//     // Add user message
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: inputText,
//       sender: 'user',
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setInputText('');
//     setIsTyping(true);

//     // Simulate response delay
//     setTimeout(() => {
//       const botResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         text: generateResponse(inputText),
//         sender: 'bot',
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, botResponse]);
//       setIsTyping(false);
//     }, 1000);
//   };

//   // Format time from Date object
//   const formatTime = (date: Date): string => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
//       {/* Header */}
//       <View style={{ 
//         flexDirection: 'row', 
//         alignItems: 'center', 
//         padding: 15, 
//         backgroundColor: '#8b5cf6',
//         paddingTop: Platform.OS === 'ios' ? 50 : 15
//       }}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <ArrowLeft color="#fff" size={24} />
//         </TouchableOpacity>
//         <Text style={{ 
//           color: '#fff', 
//           fontSize: 18, 
//           fontWeight: '600', 
//           marginLeft: 15 
//         }}>
//           Moniqa Health Assistant
//         </Text>
//       </View>

//       {/* Chat Messages */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           keyExtractor={item => item.id}
//           renderItem={({ item }) => (
//             <View style={{ 
//               marginVertical: 5,
//               marginHorizontal: 10,
//               flexDirection: 'row',
//               justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
//             }}>
//               {item.sender === 'bot' && (
//                 <View style={{ 
//                   width: 35, 
//                   height: 35, 
//                   borderRadius: 17.5, 
//                   backgroundColor: '#e0d4ff', 
//                   justifyContent: 'center', 
//                   alignItems: 'center',
//                   marginRight: 8
//                 }}>
//                   <Text style={{ color: '#8b5cf6', fontWeight: '700' }}>M</Text>
//                 </View>
//               )}
              
//               <View style={{
//                 maxWidth: '75%',
//                 backgroundColor: item.sender === 'user' ? '#8b5cf6' : '#fff',
//                 padding: 12,
//                 borderRadius: 18,
//                 borderBottomLeftRadius: item.sender === 'bot' ? 5 : 18,
//                 borderBottomRightRadius: item.sender === 'user' ? 5 : 18,
//                 marginBottom: 2,
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 1,
//                 elevation: 1,
//               }}>
//                 <Text style={{
//                   color: item.sender === 'user' ? '#fff' : '#333',
//                   fontSize: 15,
//                 }}>
//                   {item.text}
//                 </Text>
//                 <Text style={{
//                   color: item.sender === 'user' ? '#e0d4ff' : '#999',
//                   fontSize: 11,
//                   alignSelf: 'flex-end',
//                   marginTop: 3,
//                 }}>
//                   {formatTime(item.timestamp)}
//                 </Text>
//               </View>
//             </View>
//           )}
//           contentContainerStyle={{ paddingVertical: 15 }}
//         />

//         {/* Typing indicator */}
//         {isTyping && (
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 10 }}>
//             <View style={{ 
//               width: 35, 
//               height: 35, 
//               borderRadius: 17.5, 
//               backgroundColor: '#e0d4ff', 
//               justifyContent: 'center', 
//               alignItems: 'center',
//               marginRight: 8
//             }}>
//               <Text style={{ color: '#8b5cf6', fontWeight: '700' }}>M</Text>
//             </View>
//             <ActivityIndicator size="small" color="#8b5cf6" />
//             <Text style={{ marginLeft: 5, color: '#666' }}>Moniqa is typing...</Text>
//           </View>
//         )}

//         {/* Input area */}
//         <View style={{
//           flexDirection: 'row',
//           padding: 10,
//           backgroundColor: '#fff',
//           borderTopWidth: 1,
//           borderTopColor: '#eee',
//           alignItems: 'center',
//         }}>
//           <TextInput
//             value={inputText}
//             onChangeText={setInputText}
//             placeholder="Ask me about women's health..."
//             style={{
//               flex: 1,
//               borderWidth: 1,
//               borderColor: '#ddd',
//               backgroundColor: '#f8f8f8',
//               padding: 12,
//               borderRadius: 20,
//               marginRight: 10,
//               fontSize: 15,
//             }}
//             multiline
//             returnKeyType="send"
//             onSubmitEditing={handleSend}
//           />
//           <TouchableOpacity
//             onPress={handleSend}
//             style={{
//               backgroundColor: '#8b5cf6',
//               width: 45,
//               height: 45,
//               borderRadius: 22.5,
//               justifyContent: 'center',
//               alignItems: 'center',
//               shadowColor: '#8b5cf6',
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.3,
//               shadowRadius: 3,
//               elevation: 2,
//             }}
//           >
//             <Send size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

import { View, TextInput, FlatList, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Define message types
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Predefined responses for common PCOS/women's health topics
const healthResponses = {
  pcos: {
    general: "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder common among women. It involves irregular periods, elevated androgen levels, and small cysts on the ovaries. Managing PCOS involves a combination of lifestyle changes, medication, and regular monitoring.",
    symptoms: "Common PCOS symptoms include irregular periods, excess hair growth, acne, weight gain (especially around the abdomen), difficulty losing weight, darkening of skin, and hair thinning. If you're experiencing several of these symptoms, I recommend consulting with a healthcare provider.",
    diet: "A PCOS-friendly diet focuses on anti-inflammatory foods and stabilizing blood sugar. Include lean proteins, healthy fats (avocados, nuts, olive oil), high-fiber foods, and complex carbohydrates. Limit processed foods, sugars, and refined carbs. Consider smaller, more frequent meals to maintain stable blood sugar levels.",
    exercise: "For PCOS, a combination of moderate cardio (30-60 minutes, 3-5 days/week) and strength training (2-3 days/week) is recommended. Activities like walking, swimming, cycling, and yoga can be particularly beneficial. Exercise helps improve insulin sensitivity and reduce inflammation."
  },
  menstrual: {
    general: "A typical menstrual cycle lasts 21-35 days, with bleeding usually lasting 2-7 days. Tracking your cycle can help identify patterns and irregularities. Various factors including stress, weight changes, and health conditions can affect your cycle.",
    irregular: "Irregular periods can be caused by stress, significant weight change, PCOS, thyroid issues, or other hormonal imbalances. If your cycles are consistently irregular, consider consulting with a healthcare provider.",
    pain: "Period pain (dysmenorrhea) is common and can be managed with heat therapy, gentle exercise, adequate hydration, anti-inflammatory foods, and over-the-counter pain relievers. If pain is severe or debilitating, please consult a healthcare provider.",
    pms: "Premenstrual Syndrome (PMS) symptoms can include mood swings, breast tenderness, fatigue, and bloating. Management strategies include regular exercise, stress reduction techniques, adequate sleep, limiting caffeine and alcohol, and consuming a balanced diet rich in complex carbs, calcium, and vitamin B6."
  },
  nutrition: {
    womensHealth: "Women's nutritional needs vary throughout life stages and menstrual cycles. Focus on iron-rich foods (leafy greens, beans, lean meats), calcium (dairy, fortified plant milks, leafy greens), omega-3 fatty acids (fatty fish, flaxseeds, walnuts), and folate (legumes, asparagus, eggs). Stay hydrated and consider tracking nutritional intake.",
    hormoneBalance: "For hormone balance, include healthy fats (avocados, olive oil, nuts), fiber-rich foods (vegetables, fruits, whole grains), quality protein with each meal, cruciferous vegetables (broccoli, cauliflower), and adaptogenic herbs. Limit alcohol, caffeine, and added sugars.",
    mealPlanning: "When meal planning, aim for balanced plates with 1/2 vegetables, 1/4 lean protein, and 1/4 complex carbs with healthy fats. Prepare foods in batches, keep healthy snacks available, and stay consistent with meal timing to support stable blood sugar levels."
  },
  exercise: {
    cycleBased: "During menstruation: gentle movement like walking, yoga, or swimming. Follicular phase: good time for high-intensity workouts. Ovulatory phase: ideal for challenging strength training. Luteal phase: moderate exercise like pilates or light cardio. Always listen to your body and adjust as needed.",
    pcosFriendly: "For PCOS, aim for 150 minutes of moderate activity weekly, combining cardio with strength training. HIIT (High-Intensity Interval Training) can be particularly effective for insulin resistance. Add in stress-reducing activities like yoga or tai chi. Consistency is more important than intensity.",
    beginners: "If you're new to exercise, start with walking 10-15 minutes daily, gradually increasing duration and intensity. Add bodyweight exercises like modified push-ups, squats, and lunges. Consider working with a fitness professional to develop a personalized plan that accounts for your health conditions."
  },
  recipes: {
    pcosFriendly: [
      {
        name: "Anti-Inflammatory Breakfast Bowl",
        ingredients: "1/2 cup steel-cut oats, 1 tbsp ground flaxseed, 1/2 tsp cinnamon, 1/4 cup berries, 1 tbsp almond butter, unsweetened almond milk",
        instructions: "Cook oats according to package. Mix in flaxseed and cinnamon. Top with berries and almond butter. Add a splash of almond milk.",
        benefits: "High in fiber, omega-3 fatty acids, and antioxidants. Helps regulate blood sugar and reduce inflammation."
      },
      {
        name: "Mediterranean Lunch Salad",
        ingredients: "2 cups mixed greens, 4 oz grilled chicken breast, 1/4 avocado (sliced), 1/4 cup chickpeas, 1/4 cup cucumber, 2 tbsp olive oil & lemon dressing, 1 tbsp feta cheese",
        instructions: "Combine all ingredients in a large bowl. Drizzle with olive oil and lemon juice. Toss gently and enjoy.",
        benefits: "Balanced protein, healthy fats, and fiber. Promotes satiety and provides steady energy without blood sugar spikes."
      },
      {
        name: "Turmeric Salmon with Roasted Vegetables",
        ingredients: "5 oz salmon fillet, 1 tsp turmeric, 1/2 tsp black pepper, 1 cup broccoli florets, 1 cup sliced bell peppers, 1/2 cup sweet potato cubes, 1 tbsp olive oil, salt to taste",
        instructions: "Preheat oven to 400°F. Season salmon with turmeric, black pepper, and salt. On a sheet pan, toss vegetables with olive oil and salt. Place salmon on the same pan. Roast for 15-20 minutes until salmon is cooked through and vegetables are tender.",
        benefits: "Rich in omega-3 fatty acids, anti-inflammatory compounds, and antioxidants. Supports hormone balance and insulin sensitivity."
      }
    ],
    hormoneBalance: [
      {
        name: "Seed Cycling Smoothie",
        ingredients: "1 cup unsweetened almond milk, 1 cup spinach, 1/2 frozen banana, 1 tbsp ground flaxseed (follicular phase) or 1 tbsp sesame seeds (luteal phase), 1 tbsp pumpkin seeds (follicular phase) or 1 tbsp sunflower seeds (luteal phase), 1 tbsp almond butter, ice as needed",
        instructions: "Blend all ingredients until smooth. Adjust thickness with ice or water as desired.",
        benefits: "Seed cycling can help support hormone balance throughout your cycle. The lignans in flaxseeds help modulate estrogen in the follicular phase, while sesame and sunflower seeds provide zinc and vitamin E to support progesterone production in the luteal phase."
      },
      {
        name: "Hormone-Supporting Buddha Bowl",
        ingredients: "1/2 cup cooked quinoa, 1 cup sautéed kale, 1/2 cup roasted sweet potatoes, 1/4 avocado, 2 tbsp pumpkin seeds, 3 oz baked tofu or salmon, tahini-lemon dressing",
        instructions: "Arrange all components in a bowl. Drizzle with dressing made from 1 tbsp tahini, lemon juice, and water.",
        benefits: "Rich in B vitamins, magnesium, zinc, and healthy fats that support hormone production and liver detoxification pathways."
      }
    ],
    antiInflammatory: [
      {
        name: "Golden Milk Latte",
        ingredients: "1 cup unsweetened almond milk, 1 tsp turmeric, 1/4 tsp cinnamon, pinch of black pepper, 1/2 tsp honey (optional), 1/4 tsp ginger powder",
        instructions: "Heat almond milk in a small pot. Whisk in spices. Simmer for 3-5 minutes. Add honey if desired. Strain into a mug and enjoy.",
        benefits: "Turmeric contains curcumin, a powerful anti-inflammatory compound. The black pepper enhances absorption. This drink can help reduce inflammation associated with PCOS."
      },
      {
        name: "Berry Chia Pudding",
        ingredients: "2 tbsp chia seeds, 1/2 cup unsweetened almond milk, 1/4 cup mixed berries, 1/2 tsp vanilla extract, 1/4 tsp cinnamon",
        instructions: "Mix chia seeds, almond milk, vanilla, and cinnamon. Let sit for at least 2 hours or overnight. Top with fresh berries before serving.",
        benefits: "High in omega-3 fatty acids and antioxidants that help combat inflammation and support hormone balance."
      }
    ]
  },
  workoutPlans: {
    pcos: {
      beginner: {
        name: "PCOS-Friendly Beginner Plan",
        frequency: "3-4 days per week",
        duration: "30-40 minutes per session",
        description: "This plan focuses on building a foundation of strength and cardiovascular fitness while being gentle enough for beginners.",
        workouts: [
          {
            day: "Day 1 - Full Body Strength + Light Cardio",
            exercises: [
              "5-minute walking warm-up",
              "10 modified push-ups (3 sets)",
              "15 bodyweight squats (3 sets)",
              "30-second plank holds (3 sets)",
              "10-minute brisk walking cooldown"
            ]
          },
          {
            day: "Day 2 - Low Impact Cardio",
            exercises: [
              "30 minutes of walking, swimming, or cycling at a moderate pace",
              "5 minutes of gentle stretching"
            ]
          },
          {
            day: "Day 3 - Rest & Recovery",
            exercises: [
              "15 minutes of gentle yoga stretches focusing on relaxation",
              "Deep breathing exercises"
            ]
          },
          {
            day: "Day 4 - Strength & Balance",
            exercises: [
              "5-minute walking warm-up",
              "10 chair-assisted lunges per leg (2 sets)",
              "10 wall push-ups (3 sets)",
              "30-second side plank holds (2 sets per side)",
              "5 minutes of balance practice",
              "5-minute stretching cooldown"
            ]
          }
        ]
      },
      intermediate: {
        name: "PCOS Management Intermediate Plan",
        frequency: "4-5 days per week",
        duration: "40-50 minutes per session",
        description: "This plan incorporates more HIIT training to help with insulin resistance while maintaining regular strength training.",
        workouts: [
          {
            day: "Day 1 - HIIT Cardio",
            exercises: [
              "5-minute warm-up",
              "20 minutes of interval training (30 seconds high intensity, 90 seconds recovery)",
              "5-minute cooldown",
              "10 minutes of core exercises"
            ]
          },
          {
            day: "Day 2 - Upper Body Strength",
            exercises: [
              "5-minute cardio warm-up",
              "Dumbbell rows (3 sets of 12)",
              "Shoulder presses (3 sets of 10)",
              "Push-ups (3 sets of max effort)",
              "Bicep curls (3 sets of 12)",
              "Tricep dips (3 sets of 12)",
              "5-minute stretching"
            ]
          },
          {
            day: "Day 3 - Low Impact Steady State Cardio",
            exercises: [
              "40 minutes of walking, swimming, or cycling at moderate intensity"
            ]
          },
          {
            day: "Day 4 - Lower Body Strength",
            exercises: [
              "5-minute warm-up",
              "Squats (3 sets of 15)",
              "Lunges (3 sets of 10 per leg)",
              "Glute bridges (3 sets of 15)",
              "Calf raises (3 sets of 15)",
              "Stretching"
            ]
          },
          {
            day: "Day 5 - Yoga or Pilates",
            exercises: [
              "45-minute yoga or Pilates session focusing on core strength and flexibility"
            ]
          }
        ]
      }
    },
    cycleBased: {
      menstrual: {
        name: "Menstrual Phase Workout Plan (Days 1-5)",
        description: "During your period, energy levels may be lower. Focus on gentle movement to ease cramps and boost mood.",
        workouts: [
          "Light walking (20-30 minutes)",
          "Gentle yoga flows focusing on hip openers",
          "Stretching sessions",
          "Slow swimming if comfortable",
          "Rest as needed - listen to your body"
        ]
      },
      follicular: {
        name: "Follicular Phase Workout Plan (Days 6-14)",
        description: "Energy rises during this phase, making it ideal for more challenging workouts and trying new activities.",
        workouts: [
          "HIIT workouts (20-30 minutes, 3-4 times this week)",
          "Strength training with heavier weights",
          "Dance cardio or high-energy group classes",
          "Running or more intense cardio sessions",
          "Challenge yourself while energy is high"
        ]
      },
      ovulatory: {
        name: "Ovulatory Phase Workout Plan (Days 15-17)",
        description: "Energy and strength peak during ovulation, making it perfect for maximum exertion activities.",
        workouts: [
          "Sprint intervals or track workouts",
          "Personal record attempts in strength training",
          "High-intensity classes",
          "Challenge workouts or fitness tests",
          "Competitive sports or activities"
        ]
      },
      luteal: {
        name: "Luteal Phase Workout Plan (Days 18-28)",
        description: "As progesterone rises, you may notice decreased energy. Focus on strength and moderate activities.",
        workouts: [
          "Strength training with moderate weights",
          "Pilates and core-focused workouts",
          "Moderate-intensity steady-state cardio (30-40 minutes)",
          "Nature walks or hiking",
          "Gradually decrease intensity as the phase progresses"
        ]
      }
    }
  }
};

// Function to generate responses based on user input
const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for recipe requests
  if (lowercaseInput.includes('recipe') || lowercaseInput.includes('meal') || lowercaseInput.includes('cook') || lowercaseInput.includes('food idea')) {
    if (lowercaseInput.includes('pcos') || lowercaseInput.includes('polycystic')) {
      const recipes = healthResponses.recipes.pcosFriendly;
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      return `Here's a PCOS-friendly recipe for you:\n\n${randomRecipe.name}\n\nIngredients:\n${randomRecipe.ingredients}\n\nInstructions:\n${randomRecipe.instructions}\n\nBenefits:\n${randomRecipe.benefits}`;
    } else if (lowercaseInput.includes('hormone') || lowercaseInput.includes('balance')) {
      const recipes = healthResponses.recipes.hormoneBalance;
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      return `Here's a hormone-balancing recipe for you:\n\n${randomRecipe.name}\n\nIngredients:\n${randomRecipe.ingredients}\n\nInstructions:\n${randomRecipe.instructions}\n\nBenefits:\n${randomRecipe.benefits}`;
    } else if (lowercaseInput.includes('inflam') || lowercaseInput.includes('anti-inflam')) {
      const recipes = healthResponses.recipes.antiInflammatory;
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      return `Here's an anti-inflammatory recipe for you:\n\n${randomRecipe.name}\n\nIngredients:\n${randomRecipe.ingredients}\n\nInstructions:\n${randomRecipe.instructions}\n\nBenefits:\n${randomRecipe.benefits}`;
    } else {
      // Provide a random recipe from any category if not specific
      const allRecipes = [...healthResponses.recipes.pcosFriendly, ...healthResponses.recipes.hormoneBalance, ...healthResponses.recipes.antiInflammatory];
      const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      return `Here's a healthy recipe for you:\n\n${randomRecipe.name}\n\nIngredients:\n${randomRecipe.ingredients}\n\nInstructions:\n${randomRecipe.instructions}\n\nBenefits:\n${randomRecipe.benefits}`;
    }
  }
  
  // Check for workout plan requests
  else if (lowercaseInput.includes('workout plan') || lowercaseInput.includes('exercise plan') || lowercaseInput.includes('fitness plan') || (lowercaseInput.includes('plan') && (lowercaseInput.includes('workout') || lowercaseInput.includes('exercise')))) {
    if (lowercaseInput.includes('pcos') || lowercaseInput.includes('polycystic')) {
      if (lowercaseInput.includes('beginner') || lowercaseInput.includes('start')) {
        const plan = healthResponses.workoutPlans.pcos.beginner;
        let response = `${plan.name}\nFrequency: ${plan.frequency}\nDuration: ${plan.duration}\n\n${plan.description}\n\n`;
        
        plan.workouts.forEach(workout => {
          response += `${workout.day}:\n`;
          workout.exercises.forEach(exercise => {
            response += `• ${exercise}\n`;
          });
          response += '\n';
        });
        
        return response;
      } else {
        const plan = healthResponses.workoutPlans.pcos.intermediate;
        let response = `${plan.name}\nFrequency: ${plan.frequency}\nDuration: ${plan.duration}\n\n${plan.description}\n\n`;
        
        plan.workouts.forEach(workout => {
          response += `${workout.day}:\n`;
          workout.exercises.forEach(exercise => {
            response += `• ${exercise}\n`;
          });
          response += '\n';
        });
        
        return response;
      }
    } else if (lowercaseInput.includes('cycle') || lowercaseInput.includes('menstrual phase') || lowercaseInput.includes('follicular') || lowercaseInput.includes('luteal') || lowercaseInput.includes('ovulatory')) {
      // Determine which phase they're asking about
      let phase;
      if (lowercaseInput.includes('menstrual')) {
        phase = healthResponses.workoutPlans.cycleBased.menstrual;
      } else if (lowercaseInput.includes('follicular')) {
        phase = healthResponses.workoutPlans.cycleBased.follicular;
      } else if (lowercaseInput.includes('ovulatory')) {
        phase = healthResponses.workoutPlans.cycleBased.ovulatory;
      } else if (lowercaseInput.includes('luteal')) {
        phase = healthResponses.workoutPlans.cycleBased.luteal;
      } else {
        // If no specific phase mentioned, give overview of all phases
        let response = "Here's a cycle-based workout approach tailored to each phase:\n\n";
        
        const phaseKeys = ['menstrual', 'follicular', 'ovulatory', 'luteal'] as const;
        for (const phaseKey of phaseKeys) {
          const currentPhase = healthResponses.workoutPlans.cycleBased[phaseKey];
          response += `${currentPhase.name}\n${currentPhase.description}\n\nSuggested workouts:\n`;
          
          currentPhase.workouts.forEach((workout: string) => {
            response += `• ${workout}\n`;
          });
          
          response += '\n';
        }
        
        return response;
      }
      
      // Return info for the specific phase
      let response = `${phase.name}\n${phase.description}\n\nSuggested workouts:\n`;
      phase.workouts.forEach(workout => {
        response += `• ${workout}\n`;
      });
      
      return response;
    }
  }
  
  // Check for PCOS related queries
  else if (lowercaseInput.includes('pcos') || lowercaseInput.includes('polycystic')) {
    if (lowercaseInput.includes('symptom') || lowercaseInput.includes('sign')) {
      return healthResponses.pcos.symptoms;
    } else if (lowercaseInput.includes('diet') || lowercaseInput.includes('eat') || lowercaseInput.includes('food') || lowercaseInput.includes('nutrition')) {
      return healthResponses.pcos.diet;
    } else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('workout') || lowercaseInput.includes('fitness')) {
      return healthResponses.pcos.exercise;
    } else {
      return healthResponses.pcos.general;
    }
  }
  
  // Check for menstrual health queries
  else if (lowercaseInput.includes('period') || lowercaseInput.includes('menstrual') || lowercaseInput.includes('cycle')) {
    if (lowercaseInput.includes('irregular') || lowercaseInput.includes('late') || lowercaseInput.includes('early')) {
      return healthResponses.menstrual.irregular;
    } else if (lowercaseInput.includes('pain') || lowercaseInput.includes('cramp') || lowercaseInput.includes('hurt')) {
      return healthResponses.menstrual.pain;
    } else if (lowercaseInput.includes('pms') || lowercaseInput.includes('mood') || lowercaseInput.includes('syndrome')) {
      return healthResponses.menstrual.pms;
    } else {
      return healthResponses.menstrual.general;
    }
  }
  
  // Check for nutrition queries
  else if (lowercaseInput.includes('diet') || lowercaseInput.includes('food') || lowercaseInput.includes('eat') || lowercaseInput.includes('nutrition')) {
    if (lowercaseInput.includes('hormone') || lowercaseInput.includes('balance')) {
      return healthResponses.nutrition.hormoneBalance;
    } else if (lowercaseInput.includes('meal') || lowercaseInput.includes('plan') || lowercaseInput.includes('prep')) {
      return healthResponses.nutrition.mealPlanning;
    } else {
      return healthResponses.nutrition.womensHealth;
    }
  }
  
  // Check for exercise queries
  else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('workout') || lowercaseInput.includes('fitness') || lowercaseInput.includes('activity')) {
    if (lowercaseInput.includes('cycle') || lowercaseInput.includes('phase')) {
      return healthResponses.exercise.cycleBased;
    } else if (lowercaseInput.includes('pcos') || lowercaseInput.includes('polycystic')) {
      return healthResponses.exercise.pcosFriendly;
    } else if (lowercaseInput.includes('beginner') || lowercaseInput.includes('start')) {
      return healthResponses.exercise.beginners;
    } else {
      return healthResponses.exercise.cycleBased;
    }
  }
  
  // Default response
  return "I'm Moniqa, your women's health assistant. I can provide information about PCOS, menstrual health, nutrition, and exercise. Please ask me a specific question, or try topics like 'PCOS symptoms', 'healthy recipes', 'cycle-based workouts', or 'nutrition tips for hormone balance'.";
  
};

export default function ChatMessagingScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, I'm Moniqa! I can answer your questions about PCOS, menstrual health, nutrition, and exercise. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 1) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Format time from Date object
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: '#4B0082',
        paddingTop: Platform.OS === 'ios' ? 50 : 15
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={{ 
          color: '#fff', 
          fontSize: 18, 
          fontWeight: '600', 
          marginLeft: 15 
        }}>
          Moniqa Health Assistant
        </Text>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ 
              marginVertical: 5,
              marginHorizontal: 10,
              flexDirection: 'row',
              justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {item.sender === 'bot' && (
                <View style={{ 
                  width: 35, 
                  height: 35, 
                  borderRadius: 17.5, 
                  backgroundColor: '#e0d4ff', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginRight: 8
                }}>
                  <Text style={{ color: '#4B0082', fontWeight: '700' }}>M</Text>
                </View>
              )}
              
              <View style={{
                maxWidth: '75%',
                backgroundColor: item.sender === 'user' ? '#4B0082' : '#fff',
                padding: 12,
                borderRadius: 18,
                borderBottomLeftRadius: item.sender === 'bot' ? 5 : 18,
                borderBottomRightRadius: item.sender === 'user' ? 5 : 18,
                marginBottom: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 1,
              }}>
                <Text style={{
                  color: item.sender === 'user' ? '#fff' : '#333',
                  fontSize: 15,
                }}>
                  {item.text}
                </Text>
                <Text style={{
                  color: item.sender === 'user' ? '#e0d4ff' : '#999',
                  fontSize: 11,
                  alignSelf: 'flex-end',
                  marginTop: 3,
                }}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 15 }}
        />

        {/* Typing indicator */}
        {isTyping && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 10 }}>
            <View style={{ 
              width: 35, 
              height: 35, 
              borderRadius: 17.5, 
              backgroundColor: '#e0d4ff', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginRight: 8
            }}>
              <Text style={{ color: '#4B0082', fontWeight: '700' }}>M</Text>
            </View>
            <ActivityIndicator size="small" color="#4B0082" />
            <Text style={{ marginLeft: 5, color: '#666' }}>Moniqa is typing...</Text>
          </View>
        )}

        {/* Input area */}
        <View style={{
          flexDirection: 'row',
          padding: 10,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          alignItems: 'center',
        }}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about women's health..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ddd',
              backgroundColor: '#f8f8f8',
              padding: 12,
              borderRadius: 20,
              marginRight: 10,
              fontSize: 15,
            }}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{
              backgroundColor: '#4B0082',
              width: 45,
              height: 45,
              borderRadius: 22.5,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}