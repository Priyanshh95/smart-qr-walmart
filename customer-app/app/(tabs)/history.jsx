import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { firebaseApp } from "../../firebase";
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    try {
      const q = query(
        collection(db, "users", auth.currentUser.uid, "qr_history"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data every time the user visits this page
  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>QR History</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading your QR history...</Text>
        </View>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>QR History</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="qr-code-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No QR scan history found</Text>
          <Text style={styles.emptySubtext}>Start scanning QR codes to see them here</Text>
        </View>
      </View>
    );
  }

  const renderHistoryItem = ({ item, index }) => {
    const gradients = [
      ['#FF6B6B', '#FF8E8E', '#FFB3A7'],
      ['#4ECDC4', '#6BD5F0', '#A7E6FF'],
      ['#45B7D1', '#5CDB95', '#A7FFD6'],
      ['#FF6B9D', '#FF8FB1', '#FFD6E0'],
    ];
    const gradient = gradients[index % gradients.length];

    return (
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.historyBox}
        >
          <View style={styles.boxContent}>
            <Ionicons name="qr-code" size={24} color="#fff" style={styles.qrIcon} />
            <Text style={styles.data} numberOfLines={3}>
              {item.data}
            </Text>
            <Text style={styles.timestamp}>
              {item.timestamp?.toDate
                ? item.timestamp.toDate().toLocaleString()
                : "No timestamp"}
            </Text>
          </View>
          <View style={styles.overlay} />
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR History</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} scan{history.length !== 1 ? 's' : ''} found
        </Text>
      </View>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E2',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 16,
  },
  historyBox: {
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    // 3D shadow effects
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  boxContent: {
    position: 'relative',
    zIndex: 2,
  },
  qrIcon: {
    marginBottom: 12,
    alignSelf: 'center',
  },
  data: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
});