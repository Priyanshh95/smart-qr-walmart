import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function QRUpload() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [qrResult, setQrResult] = useState(null);

  const pickImage = async () => {
    setQrResult(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        setLoading(true);
        // Upload to goqr.me API
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          name: 'qr.jpg',
          type: 'image/jpeg',
        });

        const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();
        setLoading(false);
        if (
          data &&
          data[0] &&
          data[0].symbol &&
          data[0].symbol[0] &&
          data[0].symbol[0].data
        ) {
          setQrResult(data[0].symbol[0].data);
          Alert.alert('QR Code Found', data[0].symbol[0].data);
        } else {
          setQrResult('No QR code found in the image.');
          Alert.alert('No QR code found in the image.');
        }
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to pick or process image');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Upload</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.uploadContainer}>
        <LinearGradient colors={['#FF6B6B', '#FF8E8E', '#FFB3A7']} style={styles.uploadBox}>
          <Ionicons name="cloud-upload" size={64} color="#fff" />
          <Text style={styles.uploadTitle}>Upload QR Code Image</Text>
          <Text style={styles.uploadText}>Select an image containing a QR code from your device</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={loading}>
            <Text style={styles.uploadButtonText}>{loading ? 'Processing...' : 'Choose Image'}</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator color="#fff" style={{ marginTop: 16 }} />}
          {qrResult && (
            <Text style={{ color: '#fff', marginTop: 20, fontSize: 16, textAlign: 'center' }}>{qrResult}</Text>
          )}
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  uploadContainer: { flex: 1, margin: 20, justifyContent: 'center' },
  uploadBox: { padding: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minHeight: 300 },
  uploadTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 10 },
  uploadText: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 30, opacity: 0.9 },
  uploadButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
}); 