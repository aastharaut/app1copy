// app/chat/index.tsx (ChatIntroScreen)

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChatIntroScreen() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#8b5cf6', textAlign: 'center', marginBottom: 10 }}>
        Moniqa
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
        Your personal women's health assistant for PCOS, menstrual health, and personalized wellness recommendations.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#8b5cf6',
          padding: 15,
          borderRadius: 25,
          alignSelf: 'center',
          marginBottom: 30,
          paddingHorizontal: 30,
        }}
        onPress={() => router.push('/tabs/Moniqa/Chat')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start Chatting Now</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Get Personalized Health Advice</Text>

      <View style={{ gap: 15, marginBottom: 30 }}>
        {[
          { title: 'PCOS Management', desc: 'Learn about symptoms, treatments, and lifestyle changes for PCOS.' },
          { title: 'Menstrual Health', desc: 'Track and understand your cycle, irregularities, and symptoms.' },
          { title: 'Hormonal Balance', desc: 'Discover how hormones affect your health and what you can do to maintain balance.' },
        ].map((item, index) => (
          <View key={index} style={{ borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 15 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
            <Text>{item.desc}</Text>
          </View>
        ))}
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Diet & Exercise Recommendations</Text>

      <View style={{ gap: 15 }}>
        {[
          { title: "Nutrition for Women's Health", desc: 'Get diet plans and nutritional advice specific to PCOS and menstrual health.' },
          { title: 'Exercise Recommendations', desc: 'Find suitable workout routines for different phases of your cycle.' },
        ].map((item, index) => (
          <View key={index} style={{ borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 15 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
            <Text>{item.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
