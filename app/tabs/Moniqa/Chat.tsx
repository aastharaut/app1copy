// // app/chat/messaging.tsx (ChatMessagingScreen)

// import { View, TextInput, FlatList, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
// import { useState } from 'react';

// export default function ChatMessagingScreen() {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');

//   // const handleSend = async () => {
//   //   if (inputText.trim() === '') return;

//   //   const userMessage = { text: inputText, sender: 'user', id: Date.now().toString() };
//   //   setMessages(prev => [...prev, userMessage]);

//   //   // Simulate OpenAI call
//   //   const botResponse = await fetchOpenAIResponse(inputText);
//   //   const botMessage = { text: botResponse, sender: 'bot', id: (Date.now() + 1).toString() };

//   //   setMessages(prev => [...prev, botMessage]);
//   //   setInputText('');
//   // };

//   const fetchOpenAIResponse = async (input: string): Promise<string> => {
//     // Replace this with your OpenAI API integration
//     return `Here's what I found about: "${input}"`;
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
//       <FlatList
//         data={messages}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           // <View style={{ padding: 10, alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start' }}>
//           //   <Text
//           //     style={{
//           //       backgroundColor: item.sender === 'user' ? '#8b5cf6' : '#eee',
//           //       color: item.sender === 'user' ? '#fff' : '#000',
//           //       padding: 10,
//           //       borderRadius: 10,
//           //       maxWidth: '80%',
//           //     }}
//           //   >
//           //     {item.text}
//           //   </Text>
//           // </View>
//         )}
//         contentContainerStyle={{ padding: 10 }}
//       />

//       <View style={{ flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd' }}>
//         <TextInput
//           value={inputText}
//           onChangeText={setInputText}
//           placeholder="Ask me about your cycle..."
//           style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginRight: 10 }}
//         />
//         {/* <TouchableOpacity onPress={handleSend} style={{ justifyContent: 'center' }}>
//           <Text style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Send</Text>
//         </TouchableOpacity> */}
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
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