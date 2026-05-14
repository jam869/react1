import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, useWindowDimensions } from 'react-native';
import MapView, { Marker, Circle, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import CHEMIN_VERS_MAISON from '../../../assets/path.json';

const ENTREPOTS = [
  { id: 1, name: 'Entrepôt Laval', latitude: 45.5601, longitude: -73.7120, titre: 'Laval Branch' },
  { id: 2, name: 'Entrepôt Longueuil', latitude: 45.5312, longitude: -73.5126, titre: 'South Shore Branch' },
  { id: 3, name: 'Entrepôt West Island', latitude: 45.4475, longitude: -73.8392, titre: 'West Island Branch' },
  { id: 4, name: 'Entrepôt Centre-Ville', latitude: 45.5017, longitude: -73.5673, titre: 'Downtown Branch' },
  { id: 5, name: 'Entrepôt Rosemont', latitude: 45.5469, longitude: -73.5828, titre: 'Rosemont Branch' },
];

const MAISON = { latitude: 45.5088, longitude: -73.5540, nom: 'Ma Maison' };

const ICONE_ENTREPOT = 'https://cdn-icons-png.flaticon.com/512/2312/2312563.png';
const ICONE_MAISON = 'https://cdn-icons-png.flaticon.com/512/25/25694.png';

export default function PageEntrepots() {
  const { t } = useTranslation();
  const refCarte = useRef(null);
  const [idSelectionne, setIdSelectionne] = useState(null);
  const { height: hauteur, width: largeur } = useWindowDimensions();

  const [region, setRegion] = useState({
    latitude: 45.5088,
    longitude: -73.5616,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const surAppuiMarqueur = (id) => {
    setIdSelectionne(id);
  };

  const surAppuiListe = (item) => {
    setIdSelectionne(item.id);
    refCarte.current?.animateToRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  return (
    <View style={styles.conteneur}>
      <Stack.Screen options={{ headerShown: true, title: t('warehouses') }} />
      
      <View style={styles.conteneurListe}>
        <FlatList
          data={ENTREPOTS}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable 
              style={[styles.itemListe, idSelectionne === item.id && styles.itemSelectionne]}
              onPress={() => surAppuiListe(item)}
            >
              <Text style={[styles.texteListe, idSelectionne === item.id && styles.texteSelectionne]}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <View style={styles.conteneurCarte}>
        <MapView
          ref={refCarte}
          provider={PROVIDER_GOOGLE}
          style={styles.carte}
          initialRegion={region}
        >
          <Marker
            coordinate={MAISON}
            title={MAISON.nom}
            image={{ uri: ICONE_MAISON }}
            style={{ width: 40, height: 40 }}
          />

          {ENTREPOTS.map(entrepôt => (
            <React.Fragment key={entrepôt.id}>
              <Marker
                coordinate={{ latitude: entrepôt.latitude, longitude: entrepôt.longitude }}
                title={entrepôt.titre}
                onPress={() => surAppuiMarqueur(entrepôt.id)}
              >
                <Image source={{ uri: ICONE_ENTREPOT }} style={styles.imageMarqueur} />
              </Marker>
              
              <Circle
                center={{ latitude: entrepôt.latitude, longitude: entrepôt.longitude }}
                radius={5000}
                fillColor="rgba(0, 122, 255, 0.1)"
                strokeColor="rgba(0, 122, 255, 0.3)"
              />
            </React.Fragment>
          ))}

          <Polyline
            coordinates={CHEMIN_VERS_MAISON}
            strokeColor="#FF3B30"
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    flexDirection: 'column',
  },
  conteneurListe: {
    flex: 0.25,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  conteneurCarte: {
    flex: 0.75,
  },
  carte: {
    ...StyleSheet.absoluteFillObject,
  },
  itemListe: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemSelectionne: {
    backgroundColor: '#007AFF',
  },
  texteListe: {
    fontSize: 16,
  },
  texteSelectionne: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageMarqueur: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
});
