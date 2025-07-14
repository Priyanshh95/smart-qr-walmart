import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/supabaseClient'; // <-- Fix import path
import { LinearGradient } from 'expo-linear-gradient';

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await supabase
          .from('smart-qr')
          .select('name, price')
          .order('name', { ascending: true });
        if (error) {
          setError('Failed to fetch products');
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#08522D", "#059669"]} style={styles.header}>
        <Text style={styles.headerTitle}>ProductList</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>No products found.</Text>
        ) : (
          products.map((product, idx) => (
            <View key={idx}>
              <View style={styles.productRow}>
                <View style={styles.productInfoColumn}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                </View>
              </View>
              {idx !== products.length - 1 && <View style={styles.divider} />}
            </View>
          ))
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
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  listContainer: {
    padding: 24,
    paddingTop: 16,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 0,
    shadowColor: '#10B981',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  productInfoColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  productName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    opacity: 0.85,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E7EF',
    marginHorizontal: 10,
    marginBottom: 18,
    marginTop: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '500',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '500',
  },
}); 