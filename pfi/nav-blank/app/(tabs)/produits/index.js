import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Accelerometer } from 'expo-sensors';

export default function PageProduits() {
  const [produits, setProduits] = useState([]);
  const { t } = useTranslation();
  const router = useRouter();

  const chargerProduits = async () => {
    const bdd = await SQLite.openDatabaseAsync('pfi_auto.db');
    const toutesLesLignes = await bdd.getAllAsync('SELECT * FROM Produit');
    setProduits(toutesLesLignes);
  };

  useFocusEffect(
    useCallback(() => {
      chargerProduits();
      
      const abonnement = Accelerometer.addListener(donneesAccelerometre => {
        const { x, y, z } = donneesAccelerometre;
        const forceTotale = Math.abs(x) + Math.abs(y) + Math.abs(z);
        
        if (forceTotale > 3.0) {
          if (produits.length > 0) {
            const produitAleatoire = produits[Math.floor(Math.random() * produits.length)];
            router.push({ pathname: '/(tabs)/produits/[id]', params: { id: produitAleatoire.id } });
          }
        }
      });
      
      Accelerometer.setUpdateInterval(500);

      return () => abonnement && abonnement.remove();
    }, [produits])
  );

  const afficherElement = ({ item: element }) => (
    <Link href={{ pathname: '/(tabs)/produits/[id]', params: { id: element.id } }} asChild>
      <Pressable style={styles.item}>
        <Image source={{ uri: element.image }} style={styles.thumbnail} />
        <View style={styles.itemInfo}>
          <Text style={styles.name}>{element.nom}</Text>
          <Text style={styles.priceTag}>{element.prix.toLocaleString()} $</Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('products')}</Text>
      <Text style={styles.hint}>Secouez pour un coup de cœur !</Text>
      <FlatList
        data={produits}
        keyExtractor={element => element.id.toString()}
        renderItem={afficherElement}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 20,
    marginBottom: 5,
  },
  hint: {
    color: '#888',
    fontSize: 12,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  thumbnail: {
    width: 120,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  name: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceTag: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
});
