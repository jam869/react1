import { Stack, router } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { createContext, useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export const GlobalContext = createContext();
let mainDbConnection = null;
let dejaInitialise = false; // La variable anti-boucle

const normaliserUsager = (u) => {
  if (!u) return null;
  return { ...u, admin: Number(u.admin) };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withDbLockRetry(action, retries = 5) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await action();
    } catch (error) {
      const message = String(error?.message || '');
      const isLocked = message.includes('database is locked');
      if (!isLocked || attempt === retries) {
        throw error;
      }
      await sleep(120 * (attempt + 1));
      attempt += 1;
    }
  }
}

async function migrateDbIfNeeded(db) {
  await withDbLockRetry(async () => {
    await db.execAsync('PRAGMA busy_timeout = 5000;');
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.runAsync(`CREATE TABLE IF NOT EXISTS Client (
      id INTEGER PRIMARY KEY NOT NULL,
      nom TEXT NOT NULL UNIQUE,
      mdp TEXT NOT NULL,
      admin INTEGER NOT NULL DEFAULT 0,
      langue TEXT NOT NULL DEFAULT 'fr-CA',
      adresse TEXT
    )`);
    await db.runAsync(`CREATE TABLE IF NOT EXISTS Produit (
      id INTEGER PRIMARY KEY NOT NULL,
      nom TEXT NOT NULL,
      description TEXT,
      prix REAL NOT NULL,
      image TEXT
    )`);
    await db.runAsync(`CREATE TABLE IF NOT EXISTS Session (
      id INTEGER PRIMARY KEY NOT NULL,
      clientId INTEGER NOT NULL
    )`);
  });

  await withDbLockRetry(async () => {
    await db.runAsync(`INSERT OR IGNORE INTO Produit (id, nom, prix, image, description) VALUES
      (1, 'Ford Mustang Ecoboost 2026', 50794, 'https://via.placeholder.com/600x400?text=Mustang', 'Decapotable puissante'),
      (2, 'BMW 8 Series M850i 2026', 162298, 'https://via.placeholder.com/600x400?text=BMW+M850i', 'Luxe et performance'),
      (3, 'DEFENDER 110 OCTA 2026', 227686, 'https://via.placeholder.com/600x400?text=Defender+110', 'Le tout-terrain ultime'),
      (4, 'HYUNDAI TUCSON 2017', 10999, 'https://via.placeholder.com/600x400?text=Tucson+2017', 'VUS fiable et abordable'),
      (5, 'Dodge Charger Scat Pack 2026', 84188, 'https://via.placeholder.com/600x400?text=Charger+Scat+Pack', 'Muscle car moderne'),
      (6, 'Volkswagen Golf Trendline 2012', 4995, 'https://via.placeholder.com/600x400?text=Golf+2012', 'Compacte manuelle'),
      (7, 'GMC Terrain SLE2 2014', 5966, 'https://via.placeholder.com/600x400?text=Terrain+2014', 'AWD spacieux');
    `);
    await db.runAsync("INSERT OR IGNORE INTO Client (id, nom, mdp, admin, langue) VALUES (1, 'admin', 'admin', 1, 'fr-CA')");
    await db.runAsync("INSERT OR IGNORE INTO Client (id, nom, mdp, admin, langue) VALUES (2, 'client', 'client', 0, 'fr-CA')");
  });
}

export default function RootLayout() {
  const [usager, setUsager] = useState(null);
  const [panier, setPanier] = useState([]);
  const [langue, setLangue] = useState('fr-CA');

  const initialiserDbEtSession = async (db) => {
    if (dejaInitialise) return; // Empêche le clignotement

    mainDbConnection = db;
    await migrateDbIfNeeded(db);
    const session = await withDbLockRetry(() => db.getFirstAsync('SELECT clientId FROM Session ORDER BY id DESC LIMIT 1'));
    if (session?.clientId) {
      const user = await withDbLockRetry(() => db.getFirstAsync('SELECT * FROM Client WHERE id = ?', [session.clientId]));
      if (user) {
        const userNormalise = normaliserUsager(user);
        setUsager(userNormalise);
        setLangue(userNormalise.langue || 'fr-CA');
      }
    }
    dejaInitialise = true; // Marque comme terminé
  };

  const deconnexion = async () => {
    try {
      if (mainDbConnection) {
        await withDbLockRetry(() => mainDbConnection.runAsync('DELETE FROM Session'));
      }
    } catch (error) {
      console.error('Erreur de suppression de session', error);
    }
    setUsager(null);
    setPanier([]);
    router.replace('/');
  };

  const HeaderInfo = () => (
    usager ? (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 10 }}>
        <Text>{usager.nom} ({langue})</Text>
        <Pressable onPress={deconnexion}>
          <Text style={{ color: 'red' }}>Déconnexion</Text>
        </Pressable>
      </View>
    ) : null
  );

  return (
    <SQLiteProvider databaseName="pfi.db" onInit={initialiserDbEtSession}>
      <GlobalContext.Provider value={{ usager, setUsager, panier, setPanier, langue, setLangue, deconnexion }}>
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