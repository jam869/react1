import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, useWindowDimensions } from 'react-native';
import MapView, { Marker, Circle, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const WAREHOUSES = [
  { id: 1, name: 'Entrepôt Laval', latitude: 45.5601, longitude: -73.7120, title: 'Laval Branch' },
  { id: 2, name: 'Entrepôt Longueuil', latitude: 45.5312, longitude: -73.5126, title: 'South Shore Branch' },
  { id: 3, name: 'Entrepôt West Island', latitude: 45.4475, longitude: -73.8392, title: 'West Island Branch' },
  { id: 4, name: 'Entrepôt Centre-Ville', latitude: 45.5017, longitude: -73.5673, title: 'Downtown Branch' },
  { id: 5, name: 'Entrepôt Rosemont', latitude: 45.5469, longitude: -73.5828, title: 'Rosemont Branch' },
];

const HOME = { latitude: 45.5088, longitude: -73.5540, name: 'Ma Maison' };

// 7+ coordinates for the path from Downtown (nearest) to Home
const PATH_TO_HOME = [
  { latitude: 45.5017, longitude: -73.5673 }, // Downtown
  { latitude: 45.5030, longitude: -73.5650 },
  { latitude: 45.5045, longitude: -73.5620 },
  { latitude: 45.5060, longitude: -73.5600 },
  { latitude: 45.5070, longitude: -73.5580 },
  { latitude: 45.5080, longitude: -73.5560 },
  { latitude: 45.5088, longitude: -73.5540 }, // Home
];

const WAREHOUSE_ICON = 'https://cdn-icons-png.flaticon.com/512/2312/2312563.png';
const HOME_ICON = 'https://cdn-icons-png.flaticon.com/512/25/25694.png';

export default function EntrepotsPage() {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const { height, width } = useWindowDimensions();

  const [region, setRegion] = useState({
    latitude: 45.5088,
    longitude: -73.5616,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const onMarkerPress = (id) => {
    setSelectedId(id);
  };

  const onListPress = (item) => {
    setSelectedId(item.id);
    mapRef.current?.animateToRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t('warehouses') }} />
      
      {/* 25% List */}
      <View style={styles.listContainer}>
        <FlatList
          data={WAREHOUSES}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable 
              style={[styles.listItem, selectedId === item.id && styles.selectedItem]}
              onPress={() => onListPress(item)}
            >
              <Text style={[styles.listText, selectedId === item.id && styles.selectedText]}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* 75% Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
        >
          {/* User Home */}
          <Marker
            coordinate={HOME}
            title={HOME.name}
            image={{ uri: HOME_ICON }}
            style={{ width: 40, height: 40 }}
          />

          {/* Warehouses */}
          {WAREHOUSES.map(w => (
            <React.Fragment key={w.id}>
              <Marker
                coordinate={{ latitude: w.latitude, longitude: w.longitude }}
                title={w.title}
                onPress={() => onMarkerPress(w.id)}
              >
                <Image source={{ uri: WAREHOUSE_ICON }} style={styles.markerImage} />
              </Marker>
              
              <Circle
                center={{ latitude: w.latitude, longitude: w.longitude }}
                radius={5000} // 5km
                fillColor="rgba(0, 122, 255, 0.1)"
                strokeColor="rgba(0, 122, 255, 0.3)"
              />
            </React.Fragment>
          ))}

          {/* Path from nearest warehouse (Downtown) to Home */}
          <Polyline
            coordinates={PATH_TO_HOME}
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
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  listContainer: {
    flex: 0.25,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mapContainer: {
    flex: 0.75,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#007AFF',
  },
  listText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  markerImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
});
