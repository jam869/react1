import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

export default function ComptePage() {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [mdp, setMdp] = useState(user?.mdp || '');
  const [adresse, setAdresse] = useState(user?.adresse || '');
  const [langue, setLangue] = useState(user?.langue || 'auto');

  if (!user) return null;

  const handleSave = async () => {
    const db = await SQLite.openDatabaseAsync('pfi_auto.db');
    await db.runAsync('UPDATE Client SET mdp = ?, adresse = ?, langue = ? WHERE nom = ?', 
      [mdp, adresse, langue, user.nom]);
    
    updateUser({ mdp, adresse, langue });
    Alert.alert('Success', 'Profile updated');
  };

  const LanguageOption = ({ label, value }) => (
    <TouchableOpacity 
      style={styles.radioOption} 
      onPress={() => setLangue(value)}
    >
      <Ionicons 
        name={langue === value ? "radio-button-on" : "radio-button-off"} 
        size={24} 
        color="#007AFF" 
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('account')}</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>{t('username')}</Text>
        <TextInput style={[styles.input, styles.disabledInput]} value={user.nom} editable={false} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('password')}</Text>
        <TextInput style={styles.input} value={mdp} onChangeText={setMdp} secureTextEntry />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('address')}</Text>
        <TextInput style={styles.input} value={adresse} onChangeText={setAdresse} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('language')}</Text>
        <LanguageOption label="Français" value="fr" />
        <LanguageOption label="English" value="en" />
        <LanguageOption label="Auto" value="auto" />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{t('save')}</Text>
      </TouchableOpacity>

      <Link href="/compte/entrepots" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Ionicons name="map-outline" size={24} color="#007AFF" />
          <Text style={styles.linkText}>{t('warehouses')}</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  disabledInput: {
    color: '#888',
    backgroundColor: '#eee',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
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
  linkText: {
    marginLeft: 10,
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
