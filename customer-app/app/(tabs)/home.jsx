import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../assets/colors';
import { LinearGradient } from 'expo-linear-gradient';

// Reduce total spacing to increase box size
const BOX_MARGIN = 6;
const BOXES_PER_ROW = 2;
const TOTAL_HORIZONTAL_PADDING = 2 * 16; // 16px padding on each side
const TOTAL_MARGIN = (BOXES_PER_ROW * 2) * BOX_MARGIN; // margin on both sides of each box
const BOX_SIZE = (Dimensions.get('window').width - TOTAL_HORIZONTAL_PADDING - TOTAL_MARGIN) / BOXES_PER_ROW;

const dummyImages = [
  require('../../assets/images/qr.png'),
  require('../../assets/images/track.png'),
  require('../../assets/images/recycle.png'),
  require('../../assets/images/ingredient.png'),
];

const homeTopImage = require('../../assets/images/hometop.png');

const boxData = [
  {
    title: 'Scan QR Code',
    gradient: ['#FF7F7F', '#FFB3A7'],
    image: dummyImages[0],
    onPress: () => {},
  },
  {
    title: 'Track a Product',
    gradient: ['#4FC3F7', '#A7E6FF'],
    image: dummyImages[1],
    onPress: () => {},
  },
  {
    title: 'Ways to Recycle',
    gradient: ['#34D399', '#A7FFD6'],
    image: dummyImages[2],
    onPress: () => {},
  },
  {
    title: 'Ingredient Check',
    gradient: ['#F472B6', '#FFD6E0'],
    image: dummyImages[3],
    onPress: () => {},
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={homeTopImage} style={styles.topImage} resizeMode="contain" />
      <View style={styles.grid}>
        {boxData.map((box, idx) => (
          <TouchableOpacity
            key={box.title}
            style={styles.touchable}
            activeOpacity={0.9}
            onPress={box.onPress}
          >
            <LinearGradient
              colors={box.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.box}
            >
              <Image source={box.image} style={styles.icon} resizeMode="contain" />
              <Text style={styles.title}>{box.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E2',
    justifyContent: 'flex-end', // push grid to bottom
    paddingBottom: 30, 
  },
  topImage: {
    width: '90%',
    height: 350,
    alignSelf: 'center',
    marginBottom: 0,
    marginTop: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    maxWidth: 440,
    paddingHorizontal: 8,
  },
  touchable: {
    margin: BOX_MARGIN,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});