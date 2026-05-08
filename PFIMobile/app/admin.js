import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { GlobalContext } from './_layout';

export default function AdminScreen() {
  const db = useSQLiteContext();
  const { usager, deconnexion } = useContext(GlobalContext);
  const [produits, setProduits] = useState([]);

  const chargerProduits = async () => {
    const allRows = await db.getAllAsync('SELECT * FROM Produit');
    setProduits(allRows);
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  const supprimerProduit = async (id) => {
    await db.runAsync('DELETE FROM Produit WHERE id = ?', [id]);
    chargerProduits();
  };

  const ajouterProduit = async () => {
    await db.runAsync(
      'INSERT INTO Produit (nom, description, prix, image) VALUES (?, ?, ?, ?)',
      ['Nouvelle Voiture', 'Description test', 50000, 'https://reactnative.dev/img/tiny_logo.png']
    );
    chargerProduits();
  };

  if (!usager || Number(usager.admin) !== 1) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>Acces admin requis.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={deconnexion} style={styles.buttonLogout}>
        <Text style={styles.buttonText}>Deconnexion</Text>
      </Pressable>

      <Pressable onPress={ajouterProduit} style={styles.buttonAdd}>
        <Text style={styles.buttonText}>+ Ajouter un produit</Text>
      </Pressable>

      <FlatList
        data={produits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={{ fontWeight: 'bold' }}>{item.nom}</Text>
              <Text>{item.prix} $</Text>
            </View>
            <Pressable
              onPress={() =>
                Alert.alert('Confirmation', 'Supprimer ce produit ?', [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Supprimer', style: 'destructive', onPress: () => supprimerProduit(item.id) },
                ])
              }
              style={styles.buttonDel}
            >
              <Text style={{ color: 'white' }}>Supprimer</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  buttonLogout: { backgroundColor: '#c0392b', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonAdd: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  card: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 8 },
  image: { width: 50, height: 50, marginRight: 10 },
  info: { flex: 1 },
  buttonDel: { backgroundColor: 'red', padding: 10, borderRadius: 5 },
});
