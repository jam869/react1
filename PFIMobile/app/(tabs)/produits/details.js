import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, Alert, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { GlobalContext } from '../../../Context';
import { i18n } from '../../../locales/i18n';

export default function DetailsProduit() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const [produit, setProduit] = useState(null);
  const { setPanier, langue, theme } = useContext(GlobalContext);

  i18n.locale = langue === 'auto' ? 'fr-CA' : langue;

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

  const formaterPrix = (montant) => {
    try {
      return new Intl.NumberFormat(langue === 'auto' ? 'fr-CA' : langue, { 
        style: 'currency', 
        currency: 'CAD' 
      }).format(montant);
    } catch (e) {
      return Number(montant).toFixed(2) + ' $';
    }
  };

  const ajouterAuPanier = () => {
    console.log('--- AJOUT AU PANIER ---', produit.nom);
    setPanier((precedent) => {
      console.log('État panier précédent:', precedent);
      const existe = precedent.find((item) => item.id === produit.id);
      let nouveauPanier;
      if (existe) {
        nouveauPanier = precedent.map((item) =>
          item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      } else {
        nouveauPanier = [...precedent, { ...produit, quantite: 1 }];
      }
      console.log('Nouvel état panier calculé:', nouveauPanier);
      return nouveauPanier;
    });
    Alert.alert(i18n.t('succes') || 'Succès', i18n.t('produit_ajoute') || 'Produit ajouté au panier.');
  };

  const RenduEtoiles = ({ note }) => {
    return (
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Text key={i} style={{ fontSize: 24, color: i <= note ? '#f1c40f' : '#bdc3c7' }}>
            ★
          </Text>
        ))}
      </View>
    );
  };

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#121212' : '#fff' },
    text: { color: isDark ? '#fff' : '#000' },
    desc: { color: isDark ? '#bbb' : '#666' }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Image source={{ uri: produit.image }} style={styles.image} />
      <Text style={[styles.name, dynamicStyles.text]}>{produit.nom}</Text>
      <RenduEtoiles note={4} />
      <Text style={[styles.desc, dynamicStyles.desc]}>{produit.description}</Text>
      <Text style={styles.price}>{formaterPrix(produit.prix)}</Text>
      
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