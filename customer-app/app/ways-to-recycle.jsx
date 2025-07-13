import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../assets/colors';
import axios from 'axios';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function WaysToRecycle() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recyclingSuggestions, setRecyclingSuggestions] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter an item to search for recycling suggestions.');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        Alert.alert(
          'API Key Missing',
          'Please add your Gemini API key to the .env file as GEMINI_API_KEY=your_actual_api_key'
        );
        setLoading(false);
        return;
      }

      const prompt = `Provide detailed, practical ways to recycle or repurpose "${searchQuery}". Include:
1. Different recycling methods
2. Creative reuse ideas
3. Environmental benefits
4. Step-by-step instructions where applicable
5. Safety considerations if any

Format the response in a clear, easy-to-read structure with bullet points and sections.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
        setRecyclingSuggestions(response.data.candidates[0].content.parts[0].text);
      } else {
        setRecyclingSuggestions('No suggestions found. Please try a different search term.');
      }
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error details:', error.response?.data || error.message);
      console.error('API Key used:', apiKey ? 'Present' : 'Missing');
      console.error('Request URL:', `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey ? 'HIDDEN' : 'MISSING'}`);
      
      Alert.alert(
        'Error',
        `Failed to get recycling suggestions. Error: ${error.response?.status || error.message}. Please check your API key and try again.`
      );
      setRecyclingSuggestions('');
    } finally {
      setLoading(false);
    }
  };

  const formatSuggestions = (text) => {
    // Split by common section markers and format
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        return (
          <Text key={index} style={styles.bulletPoint}>
            {trimmedLine}
          </Text>
        );
      } else if (trimmedLine.match(/^\d+\./)) {
        return (
          <Text key={index} style={styles.numberedPoint}>
            {trimmedLine}
          </Text>
        );
      } else if (trimmedLine && trimmedLine.length > 0) {
        return (
          <Text key={index} style={styles.paragraph}>
            {trimmedLine}
          </Text>
        );
      }
      return <Text key={index} style={styles.spacing} />;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#45B7D1', '#5CDB95']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ways to Recycle</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>Find Recycling Ideas</Text>
          <Text style={styles.searchSubtitle}>
            Enter any item to discover creative ways to recycle or repurpose it
          </Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="e.g., plastic bottles, old clothes, cardboard..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              multiline={false}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Section */}
        {hasSearched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Recycling Ideas for "{searchQuery}"
            </Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#45B7D1" />
                <Text style={styles.loadingText}>Finding recycling ideas...</Text>
              </View>
            ) : recyclingSuggestions ? (
              <View style={styles.suggestionsContainer}>
                {formatSuggestions(recyclingSuggestions)}
              </View>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  No suggestions found. Try searching for a different item.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Recycling Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              • Always clean items before recycling
            </Text>
            <Text style={styles.tipText}>
              • Check local recycling guidelines
            </Text>
            <Text style={styles.tipText}>
              • Consider upcycling for creative projects
            </Text>
            <Text style={styles.tipText}>
              • Reduce waste by reusing when possible
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchSection: {
    marginBottom: 30,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  searchSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#45B7D1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 30,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  numberedPoint: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
    fontWeight: '500',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  spacing: {
    height: 8,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
}); 