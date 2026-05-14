import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import * as SQLite from 'expo-sqlite';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

export default function Accueil() {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const { login: seConnecter } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const gererConnexion = async (utilisateurFourni = null) => {
    let utilisateur = utilisateurFourni;
    
    if (!utilisateur) {
      const bdd = await SQLite.openDatabaseAsync('pfi_auto.db');
      utilisateur = await bdd.getFirstAsync('SELECT * FROM Client WHERE nom = ? AND mdp = ?', [nomUtilisateur, motDePasse]);
    }

    if (utilisateur) {
      seConnecter(utilisateur);
      if (utilisateur.admin) {
        router.replace('/admin');
      } else {
        router.replace('/produits');
      }
    } else {
      Alert.alert('Erreur', 'Nom d\'utilisateur ou mot de passe invalide');
    }
  };

  const gererAuthentificationBiometrique = async () => {
    const aMateriel = await LocalAuthentication.hasHardwareAsync();
    if (!aMateriel) return Alert.alert('Erreur', 'Biométrie non supportée');

    const resultat = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authentification Auto Prestige',
      fallbackLabel: 'Utiliser mot de passe',
    });

    if (resultat.success) {
      const bdd = await SQLite.openDatabaseAsync('pfi_auto.db');
      const utilisateur = await bdd.getFirstAsync('SELECT * FROM Client WHERE nom = ?', ['client']);
      if (utilisateur) gererConnexion(utilisateur);
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
            value={nomUtilisateur}
            onChangeText={setNomUtilisateur}
          />
          <TextInput
            style={styles.input}
            placeholder={t('Mot de passe')}
            placeholderTextColor="#888"
            value={motDePasse}
            secureTextEntry
            onChangeText={setMotDePasse}
          />
          
          <TouchableOpacity style={styles.button} onPress={() => gererConnexion()}>
            <Text style={styles.buttonText}>{t('Se connecter')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bioButton} onPress={gererAuthentificationBiometrique}>
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
    color: '#D4AF37',
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
