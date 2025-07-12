import React from 'react';
import { View, Text } from 'react-native';

export default function QRScannerIndex() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>QR Scanner</Text>
      <Text style={{ marginTop: 10, color: '#666', fontSize: 16 }}>Select a scan option from the app.</Text>
    </View>
  );
} 