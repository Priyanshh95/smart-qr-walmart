import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const Support = () => {
  const router = useRouter();

  const supportItems = [
    {
      icon: <Ionicons name="help-circle-outline" size={24} color="#10B981" />,
      title: 'FAQ',
      subtitle: 'Frequently Asked Questions',
      onPress: () => {
        // Navigate to FAQ or show FAQ modal
        alert('FAQ section coming soon!');
      }
    },
    {
      icon: <MaterialIcons name="email" size={24} color="#10B981" />,
      title: 'Email Support',
      subtitle: 'support@nutritrace.com',
      onPress: () => {
        Linking.openURL('mailto:support@nutritrace.com');
      }
    },
    {
      icon: <Ionicons name="call-outline" size={24} color="#10B981" />,
      title: 'Call Us',
      subtitle: '+1 (555) 123-4567',
      onPress: () => {
        Linking.openURL('tel:+15551234567');
      }
    },
    {
      icon: <Feather name="message-circle" size={24} color="#10B981" />,
      title: 'Live Chat',
      subtitle: 'Available 24/7',
      onPress: () => {
        alert('Live chat feature coming soon!');
      }
    },
    {
      icon: <Ionicons name="document-text-outline" size={24} color="#10B981" />,
      title: 'User Guide',
      subtitle: 'How to use NutriTrace',
      onPress: () => {
        alert('User guide coming soon!');
      }
    },
    {
      icon: <Ionicons name="bug-outline" size={24} color="#10B981" />,
      title: 'Report Bug',
      subtitle: 'Help us improve',
      onPress: () => {
        alert('Bug report feature coming soon!');
      }
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <Text style={styles.headerSubtitle}>Help</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeCard}>
            <Ionicons name="heart" size={32} color="#FF6B6B" />
            <Text style={styles.welcomeTitle}>How can we help you?</Text>
            <Text style={styles.welcomeSubtitle}>
              We're here to help you get the most out of NutriTrace. Choose an option below to get started.
            </Text>
          </View>
        </View>

        <View style={styles.supportList}>
          {supportItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.supportCard}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#10B981" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactText}>
              Need immediate assistance? Our support team is available 24/7 to help you with any questions or issues.
            </Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeCard: {
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
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  supportList: {
    marginBottom: 24,
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  contactText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Support; 