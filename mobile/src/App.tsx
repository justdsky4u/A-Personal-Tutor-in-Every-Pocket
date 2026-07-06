import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backendUrl = 'http://localhost:4000';
const PROFILE_STORAGE_KEY = 'selectedProfile';

const subjects = [
  { id: 'math', label: 'Math' },
  { id: 'science', label: 'Science' },
  { id: 'language', label: 'Language' },
];

const onboardingProfiles = [
  { id: 'child', label: '10-year-old beginner', phrase: 'I like fun stories.', mode: 'Story' },
  { id: 'secondary', label: 'Secondary student', phrase: 'I want exam help.', mode: 'Structured' },
  { id: 'vocational', label: 'Vocational learner', phrase: 'I need practical skills.', mode: 'Hands-on' },
  { id: 'adult', label: 'Adult learner', phrase: 'I want clear and respectful lessons.', mode: 'Fast' },
];

const initialLessons = [
  {
    id: 'math-1',
    subject: 'math',
    title: 'Everyday Numbers',
    content: 'Numbers are like the grains of millet we count at market. Let’s practice adding small groups as if we are buying fruit.',
  },
  {
    id: 'science-1',
    subject: 'science',
    title: 'Water and Life',
    content: 'Water helps plants grow. When a seed finds water, it will open and become a strong plant. That is how life starts.',
  },
  {
    id: 'language-1',
    subject: 'language',
    title: 'Story Words',
    content: 'A story is like a journey down the river. We use words to carry pictures in our mind. Let us build a small sentence together.',
  },
];

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lessons] = useState(initialLessons);
  const [profile, setProfile] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState('Not synced yet');

  useEffect(() => {
    loadAppState();
  }, []);

  async function loadAppState() {
    try {
      const [savedHistory, savedProfile] = await Promise.all([
        AsyncStorage.getItem('chatHistory'),
        AsyncStorage.getItem(PROFILE_STORAGE_KEY),
      ]);

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      if (savedProfile) {
        setProfile(savedProfile);
      }
    } catch (error) {
      console.warn('Unable to load app state', error);
    }
  }

  async function loadHistory() {
    try {
      const saved = await AsyncStorage.getItem('chatHistory');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Unable to load history', error);
    }
  }

  async function saveHistory(nextHistory: { role: string; text: string }[]) {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(nextHistory));
    } catch (error) {
      console.warn('Unable to save history', error);
    }
  }

  function speak(text: string) {
    Speech.speak(text, { pitch: 1, rate: 0.9 });
  }

  async function handleSend() {
    if (!currentMessage.trim()) return;
    const userText = currentMessage.trim();
    setCurrentMessage('');
    const nextHistory = [...history, { role: 'user', text: userText }];
    setHistory(nextHistory);
    await saveHistory(nextHistory);
    setLoading(true);

    const reply = generateTutorResponse(userText, selectedSubject, profile);
    const updated = [...nextHistory, { role: 'assistant', text: reply }];
    setHistory(updated);
    await saveHistory(updated);
    setLoading(false);
    speak(reply);
  }

  async function handleSyncDemo() {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/sync-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile || 'demo-study',
          data: { profile, history, subject: selectedSubject },
        }),
      });
      const json = await response.json();
      setSyncStatus(json.success ? `Demo sync ok: ${json.savedAt}` : 'Demo sync failed');
    } catch (error) {
      setSyncStatus('Demo sync error');
      console.warn('Sync demo failed', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(selectedProfile: string) {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, selectedProfile);
      setProfile(selectedProfile);
    } catch (error) {
      console.warn('Unable to save profile', error);
    }
  }

  function generateTutorResponse(message: string, subject: string, profileId: string | null) {
    const lower = message.toLowerCase();
    const profilePhrase = profileId ? `As a ${profileId} learner,` : 'For you,';

    if (lower.includes('help') || lower.includes('confuse') || lower.includes('dont understand') || lower.includes('how')) {
      return `${profilePhrase} I hear you. Let us try again with a simple way. In ${subject}, if you change the view, you can see this like a story from here.`;
    }
    if (lower.includes('story') || lower.includes('example') || lower.includes('like')) {
      return `${profilePhrase} imagine ${subject} as part of your daily life. A farmer, a small shop, and your family can all use this idea. I will explain with a simple example.`;
    }
    return `${profilePhrase} good question. In ${subject}, we begin with small steps. I will guide you step by step and help you grow your confidence. What part would you like to learn next?`;
  }

  function renderLesson({ item }: { item: typeof initialLessons[0] }) {
    if (item.subject !== selectedSubject) return null;
    return (
      <TouchableOpacity style={styles.lessonCard} onPress={() => Alert.alert(item.title, item.content)}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <Text style={styles.lessonSubject}>Tap to explore</Text>
      </TouchableOpacity>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.brand}>Welcome to Your Tutor</Text>
          <Text style={styles.tagline}>Choose one learning path and your coach will adapt to your world.</Text>
        </View>

        <View style={styles.onboardingList}>
          {onboardingProfiles.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.onboardingCard}
              onPress={() => saveProfile(option.id)}
            >
              <Text style={styles.lessonTitle}>{option.label}</Text>
              <Text style={styles.lessonSubject}>{option.phrase}</Text>
              <Text style={styles.smallText}>Learning mode: {option.mode}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.onboardingNote}>
          This quick setup helps the tutor speak to you in a way that is easier and more familiar.
        </Text>
      </SafeAreaView>
    );
  }

  const currentProfile = onboardingProfiles.find((item) => item.id === profile);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>A Personal Tutor</Text>
        <Text style={styles.tagline}>Patient tutor. Local stories. Offline-ready.</Text>
      </View>

      <View style={styles.profileBanner}>
        <Text style={styles.profileText}>Learning path: {currentProfile?.label}</Text>
        <Text style={styles.profileTextSmall}>Sync status: {syncStatus}</Text>
      </View>

      <View style={styles.subjectBar}>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={[styles.subjectButton, selectedSubject === subject.id && styles.subjectButtonActive]}
            onPress={() => setSelectedSubject(subject.id)}
          >
            <Text style={[styles.subjectButtonText, selectedSubject === subject.id && styles.subjectButtonTextActive]}>{subject.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.progressBanner}>
        <Text style={styles.progressText}>Daily streak: 3 days · Local learning style: {currentProfile?.mode}</Text>
      </View>

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={renderLesson}
        contentContainerStyle={styles.lessonList}
        ListHeaderComponent={<Text style={styles.sectionHeading}>Starter lessons</Text>}
      />

      <TouchableOpacity style={styles.syncButton} onPress={handleSyncDemo} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Sync Demo</Text>}
      </TouchableOpacity>

      <View style={styles.chatContainer}>
        <FlatList
          data={history}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.chatBubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={styles.chatText}>{item.text}</Text>
            </View>
          )}
          inverted
          style={styles.chatHistory}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={currentMessage}
            onChangeText={setCurrentMessage}
            placeholder="Ask your tutor..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f4ef', paddingHorizontal: 16 },
  header: { marginTop: 24, marginBottom: 12 },
  brand: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  tagline: { marginTop: 4, color: '#4b5563' },
  subjectBar: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  subjectButton: { flex: 1, paddingVertical: 12, marginHorizontal: 4, borderRadius: 12, backgroundColor: '#e5e7eb', alignItems: 'center' },
  subjectButtonActive: { backgroundColor: '#2563eb' },
  subjectButtonText: { color: '#374151', fontWeight: '600' },
  subjectButtonTextActive: { color: '#fff' },
  progressBanner: { backgroundColor: '#e0f2fe', padding: 12, borderRadius: 14, marginBottom: 12 },
  progressText: { color: '#0369a1' },
  sectionHeading: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#111827' },
  lessonList: { paddingBottom: 16 },
  lessonCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  lessonSubject: { marginTop: 6, color: '#6b7280' },
  chatContainer: { flex: 1, marginTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 },
  chatHistory: { flex: 1, marginBottom: 10 },
  chatBubble: { marginVertical: 4, padding: 12, borderRadius: 16, maxWidth: '85%' },
  userBubble: { backgroundColor: '#1d4ed8', alignSelf: 'flex-end' },
  assistantBubble: { backgroundColor: '#e5e7eb', alignSelf: 'flex-start' },
  chatText: { color: '#111827' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 16 },
  input: { flex: 1, minHeight: 44, maxHeight: 90, backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, color: '#111827' },
  sendButton: { marginLeft: 10, backgroundColor: '#2563eb', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: '#ffffff', fontWeight: '700' },
  profileBanner: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 14, marginBottom: 12 },
  profileText: { color: '#111827', fontWeight: '600' },
  profileTextSmall: { color: '#475569', marginTop: 4 },
  onboardingList: { marginTop: 24 },
  onboardingCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  smallText: { marginTop: 8, color: '#6b7280' },
  onboardingNote: { marginTop: 16, color: '#475569', textAlign: 'center' },
  syncButton: { marginVertical: 10, backgroundColor: '#111827', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
});
