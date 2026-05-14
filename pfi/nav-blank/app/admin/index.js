import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function PageAdministration() {
  const { user: utilisateur } = useAuth();
  const [produits, setProduits] = useState([]);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauPrix, setNouveauPrix] = useState('');
  const [nouvelleDescription, setNouvelleDescription] = useState('');
  const [nouvelleImage, setNouvelleImage] = useState('');
  const { t } = useTranslation();

  const chargerProduits = async () => {
    const bd = await SQLite.openDatabaseAsync('pfi_auto.db');
    const toutesLesLignes = await bd.getAllAsync('SELECT * FROM Produit');
    setProduits(toutesLesLignes);
  };

  useFocusEffect(
    useCallback(() => {
      chargerProduits();
    }, [])
  );

  if (!utilisateur) return null;

  const gererAjoutProduit = async () => {
    if (!nouveauNom || !nouveauPrix) {
      Alert.alert('Error', 'Please enter name and price');
      return;
    }
    const bd = await SQLite.openDatabaseAsync('pfi_auto.db');
    await bd.runAsync('INSERT INTO Produit (nom, description, prix, image) VALUES (?, ?, ?, ?)', 
      [nouveauNom, nouvelleDescription, parseFloat(nouveauPrix), nouvelleImage]);
    setNouveauNom('');
    setNouveauPrix('');
    setNouvelleDescription('');
    setNouvelleImage('');
    chargerProduits();
  };

  const gererSuppressionProduit = async (id) => {
    const bd = await SQLite.openDatabaseAsync('pfi_auto.db');
    await bd.runAsync('DELETE FROM Produit WHERE id = ?', [id]);
    chargerProduits();
  };

  const afficherElement = ({ item: element }) => (
    <View style={styles.element}>
      <Image source={{ uri: element.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR38cpx6uXtYmLcjVefkuX-8F0xpeU_6o9Nw&s' }} style={styles.miniature} />
      <View style={styles.infoElement}>
        <Text style={styles.nomElement}>{element.nom}</Text>
        <Text>{element.prix} $</Text>
      </View>
      <TouchableOpacity onPress={() => gererSuppressionProduit(element.id)} style={styles.boutonSupprimer}>
        <Text style={styles.texteSupprimer}>{t('delete')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.conteneur}>
      <Header />
      <View style={styles.contenu}>
        <Text style={styles.titre}>{t('admin')}</Text>
        
        <View style={styles.formulaireAjout}>
          <TextInput style={styles.champSaisie} placeholder={t('products')} value={nouveauNom} onChangeText={setNouveauNom} />
          <TextInput style={styles.champSaisie} placeholder={t('price')} value={nouveauPrix} onChangeText={setNouveauPrix} keyboardType="numeric" />
          <TextInput style={styles.champSaisie} placeholder="Description" value={nouvelleDescription} onChangeText={setNouvelleDescription} />
          <TextInput style={styles.champSaisie} placeholder="Image URL" value={nouvelleImage} onChangeText={setNouvelleImage} />
          <TouchableOpacity style={styles.boutonAjouter} onPress={gererAjoutProduit}>
            <Text style={styles.texteAjouter}>{t('add')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={produits}
          keyExtractor={element => element.id.toString()}
          renderItem={afficherElement}
          style={styles.liste}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contenu: {
    flex: 1,
    padding: 15,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formulaireAjout: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  champSaisie: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  boutonAjouter: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  texteAjouter: {
    color: '#fff',
    fontWeight: 'bold',
  },
  liste: {
    flex: 1,
  },
  element: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  miniature: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  infoElement: {
    flex: 1,
    marginLeft: 10,
  },
  nomElement: {
    fontWeight: 'bold',
  },
  boutonSupprimer: {
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  texteSupprimer: {
    color: '#fff',
    fontSize: 12,
  },
});
