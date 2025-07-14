import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../src/supabaseClient';
import axios from 'axios';
import Constants from 'expo-constants';

export default function IngredientCheck() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState({}); // { [productId]: string }

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a product name or ID');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults(null);

    try {
      // Smart search: if input is a number, search by id or name; else, search by name only
      let data, error;
      if (!isNaN(Number(searchQuery))) {
        ({ data, error } = await supabase
          .from('smart-qr')
          .select('*')
          .or(`id.eq.${searchQuery},name.ilike.%${searchQuery}%`)
          .limit(5));
      } else {
        ({ data, error } = await supabase
          .from('smart-qr')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
          .limit(5));
      }
      if (error) {
        console.error('Supabase error:', error);
        setError('Failed to fetch product data');
        return;
      }
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setError('No products found with that name or ID');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const analyzeIngredients = async (product) => {
    setGeminiLoading(product.id);
    setGeminiResult((prev) => ({ ...prev, [product.id]: '' }));
    try {
      const apiKey = process.env.GEMINI_API_KEY || Constants.expoConfig?.extra?.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        alert('Gemini API key missing.');
        setGeminiLoading(false);
        return;
      }
      const prompt = `Given these ingredients: ${product.ingredients}.\n\n1. Are these ingredients generally useful/healthy?\n2. How should this product be stored (cool, dry, etc)?\n3. Any interesting or safety info?\n\nKeep it concise, use bullet points if possible.`;
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
        setGeminiResult((prev) => ({ ...prev, [product.id]: response.data.candidates[0].content.parts[0].text }));
      } else {
        setGeminiResult((prev) => ({ ...prev, [product.id]: 'No analysis found.' }));
      }
    } catch (error) {
      setGeminiResult((prev) => ({ ...prev, [product.id]: 'Error analyzing ingredients.' }));
    } finally {
      setGeminiLoading(false);
    }
  };

  // Gemini markdown formatting helpers
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
          <Text key={partIndex} style={{ fontWeight: 'bold', color: '#059669' }}>{boldText}</Text>
        );
      }
      // Regular text
      return part;
    });
  };

  const renderProductCard = (product) => (
    <View key={product.id} style={styles.productCard}>
      {/* Green header: name left, id right */}
      <LinearGradient colors={["#10B981", "#059669"]} style={styles.resultHeader}>
        <Text style={styles.resultName}>{product.name}</Text>
        <Text style={styles.resultId}>ID: {product.id}</Text>
      </LinearGradient>
      {/* Ingredients block */}
      <View style={styles.ingredientsBlock}>
        <Text style={styles.ingredientsTitle}>Ingredients</Text>
        <Text style={styles.ingredientsText}>{product.ingredients || 'No ingredients information available'}</Text>
      </View>
      {/* Analyze Button */}
      <TouchableOpacity
        style={styles.analyzeButton}
        onPress={() => analyzeIngredients(product)}
        disabled={geminiLoading === product.id}
      >
        <Text style={styles.analyzeButtonText}>{geminiLoading === product.id ? 'Analyzing...' : 'Analyze Ingredients'}</Text>
      </TouchableOpacity>
      {/* Gemini Result */}
      {geminiResult[product.id] && (
        <View style={styles.geminiResultBlock}>
          <Text style={styles.geminiResultTitle}>Ingredient Analysis</Text>
          {geminiResult[product.id].split('\n').map((line, idx) => (
            <Text key={idx} style={styles.geminiResultText}>{formatMarkdownText(line)}</Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ingredient Check</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchCard}>
            <Text style={styles.searchTitle}>Find Product Ingredients</Text>
            <Text style={styles.searchSubtitle}>
              Enter a product name or ID to check its ingredients and nutritional information
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter product name or ID..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={searchProducts}
                returnKeyType="search"
              />
              <TouchableOpacity 
                style={[styles.searchButton, loading && styles.searchButtonDisabled]} 
                onPress={searchProducts}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="search" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </View>

        {searchResults && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            {searchResults.map(renderProductCard)}
          </View>
        )}
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
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
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
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    overflow: 'hidden',
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#10B981',
  },
  resultName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  resultId: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  ingredientsBlock: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 18,
    margin: 18,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  ingredientsText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
    lineHeight: 22,
  },
  analyzeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 18,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  geminiResultBlock: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    margin: 18,
    borderWidth: 1,
    borderColor: '#E0E7EF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  geminiResultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  geminiResultText: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
    marginBottom: 2,
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
}); 