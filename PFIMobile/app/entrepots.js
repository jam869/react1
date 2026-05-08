import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions, StyleSheet, ScrollView, Image } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { i18n } from '../locales/i18n';

// 1. On importe le fichier JSON pour le tracer de la route (Phase 5)
import routeData from '../route.json'; 

export default function Entrepots() {
  const { height, width } = useWindowDimensions();
  
  // 2. État pour savoir quel entrepôt est sélectionné (pour allumer le bouton)
  const [activeId, setActiveId] = useState(null);

  const [region, setRegion] = useState({
    latitude: 45.4735,
    longitude: -73.5639,
    latitudeDelta: 0.1, // J'ai agrandi le zoom un peu pour voir les 5 km
    longitudeDelta: 0.1,
  });

  // 3. Tes 5 entrepôts avec des coordonnées réalistes
  const entrepots = [
    { id: 1, nom: 'Entrepôt Central', lat: 45.4800, lon: -73.5700 }, // La fin de la Polyline
    { id: 2, nom: 'Entrepôt Est', lat: 45.4700, lon: -73.5200 },
    { id: 3, nom: 'Entrepôt Ouest', lat: 45.4600, lon: -73.6000 },
    { id: 4, nom: 'Entrepôt Nord', lat: 45.5200, lon: -73.5800 },
    { id: 5, nom: 'Entrepôt Sud', lat: 45.4300, lon: -73.5600 },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* SECTION HAUT : 25% Liste des Boutons */}
      <View style={{ height: height * 0.25, backgroundColor: '#fff', padding: 15 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Nos sites :</Text>
        <ScrollView>
          {entrepots.map((e) => (
            <Pressable 
              key={e.id} 
              onPress={() => setActiveId(e.id)} // On change l'ID actif au clic
              style={[
                styles.listBtn,
                activeId === e.id && styles.activeBtn // Applique le style si allumé
              ]}
            >
              <Text style={{ color: activeId === e.id ? 'white' : 'black', fontWeight: '500' }}>
                {e.nom}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* SECTION BAS : 75% Carte */}
      <MapView
        style={{ height: height * 0.75, width }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
      >
        {/* Marqueur de la Maison (Localisation de l'utilisateur) */}
        <Marker coordinate={{ latitude: 45.4735, longitude: -73.5639 }} title="Maison">
          <Ionicons name="home" size={35} color="red" />
        </Marker>

        {/* Marqueurs des Entrepôts + Cercles de 5km */}
        {entrepots.map((e) => (
          <React.Fragment key={e.id}>
            <Marker 
              coordinate={{ latitude: e.lat, longitude: e.lon }} 
              title={e.nom}
              onPress={() => setActiveId(e.id)} // Allume le bouton dans la liste lors du clic sur la carte
            >
              {/* Image d'icône au lieu de la pin par défaut */}
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2830/2830312.png' }} 
                style={{ width: 40, height: 40 }} 
                resizeMode="contain" 
              />
            </Marker>

            {/* Cercle de 5km (5000 mètres) */}
            <Circle 
              center={{ latitude: e.lat, longitude: e.lon }} 
              radius={5000} 
              fillColor="rgba(0, 122, 255, 0.15)" 
              strokeColor="rgba(0, 122, 255, 0.5)" 
              strokeWidth={2}
            />
          </React.Fragment>
        ))}

        {/* La ligne directrice importée depuis route.json */}
        <Polyline coordinates={routeData} strokeColor="#e67e22" strokeWidth={5} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  listBtn: { 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#f9f9f9'
  },
  activeBtn: {
    backgroundColor: '#007AFF', // Le bouton s'allume en bleu
  }
});