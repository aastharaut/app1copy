import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HeartPulse, Flame, Dumbbell, Apple } from 'lucide-react-native';

export default function ChatIntroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: '700',
              color: '#4B0082',
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            Moniqa
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: '#555',
              marginBottom: 25,
              paddingHorizontal: 10,
            }}
          >
            Your personal women’s health assistant for PCOS, menstrual wellness, and lifestyle support.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#4B0082',
              paddingVertical: 14,
              paddingHorizontal: 40,
              borderRadius: 30,
              alignSelf: 'center',
              marginBottom: 35,
              shadowColor: '#8b5cf6',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
            onPress={() => router.push('/tabs/Moniqa/Chat')}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
              Start Chatting Now
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
            Your Health, Simplified
          </Text>

          <View style={{ gap: 16, marginBottom: 30 }}>
            {[
              {
                icon: <HeartPulse size={22} color="#4B0082" />,
                title: 'PCOS Management',
                desc: 'Understand symptoms, treatments, and lifestyle changes tailored to PCOS.',
              },
              {
                icon: <Flame size={22} color="#4B0082" />,
                title: 'Hormonal Balance',
                desc: 'Discover how to maintain hormonal balance through informed choices.',
              },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: '#eee',
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: '#fafafa',
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {item.icon}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 15, marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: '#555' }}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
            Diet & Exercise Tips
          </Text>

          <View style={{ gap: 16 }}>
            {[
              {
                icon: <Apple size={22} color="#4B0082" />,
                title: "Nutrition for Women's Health",
                desc: 'Personalized diet tips and meal plans that support PCOS and hormone balance.',
              },
              {
                icon: <Dumbbell size={22} color="#4B0082" />,
                title: 'Exercise Recommendations',
                desc: 'Workouts tailored for energy levels across your cycle phases.',
              },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: '#eee',
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: '#fafafa',
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {item.icon}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 15, marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: '#555' }}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
