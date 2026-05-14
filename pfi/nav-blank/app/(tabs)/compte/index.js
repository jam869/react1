import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

export default function PageCompte() {
  const { user: utilisateur, updateUser: mettreAJourUtilisateur } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [motDePasse, setMotDePasse] = useState(utilisateur?.mdp || '');
  const [adresse, setAdresse] = useState(utilisateur?.adresse || '');
  const [langue, setLangue] = useState(utilisateur?.langue || 'auto');

  if (!utilisateur) return null;

  const gererSauvegarde = async () => {
    const bd = await SQLite.openDatabaseAsync('pfi_auto.db');
    await bd.runAsync('UPDATE Client SET mdp = ?, adresse = ?, langue = ? WHERE nom = ?', 
      [motDePasse, adresse, langue, utilisateur.nom]);
    
    mettreAJourUtilisateur({ mdp: motDePasse, adresse, langue });
    Alert.alert('Success', 'Profile updated');
  };

  const OptionLangue = ({ etiquette, valeur }) => (
    <TouchableOpacity 
      style={styles.optionRadio} 
      onPress={() => setLangue(valeur)}
    >
      <Ionicons 
        name={langue === valeur ? "radio-button-on" : "radio-button-off"} 
        size={24} 
        color="#007AFF" 
      />
      <Text style={styles.etiquetteRadio}>{etiquette}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.conteneur}>
      <Text style={styles.titre}>{t('account')}</Text>
      
      <View style={styles.section}>
        <Text style={styles.etiquette}>{t('username')}</Text>
        <TextInput style={[styles.champSaisie, styles.champDesactive]} value={utilisateur.nom} editable={false} />
      </View>

      <View style={styles.section}>
        <Text style={styles.etiquette}>{t('password')}</Text>
        <TextInput style={styles.champSaisie} value={motDePasse} onChangeText={setMotDePasse} secureTextEntry />
      </View>

      <View style={styles.section}>
        <Text style={styles.etiquette}>{t('address')}</Text>
        <TextInput style={styles.champSaisie} value={adresse} onChangeText={setAdresse} />
      </View>

      <View style={styles.section}>
        <Text style={styles.etiquette}>{t('language')}</Text>
        <OptionLangue etiquette="Français" valeur="fr" />
        <OptionLangue etiquette="English" valeur="en" />
        <OptionLangue etiquette="Auto" valeur="auto" />
      </View>

      <TouchableOpacity style={styles.boutonEnregistrer} onPress={gererSauvegarde}>
        <Text style={styles.texteEnregistrer}>{t('save')}</Text>
      </TouchableOpacity>

      <Link href="/compte/entrepots" asChild>
        <TouchableOpacity style={styles.boutonLien}>
          <Ionicons name="map-outline" size={24} color="#007AFF" />
          <Text style={styles.texteLien}>{t('warehouses')}</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  etiquette: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  champSaisie: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  champDesactive: {
    color: '#888',
    backgroundColor: '#eee',
  },
  optionRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  etiquetteRadio: {
    marginLeft: 10,
    fontSize: 16,
  },
  boutonEnregistrer: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  texteEnregistrer: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  boutonLien: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    marginBottom: 50,
  },
  texteLien: {
    marginLeft: 10,
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
