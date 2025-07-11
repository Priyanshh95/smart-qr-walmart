import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { Colors } from '../../assets/colors';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'name' | 'location' | null
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      style={{ flex: 1, backgroundColor: Colors.light.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.centralizedScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
            <Image
              source={{ uri: user.photoURL || AVATAR_PLACEHOLDER }}
              style={styles.avatar}
            />
            <View style={styles.editIconWrapper}>
              <Feather name="edit-2" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileTitle}>Profile</Text>
          <Text style={styles.displayName}>{user.displayName || 'User'}</Text>
        </View>
        <View style={styles.cardList}>
          {/* Name Field */}
          <ProfileCard
            icon={<Ionicons name="person-outline" size={22} color={Colors.SECONDARY} />}
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
            icon={<MaterialIcons name="email" size={22} color={Colors.SECONDARY} />}
            value={user.email}
            editable
            onEdit={() => Alert.alert('Edit Email', 'Email editing requires re-authentication and is not implemented in this demo.')}
          />
          {/* Password Field */}
          <ProfileCard
            icon={<Feather name="lock" size={22} color={Colors.SECONDARY} />}
            value={'********'}
            editable
            onEdit={() => Alert.alert('Edit Password', 'Password editing requires re-authentication and is not implemented in this demo.')}
          />
          {/* Location Field */}
          <ProfileCard
            icon={<Entypo name="location-pin" size={22} color={Colors.SECONDARY} />}
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
            icon={<Feather name="help-circle" size={22} color={Colors.SECONDARY} />}
            value={'Support'}
            onPress={() => Alert.alert('Support', 'Support feature coming soon!')}
            arrow
          />
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="log-out" size={20} color={Colors.SECONDARY} style={{ marginRight: 8 }} />
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
  centralizedScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    backgroundColor: Colors.light.background,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.SECONDARY,
    backgroundColor: '#fff',
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.SECONDARY,
    marginTop: 8,
    marginBottom: 2,
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  cardList: {
    width: '100%',
    maxWidth: 400,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minWidth: 300,
  },
  cardText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  logoutBtn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minWidth: 300,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: Colors.SECONDARY,
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    color: Colors.SECONDARY,
    fontSize: 18,
  },
});

export default Profile;