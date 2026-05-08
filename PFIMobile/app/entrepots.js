import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../Context';
import { i18n } from '../locales/i18n';
export default function Entrepots() {
  const { height, width } = useWindowDimensions();
  const [region, setRegion] = useState({
    latitude: 45.4735,
    longitude: -73.5639,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const entrepots = [
    { id: 1, nom: 'Entrepot Nord', lat: 45.48, lon: -73.57 },
    { id: 2, nom: 'Entrepot Est', lat: 45.47, lon: -73.55 },
  ];

  const cheminMaison = [
    { latitude: 45.4735, longitude: -73.5639 },
    { latitude: 45.475, longitude: -73.565 },
    { latitude: 45.48, longitude: -73.57 },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: height * 0.25, backgroundColor: '#fff', padding: 15 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Nos sites :</Text>
        {entrepots.map((e) => (
          <Pressable key={e.id} style={styles.listBtn}>
            <Text>{e.nom}</Text>
          </Pressable>
        ))}
      </View>

      <MapView
        style={{ height: height * 0.75, width }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
      >
        <Marker coordinate={{ latitude: 45.4735, longitude: -73.5639 }} title="Maison">
          <Ionicons name="home" size={30} color="red" />
        </Marker>

        {entrepots.map((e) => (
          <React.Fragment key={e.id}>
            <Marker coordinate={{ latitude: e.lat, longitude: e.lon }} title={e.nom} pinColor="blue" />
            <Circle center={{ latitude: e.lat, longitude: e.lon }} radius={5000} fillColor="rgba(0,0,255,0.1)" strokeColor="blue" />
          </React.Fragment>
        ))}

        <Polyline coordinates={cheminMaison} strokeColor="#e67e22" strokeWidth={5} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  listBtn: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
