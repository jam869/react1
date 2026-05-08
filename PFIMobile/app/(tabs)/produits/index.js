import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { GlobalContext } from '../../../Context';
import { i18n } from '../../../locales/i18n';
import Intl from 'intl';
import 'intl/locale-data/jsonp/fr-CA';
import 'intl/locale-data/jsonp/en-CA';


export default function ListeProduits() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { langue } = useContext(GlobalContext);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);

  i18n.locale = langue;

  useEffect(() => {
    async function chargerDonnees() {
      try {
        const resultats = await db.getAllAsync('SELECT * FROM Produit ORDER BY id ASC');
        setProduits(resultats);
      } catch (erreur) {
        console.error('Erreur de chargement des produits', erreur);
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, [db]);

  const formaterPrix = (prix) => {
    return new Intl.NumberFormat(langue, { style: 'currency', currency: 'CAD' }).format(prix);
  };

  if (chargement) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
        <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/produits/details', 
                params: { id: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.miniature} />

            <View style={styles.infoContainer}>
              <Text style={styles.nomVoiture}>{item.nom}</Text>
              <Text style={styles.prixVoiture}>{formaterPrix(item.prix)}</Text>
            </View>

            <Text style={styles.fleche}>{'>'}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  miniature: {
    width: 80,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  nomVoiture: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  prixVoiture: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 4,
  },
  fleche: {
    fontSize: 20,
    color: '#ccc',
  },
});
