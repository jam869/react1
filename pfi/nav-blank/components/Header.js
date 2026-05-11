import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.userText}>{user.nom}</Text>
        <View style={styles.langBadge}>
          <Text style={styles.langText}>{i18n.language.toUpperCase()}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  langBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  langText: {
    fontSize: 10,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff444455',
  },
  logoutText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default Header;
