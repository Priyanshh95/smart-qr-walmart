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
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      // Try multiple ways to get the API key
      const apiKey = process.env.GEMINI_API_KEY || Constants.expoConfig?.extra?.GEMINI_API_KEY;
      
      // Debug logging
      console.log('Environment variable check:', {
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0,
        apiKeyStart: apiKey ? apiKey.substring(0, 10) + '...' : 'undefined',
        fromProcessEnv: !!process.env.GEMINI_API_KEY,
        fromConstants: !!Constants.expoConfig?.extra?.GEMINI_API_KEY
      });
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        Alert.alert(
          'API Key Missing',
          'Please add your Gemini API key to the .env file as GEMINI_API_KEY=your_actual_api_key'
        );
        setLoading(false);
        return;
      }

      const prompt = `Give practical recycling ideas for "${searchQuery}". Include:
• 2-3 recycling methods
• 2-3 creative reuse ideas  

Keep it concise with bullet points.`;

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
      console.error('Request URL:', `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey ? 'HIDDEN' : 'MISSING'}`);
      
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
            {formatMarkdownText(trimmedLine)}
          </Text>
        );
      } else if (trimmedLine.match(/^\d+\./)) {
        return (
          <Text key={index} style={styles.numberedPoint}>
            {formatMarkdownText(trimmedLine)}
          </Text>
        );
      } else if (trimmedLine && trimmedLine.length > 0) {
        return (
          <Text key={index} style={styles.paragraph}>
            {formatMarkdownText(trimmedLine)}
          </Text>
        );
      }
      return <Text key={index} style={styles.spacing} />;
    });
  };

  const formatMarkdownText = (text) => {
    // Check if this is a header (starts with #)
    if (text.startsWith('#')) {
      const headerLevel = text.match(/^#+/)[0].length;
      const headerText = text.replace(/^#+\s*/, ''); // Remove # symbols and spaces
      
      let headerStyle;
      switch (headerLevel) {
        case 1:
          headerStyle = styles.header1;
          break;
        case 2:
          headerStyle = styles.header2;
          break;
        case 3:
          headerStyle = styles.header3;
          break;
        default:
          headerStyle = styles.header3;
      }
      
      return (
        <Text style={headerStyle}>
          {formatBoldText(headerText)}
        </Text>
      );
    }
    
    // For regular text, handle bold formatting
    return formatBoldText(text);
  };

  const formatBoldText = (text) => {
    // Split text by ** markers
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, partIndex) => {
      // Check if this part is wrapped in ** (bold)
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove the ** markers and make it bold
        const boldText = part.slice(2, -2);
        return (
          <Text key={partIndex} style={styles.boldText}>
            {boldText}
          </Text>
        );
      }
      // Regular text
      return part;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ways to Recycle</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchCard}>
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
        </View>

        {/* Results Section */}
        {hasSearched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Recycling Ideas for "{searchQuery}"
            </Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10B981" />
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#08522D',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  searchTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  searchSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#F9FAFB',
  },
  searchButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 40,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 26,
    marginBottom: 12,
    paddingLeft: 12,
    fontWeight: '500',
  },
  numberedPoint: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 26,
    marginBottom: 12,
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 26,
    marginBottom: 16,
    fontWeight: '400',
  },
  boldText: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  header1: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
    marginTop: 8,
  },
  header2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    marginTop: 6,
  },
  header3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
    marginTop: 4,
  },
  spacing: {
    height: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  tipText: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 26,
    marginBottom: 12,
    fontWeight: '500',
  },
}); 