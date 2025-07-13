import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function getExpiryStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return { label: 'Red', color: '#FF6B6B' };
  if (diffDays <= 5) return { label: 'Moderate', color: '#FFD600' };
  return { label: 'Healthy', color: '#34D399' };
}

function StatusChip({ label, color }) {
  return (
    <View style={[styles.chip, { backgroundColor: color }]}> 
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export default function QRResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let data = {};
  try {
    data = JSON.parse(params.data);
  } catch {
    data = {};
  }
  const expiryStatus = getExpiryStatus(data.expiryDate);

  return (
    <LinearGradient colors={["#F3F6F4", "#E8F0F8", "#F0F8FF"]} style={styles.bg}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <LinearGradient 
            colors={["#10B981", "#059669", "#047857"]} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCard}
          >
            <Text style={styles.productName}>{data.name || 'Product'}</Text>
            <View style={styles.headerOverlay} />
          </LinearGradient>
          
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#4B5563" />
              </View>
              <Text style={styles.label}>Packaging Date</Text>
              <Text style={styles.value}>{data.packedOnDate || '-'}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="cube-outline" size={24} color="#4B5563" />
              </View>
              <Text style={styles.label}>Product Journey</Text>
              <Text style={styles.value}>{data.trackingId || '-'}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="timer-outline" size={24} color="#4B5563" />
              </View>
              <Text style={styles.label}>Expiry Countdown</Text>
              <StatusChip label={expiryStatus.label} color={expiryStatus.color} />
            </View>
            <View style={styles.divider} />
            
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#4B5563" />
              </View>
              <Text style={styles.label}>Expiry Date</Text>
              <Text style={styles.value}>{data.expiryDate || '-'}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="cash-outline" size={24} color="#4B5563" />
              </View>
              <Text style={styles.label}>Price</Text>
              <Text style={styles.value}>
                {data.price ? `₹${parseFloat(data.price).toFixed(2)}` : '-'}
              </Text>
            </View>
          </View>
          
          {/* Big Ingredients Box */}
          <View style={styles.ingredientsBigBox}>
            <View style={styles.ingredientsHeader}>
              <View style={styles.ingredientsIconContainer}>
                <Ionicons name="restaurant-outline" size={28} color="#10B981" />
              </View>
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
            </View>
            <View style={styles.ingredientsContent}>
              <Text style={styles.ingredientsText}>{data.ingredients || 'No ingredients information available'}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/home')}>
            <LinearGradient 
              colors={["#10B981", "#059669"]} 
              style={styles.backButtonGradient}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
              <Text style={styles.backText}>Back to Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerCard: {
    width: '100%',
    borderRadius: 28,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  chipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
    marginLeft: 64,
    marginRight: 0,
  },
  ingredientsBigBox: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ingredientsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ingredientsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  ingredientsContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ingredientsText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    textAlign: 'left',
    lineHeight: 24,
  },
  backButton: {
    alignSelf: 'center',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 32,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 0.2,
  },
}); 