import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { GlobalContext } from '../../../Context';
import { i18n } from '../../../locales/i18n';

export default function ListeProduits() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { langue, theme } = useContext(GlobalContext);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');

  i18n.locale = langue === 'auto' ? 'fr-CA' : langue;

  useEffect(() => {
    let actif = true;

    async function chargerDonnees() {
      try {
        const resultats = await db.getAllAsync('SELECT * FROM Produit ORDER BY id ASC');
        if (!actif) return;
        setProduits(resultats);
      } catch (erreur) {
        console.error('Erreur de chargement des produits', erreur);
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }
    chargerDonnees();

    return () => {
      actif = false;
    };
  }, [db]);

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

  if (chargement) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  const produitsFiltrés = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#121212' : '#fff' },
    text: { color: isDark ? '#fff' : '#333' },
    card: { borderBottomColor: isDark ? '#333' : '#eee' },
    search: { 
      backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0',
      color: isDark ? '#fff' : '#000',
      borderColor: isDark ? '#333' : '#ccc'
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <TextInput
        style={[styles.searchBar, dynamicStyles.search]}
        placeholder={i18n.t('recherche_placeholder')}
        placeholderTextColor={isDark ? '#888' : '#aaa'}
        value={recherche}
        onChangeText={setRecherche}
      />
      <FlatList
        data={produitsFiltrés}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
        <Pressable
            style={[styles.card, dynamicStyles.card]}
            onPress={() =>
              router.push({
                pathname: '/produits/details',
                params: { id: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.miniature} />

            <View style={styles.infoContainer}>
              <Text style={[styles.nomVoiture, dynamicStyles.text]}>{item.nom}</Text>
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
  searchBar: {
    margin: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
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
