import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import Header from '../../components/Header';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [newNom, setNewNom] = useState('');
  const [newPrix, setNewPrix] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');
  const { t } = useTranslation();

  const loadProducts = async () => {
    const db = await SQLite.openDatabaseAsync('pfi_auto.db');
    const allRows = await db.getAllAsync('SELECT * FROM Produit');
    setProducts(allRows);
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  if (!user) return null;

  const handleAddProduct = async () => {
    if (!newNom || !newPrix) {
      Alert.alert('Error', 'Please enter name and price');
      return;
    }
    const db = await SQLite.openDatabaseAsync('pfi_auto.db');
    await db.runAsync('INSERT INTO Produit (nom, description, prix, image) VALUES (?, ?, ?, ?)', 
      [newNom, newDesc, parseFloat(newPrix), newImg]);
    setNewNom('');
    setNewPrix('');
    setNewDesc('');
    setNewImg('');
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    const db = await SQLite.openDatabaseAsync('pfi_auto.db');
    await db.runAsync('DELETE FROM Produit WHERE id = ?', [id]);
    loadProducts();
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR38cpx6uXtYmLcjVefkuX-8F0xpeU_6o9Nw&s' }} style={styles.thumbnail} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.nom}</Text>
        <Text>{item.prix} $</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>{t('delete')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>{t('admin')}</Text>
        
        <View style={styles.addForm}>
          <TextInput style={styles.input} placeholder={t('products')} value={newNom} onChangeText={setNewNom} />
          <TextInput style={styles.input} placeholder={t('price')} value={newPrix} onChangeText={setNewPrix} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Description" value={newDesc} onChangeText={setNewDesc} />
          <TextInput style={styles.input} placeholder="Image URL" value={newImg} onChangeText={setNewImg} />
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addText}>{t('add')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addForm: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
  },
});
