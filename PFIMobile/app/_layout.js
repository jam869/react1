import { Stack, router } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { createContext, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { GlobalContext } from './_Context'; 
import { i18n } from './locales/i18n';

async function migrateDbIfNeeded(db) {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.runAsync(`CREATE TABLE IF NOT EXISTS Client (id INTEGER PRIMARY KEY NOT NULL, nom TEXT NOT NULL UNIQUE, mdp TEXT NOT NULL, admin INTEGER NOT NULL DEFAULT 0, langue TEXT NOT NULL DEFAULT 'fr-CA', adresse TEXT)`);
  await db.runAsync(`CREATE TABLE IF NOT EXISTS Produit (id INTEGER PRIMARY KEY NOT NULL, nom TEXT NOT NULL, description TEXT, prix REAL NOT NULL, image TEXT)`);
  await db.runAsync(`CREATE TABLE IF NOT EXISTS Session (id INTEGER PRIMARY KEY NOT NULL, clientId INTEGER NOT NULL)`);

  // Insertion des 7 voitures Auto Prestige
  await db.runAsync(`INSERT OR IGNORE INTO Produit (id, nom, prix, image, description) VALUES
    (1, 'Ford Mustang Ecoboost 2026', 50794, 'https://via.placeholder.com/150', 'Décapotable puissante'),
    (2, 'BMW 8 Series M850i 2026', 162298, 'https://via.placeholder.com/150', 'Luxe et performance'),
    (3, 'DEFENDER 110 OCTA 2026', 227686, 'https://via.placeholder.com/150', 'Le tout-terrain ultime'),
    (4, 'HYUNDAI TUCSON 2017', 10999, 'https://via.placeholder.com/150', 'VUS fiable et abordable'),
    (5, 'Dodge Charger Scat Pack 2026', 84188, 'https://via.placeholder.com/150', 'Muscle car moderne'),
    (6, 'Volkswagen Golf Trendline 2012', 4995, 'https://via.placeholder.com/150', 'Compacte manuelle'),
    (7, 'GMC Terrain SLE2 2014', 5966, 'https://via.placeholder.com/150', 'AWD spacieux');`);
    await db.runAsync("INSERT OR IGNORE INTO Client (id, nom, mdp, admin, langue) VALUES (1, 'admin', 'admin', 1, 'fr-CA')");
  await db.runAsync("INSERT OR IGNORE INTO Client (id, nom, mdp, admin, langue) VALUES (2, 'client', 'client', 0, 'fr-CA')");
}

export default function RootLayout() {
  const [usager, setUsager] = useState(null);
  const [panier, setPanier] = useState([]);
  const [langue, setLangue] = useState('fr-CA');

  const changerLangue = (nouvelleLangue) => {
    setLangue(nouvelleLangue);
    i18n.locale = nouvelleLangue;
  };

  const onInit = useCallback(async (db) => {
    await migrateDbIfNeeded(db);
  }, []);

  const deconnexion = () => {
    setUsager(null);
    setPanier([]);
    router.replace('/');
  };

 const HeaderInfo = () => {
  const dbContext = useSQLiteContext(); 
  return usager ? (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 15 }}>
      <Text style={{ fontWeight: 'bold' }}>{usager.nom}</Text>
      <Pressable onPress={async () => {
        await dbContext.runAsync('DELETE FROM Session'); 
        deconnexion(); 
      }}>
        <Text style={{ color: 'red' }}>Déconnexion</Text>
      </Pressable>
    </View>
  ) : null;
};

  return (
    <SQLiteProvider databaseName="pfimobile1.db" onInit={onInit}>
      {/* ATTENTION ICI : on passe setLangue: changerLangue */}
      <GlobalContext.Provider value={{ usager, setUsager, panier, setPanier, langue, setLangue: changerLangue, deconnexion }}>
          <Stack screenOptions={{ headerRight: () => <HeaderInfo /> }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ title: 'Administration' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="entrepots" options={{ title: 'Nos Entrepôts' }} />
        </Stack>
      </GlobalContext.Provider>
    </SQLiteProvider>
  );
}