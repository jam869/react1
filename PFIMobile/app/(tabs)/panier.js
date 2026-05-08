import React, { useContext } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { GlobalContext } from '../../Context';
import { i18n } from '../../locales/i18n';
export default function PanierClient() {
  const { panier, setPanier, usager } = useContext(GlobalContext);

  const total = panier.reduce((somme, item) => somme + Number(item.prix || 0), 0);
i18n.locale = langue;
  const acheter = () => {
    if (panier.length === 0) return;
    Alert.alert('Succes', 'Achat complete.');
    setPanier([]);
  };

  if (!usager) {
    return (
      <View style={styles.container}>
        <Text style={styles.vide}>Connectez-vous pour utiliser le panier.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {panier.length === 0 ? (
        <Text style={styles.vide}>{i18n.t('vide')}</Text>
      ) : (
        <FlatList
          data={panier}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={{ flex: 1 }}>{item.nom}</Text>
              <Text>{Number(item.prix).toFixed(2)} $</Text>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.total}>{i18n.t('total')} {total.toFixed(2)} $</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={() => setPanier([])} style={[styles.button, { backgroundColor: 'red' }]}>
            <Text style={{ color: 'white' }}>Vider</Text>
          </Pressable>
          <Pressable onPress={acheter} style={[styles.button, { backgroundColor: 'blue' }]}>
            <Text style={{ color: 'white' }}>{i18n.t('acheter')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  vide: { textAlign: 'center', fontSize: 18, marginTop: 50 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  image: { width: 40, height: 40, marginRight: 10 },
  footer: { marginTop: 20, borderTopWidth: 1, paddingTop: 10 },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginBottom: 15 },
  button: { padding: 15, borderRadius: 5, flex: 0.48, alignItems: 'center' },
});

