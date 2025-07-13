import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    <LinearGradient colors={["#F3F6F4", "#E8F0F8"]} style={styles.bg}>
      <View style={styles.container}>
        <LinearGradient colors={["#FF8E8E", "#FFB3A7"]} style={styles.headerCard}>
          <Ionicons name="cube" size={32} color="#fff" style={{ marginBottom: 8 }} />
          <Text style={styles.productName}>{data.name || 'Product'}</Text>
        </LinearGradient>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={20} color="#4B5563" />
            <Text style={styles.label}>Packaging Date</Text>
            <Text style={styles.value}>{data.packedOnDate || '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Ionicons name="cube-outline" size={20} color="#4B5563" />
            <Text style={styles.label}>Product Journey</Text>
            <Text style={styles.value}>{data.trackingId || '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Ionicons name="timer-outline" size={20} color="#4B5563" />
            <Text style={styles.label}>Expiry Countdown</Text>
            <StatusChip label={expiryStatus.label} color={expiryStatus.color} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={20} color="#4B5563" />
            <Text style={styles.label}>Expiry Date</Text>
            <Text style={styles.value}>{data.expiryDate || '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Ionicons name="restaurant-outline" size={20} color="#4B5563" />
            <Text style={styles.label}>Ingredients</Text>
            <StatusChip label={data.ingredients || '-'} color={data.ingredients === 'fruit' ? '#34D399' : '#FF6B6B'} />
          </View>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  headerCard: {
    width: '100%',
    maxWidth: 400,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  productName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 8,
    minWidth: 120,
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginLeft: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  chipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F6F4',
    marginVertical: 2,
    marginLeft: 32,
    marginRight: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  backText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.2,
  },
}); 