import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../src/supabaseClient';

const TrackProduct = () => {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedProduct, setTrackedProduct] = useState(null);

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      Alert.alert('Error', 'Please enter a tracking ID');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('smart-qr')
        .select('*')
        .eq('trackingId', trackingId)
        .single();

      if (error || !data) {
        setTrackedProduct(null);
        Alert.alert('Not Found', 'No product found with this tracking ID.');
      } else {
        setTrackedProduct(data);
      }
    } catch (err) {
      setTrackedProduct(null);
      Alert.alert('Error', 'Failed to fetch product.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#34D399';
      case 'In Transit': return '#F59E0B';
      case 'Processing': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchCard}>
            <Ionicons name="search" size={24} color="#10B981" />
            <Text style={styles.searchTitle}>Track Your Product</Text>
            <Text style={styles.searchSubtitle}>
              Enter your tracking ID to get real-time updates on your product's journey
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Tracking ID"
                value={trackingId}
                onChangeText={setTrackingId}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={[styles.trackButton, loading && styles.trackButtonDisabled]} 
                onPress={handleTrack}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.trackButtonText}>Tracking...</Text>
                ) : (
                  <Text style={styles.trackButtonText}>Track</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {trackedProduct && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Product Details</Text>
            
            <View style={styles.productCard}>
              <LinearGradient colors={["#10B981", "#059669"]} style={styles.productHeader}>
                <Ionicons name="cube" size={32} color="#fff" />
                <Text style={styles.productName}>{trackedProduct.name}</Text>
              </LinearGradient>
              
              <View style={styles.productDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="barcode-outline" size={20} color="#4B5563" />
                  <Text style={styles.detailLabel}>Tracking ID</Text>
                  <Text style={styles.detailValue}>{trackedProduct.trackingId}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color="#4B5563" />
                  <Text style={styles.detailLabel}>Packed Date</Text>
                  <Text style={styles.detailValue}>{trackedProduct.packedOnDate}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailRow}>
                  <Ionicons name="timer-outline" size={20} color="#4B5563" />
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={[styles.statusChip, { backgroundColor: getStatusColor(trackedProduct.status) }]}>
                    <Text style={styles.statusText}>{trackedProduct.status}</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={20} color="#4B5563" />
                  <Text style={styles.detailLabel}>Current Location</Text>
                  <Text style={styles.detailValue}>{trackedProduct.location}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color="#4B5563" />
                  <Text style={styles.detailLabel}>Expiry Date</Text>
                  <Text style={styles.detailValue}>{trackedProduct.expiryDate}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={20} color="#4B5563" />
                  <Text style={styles.detailLabel}>Estimated Delivery</Text>
                  <Text style={styles.detailValue}>{trackedProduct.estimatedDelivery}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

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
  trackButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  trackButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    marginBottom: 40,
  },
  resultTitle: {
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
  },
  productHeader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  productDetails: {
    padding: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
    minWidth: 120,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 8,
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  statusChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F6F4',
    marginVertical: 8,
    marginLeft: 32,
    marginRight: 0,
  },
});

export default TrackProduct; 