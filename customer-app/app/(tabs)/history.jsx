import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { firebaseApp } from "../../firebase";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      const data = querySnapshot.docs.map(doc => {
        let parsed = {};
        try {
          parsed = JSON.parse(doc.data().data);
        } catch {
          parsed = {};
        }
        return {
          id: doc.id,
          ...doc.data(),
          parsed,
        };
      }).filter(item => item.parsed && Object.keys(item.parsed).length > 0);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.headerSubtitle}>0</Text>
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
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.headerSubtitle}>0</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No QR scan history found</Text>
          <Text style={styles.emptySubtext}>Start scanning QR codes to see them here</Text>
        </View>
      </View>
    );
  }

  const renderHistoryItem = ({ item }) => {
    const name = item.parsed.name || '-';
    const trackingId = item.parsed.trackingId || '-';
    let dateStr = 'No date';
    if (item.timestamp?.toDate) {
      const d = item.timestamp.toDate();
      dateStr = d.toLocaleDateString();
    }
    return (
      <TouchableOpacity
        style={styles.itemBox}
        activeOpacity={0.85}
        onPress={() => router.push({ pathname: '/qr-scanner/result', params: { data: item.data } })}
      >
        <View style={styles.rowBox}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.trackingId}>{trackingId}</Text>
        </View>
        <Text style={styles.date}>{dateStr}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <Text style={styles.headerSubtitle}>{history.length}</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#08522D',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#495057',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#868E96',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '400',
  },
  listContainer: {
    padding: 20,
  },
  itemBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  rowBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    letterSpacing: -0.3,
  },
  trackingId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
    marginLeft: 12,
    flexShrink: 0,
    backgroundColor: '#F0FFFD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F8F5',
  },
  date: {
    fontSize: 14,
    color: '#868E96',
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
});