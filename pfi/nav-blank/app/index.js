import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import * as SQLite from 'expo-sqlite';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogin = async (providedUser = null) => {
    let user = providedUser;
    
    if (!user) {
      const db = await SQLite.openDatabaseAsync('pfi_auto.db');
      user = await db.getFirstAsync('SELECT * FROM Client WHERE nom = ? AND mdp = ?', [username, password]);
    }

    if (user) {
      login(user);
      if (user.admin) {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)/produits');
      }
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return Alert.alert('Error', 'Biometrics not supported');

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authentification Auto Prestige',
      fallbackLabel: 'Utiliser mot de passe',
    });

    if (result.success) {
      const db = await SQLite.openDatabaseAsync('pfi_auto.db');
      // For demo: log in as the default client
      const user = await db.getFirstAsync('SELECT * FROM Client WHERE nom = ?', ['client']);
      if (user) handleLogin(user);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>AUTO PRESTIGE</Text>
        <Text style={styles.subtitle}>AUTOMOBILE DE LUXE</Text>
        
        <Image 
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR38cpx6uXtYmLcjVefkuX-8F0xpeU_6o9Nw&s' }} 
          style={styles.logo} 
        />
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t('Nom d\'utilisateur')}
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder={t('Mot de passe')}
            placeholderTextColor="#888"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
          
          <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
            <Text style={styles.buttonText}>{t('Se connecter')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bioButton} onPress={handleBiometricAuth}>
            <Ionicons name="finger-print-outline" size={30} color="#D4AF37" />
            <Text style={styles.bioText}>Touch / Face ID</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Auto Prestige | Nathan Aguiar & Zachary Bélanger</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0A0A0A',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#D4AF37', // Gold
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    letterSpacing: 5,
    marginBottom: 40,
  },
  logo: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#333',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#1A1A1A',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    color: '#FFF',
  },
  button: {
    backgroundColor: '#D4AF37',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 10,
  },
  bioText: {
    color: '#D4AF37',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 60,
  },
  footerText: {
    color: '#555',
    fontSize: 12,
  },
});
