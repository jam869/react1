import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, Alert, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { GlobalContext } from '../../../Context';
import { i18n } from '../../../locales/i18n';
import Intl from 'intl';
import 'intl/locale-data/jsonp/fr-CA';
import 'intl/locale-data/jsonp/en-CA';

export default function DetailsProduit() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const [produit, setProduit] = useState(null);
  const { setPanier, langue } = useContext(GlobalContext);

  i18n.locale = langue;

  useEffect(() => {
    async function load() {
      const prod = await db.getFirstAsync('SELECT * FROM Produit WHERE id = ?', [id]);
      setProduit(prod || null);
    }
    load();
  }, [db, id]);

  if (!produit) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Chargement...</Text>;
  }

  const formatter = new Intl.NumberFormat(langue, { style: 'currency', currency: 'CAD' });

  const ajouterAuPanier = () => {
    setPanier((precedent) => [...precedent, produit]);
    Alert.alert('Succès', 'Produit ajouté au panier.');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: produit.image }} style={styles.image} />
      <Text style={styles.name}>{produit.nom}</Text>
      <Text style={styles.desc}>{produit.description}</Text>
      <Text style={styles.price}>{formatter.format(produit.prix)}</Text>
      
      {/* ON UTILISE UN PRESSABLE POUR S'ASSURER QU'IL EST TOUJOURS VISIBLE ET CLIQUABLE */}
      <Pressable onPress={ajouterAuPanier} style={styles.btnAjout}>
        <Text style={styles.btnText}>
           {i18n.t('ajout') || 'Ajouter au panier'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 250, height: 250, marginBottom: 20, borderRadius: 15 },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 15 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#2ecc71', marginBottom: 20 },
  btnAjout: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});