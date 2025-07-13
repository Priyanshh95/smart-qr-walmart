import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { Colors } from '../../assets/colors';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'name' | 'location' | null
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to get user initials from display name
  const getUserInitials = (displayName) => {
    if (!displayName || displayName.trim() === '') return 'U';
    
    const nameParts = displayName.trim().split(' ');
    if (nameParts.length === 1) {
      // Only first name provided - show first letter
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      // Full name provided - show first letter of first name + first letter of last name
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
  };

  // Function to get avatar URL with user's actual name
  const getAvatarUrl = (displayName) => {
    const initials = getUserInitials(displayName);
    console.log('Avatar Debug:', { displayName, initials });
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=10b981&color=fff&size=128`;
  };

  useEffect(() => {
    setUser(auth.currentUser);
    setName(auth.currentUser?.displayName || '');
    setLocation('Your Location'); // You can load this from backend/localStorage if needed
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/signin');
    } catch (error) {
      Alert.alert('Sign Out Error', error.message);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingField === 'name') {
        await updateProfile(auth.currentUser, { displayName: name });
        setUser({ ...auth.currentUser, displayName: name });
        Alert.alert('Success', 'Name updated!');
      } else if (editingField === 'location') {
        // Save location to backend/localStorage if needed
        Alert.alert('Success', 'Location updated!');
      }
      setEditingField(null);
    } catch (error) {
      Alert.alert('Update Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FBF6E2' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.centralizedScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
            <Image
              key={user.displayName || 'default'} // Force re-render when name changes
              source={{ uri: user.photoURL || getAvatarUrl(user.displayName) }}
              style={styles.avatar}
            />
            <View style={styles.editIconWrapper}>
              <Feather name="edit-2" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.displayName}>{user.displayName || 'User'}</Text>
        </View>
        <View style={styles.cardList}>
          {/* Name Field */}
          <ProfileCard
            icon={<Ionicons name="person-outline" size={22} color="#10B981" />}
            value={editingField === 'name' ? (
              <EditField
                value={name}
                onChangeText={setName}
                onSave={handleSave}
                onCancel={() => setEditingField(null)}
                loading={loading}
              />
            ) : (
              name || 'User'
            )}
            editable
            onEdit={() => setEditingField('name')}
          />
          {/* Email Field */}
          <ProfileCard
            icon={<MaterialIcons name="email" size={22} color="#10B981" />}
            value={user.email}
            editable
            onEdit={() => Alert.alert('Edit Email', 'Email editing requires re-authentication and is not implemented in this demo.')}
          />
          {/* Password Field */}
          <ProfileCard
            icon={<Feather name="lock" size={22} color="#10B981" />}
            value={'********'}
            editable
            onEdit={() => Alert.alert('Edit Password', 'Password editing requires re-authentication and is not implemented in this demo.')}
          />
          {/* Location Field */}
          <ProfileCard
            icon={<Entypo name="location-pin" size={22} color="#10B981" />}
            value={editingField === 'location' ? (
              <EditField
                value={location}
                onChangeText={setLocation}
                onSave={handleSave}
                onCancel={() => setEditingField(null)}
                loading={loading}
              />
            ) : (
              location
            )}
            editable
            onEdit={() => setEditingField('location')}
          />
          {/* Support Row */}
          <ProfileCard
            icon={<Feather name="help-circle" size={22} color="#10B981" />}
            value={'Support'}
            onPress={() => router.push('/support')}
            arrow
          />
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="log-out" size={20} color="#FF6B6B" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const EditField = ({ value, onChangeText, onSave, onCancel, loading }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={{
        flex: 1,
        fontSize: 16,
        color: Colors.dark.text,
        backgroundColor: Colors.light.background,
        borderRadius: 6,
        paddingHorizontal: 8,
        marginRight: 6,
        borderWidth: 1,
        borderColor: Colors.SECONDARY,
      }}
      editable={!loading}
      autoFocus
    />
    <TouchableOpacity onPress={onSave} disabled={loading} style={{ marginRight: 6 }}>
      <Feather name="check" size={20} color={Colors.SECONDARY} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onCancel} disabled={loading}>
      <Feather name="x" size={20} color="#ef4444" />
    </TouchableOpacity>
  </View>
);

const ProfileCard = ({ icon, value, editable, onEdit, onPress, arrow }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={editable || onPress ? 0.7 : 1}
    onPress={onPress || undefined}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      {icon}
      <View style={{ flex: 1, marginLeft: 12 }}>{typeof value === 'string' ? <Text style={styles.cardText}>{value}</Text> : value}</View>
    </View>
    {editable && !arrow && (
      <TouchableOpacity onPress={onEdit} style={{ marginLeft: 8 }}>
        <Feather name="edit-2" size={18} color={Colors.SECONDARY} />
      </TouchableOpacity>
    )}
    {arrow && <Feather name="chevron-right" size={20} color={Colors.SECONDARY} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
  centralizedScroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
    backgroundColor: '#FBF6E2',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FBF6E2',
    paddingHorizontal: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#10B981',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 18,
    padding: 6,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  cardList: {
    width: '100%',
    maxWidth: 400,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  cardText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 80,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    minWidth: 300,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF6E2',
  },
  loadingText: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Profile;