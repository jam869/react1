import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panneau d'administration</Text>
      
      <View style={styles.actions}>
        <Button title="+ Ajouter un produit" color="green" onPress={() => {}} />
      </View>

      {/* Ici, tu mapperas ta liste de produits provenant de ta base de données SQL/PHP.
        Exemple d'item sans bouton d'achat, mais avec un bouton supprimer :
      */}
      <View style={styles.productItem}>
        <Text>Produit #1</Text>
        <Button title="Supprimer" color="red" onPress={() => {}} />
        {/* Note : Aucun bouton "Acheter" ici */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  actions: { marginBottom: 20 },
  productItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }
});