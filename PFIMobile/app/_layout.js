import { Stack, router } from 'expo-router'; 
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback, useContext, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { getLocales } from 'expo-localization';
import { GlobalContext } from '../Context';
import { i18n } from '../locales/i18n';

async function migrateDbIfNeeded(db) {
  console.log('--- DÉBUT MIGRATION DB ---');
  await db.execAsync('PRAGMA journal_mode = WAL;');
  
  // Table Client
  await db.execAsync(`CREATE TABLE IF NOT EXISTS Client (id INTEGER PRIMARY KEY NOT NULL, nom TEXT NOT NULL UNIQUE, mdp TEXT NOT NULL, admin INTEGER NOT NULL DEFAULT 0)`);
  
  // Migration robuste pour ajouter les colonnes manquantes
  try {
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(Client)`);
    const columns = tableInfo.map(c => c.name);
    console.log('Colonnes Client détectées:', columns);
    if (!columns.includes('langue')) {
      console.log('Ajout de la colonne langue...');
      await db.execAsync(`ALTER TABLE Client ADD COLUMN langue TEXT NOT NULL DEFAULT 'fr-CA'`);
    }
    if (!columns.includes('adresse')) {
      console.log('Ajout de la colonne adresse...');
      await db.execAsync(`ALTER TABLE Client ADD COLUMN adresse TEXT`);
    }
  } catch (e) {
    console.error('Migration Client ignorée ou déjà faite', e);
  }

  // Table Produit
  await db.execAsync(`CREATE TABLE IF NOT EXISTS Produit (id INTEGER PRIMARY KEY NOT NULL, nom TEXT NOT NULL, description TEXT, prix REAL NOT NULL, image TEXT)`);
  
  // Table Session
  await db.execAsync(`CREATE TABLE IF NOT EXISTS Session (id INTEGER PRIMARY KEY NOT NULL, clientId INTEGER NOT NULL)`);

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
  console.log('--- FIN MIGRATION DB ---');
}

function HeaderInfo() {
  const { usager, deconnexion, theme } = useContext(GlobalContext);
  const db = useSQLiteContext();

  if (!usager) return null;

  const handleLogout = async () => {
    try {
      await db.runAsync('DELETE FROM Session');
    } catch (e) {
      console.log('Erreur suppression session BD:', e);
    }
    deconnexion();
  };

  const isDark = theme === 'dark';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 15 }}>
      <Text style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>{usager.nom}</Text>
      <Pressable onPress={handleLogout}>
        <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Déconnexion</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const [usager, setUsager] = useState(null);
  const [panier, setPanier] = useState([]);
  const [langue, setLangue] = useState('fr-CA');
  const [theme, setTheme] = useState('light');

  const changerLangue = useCallback((nouvelleLangue) => {
    setLangue(nouvelleLangue);
    if (nouvelleLangue === 'auto') {
      i18n.locale = getLocales()[0]?.languageTag || 'fr-CA';
    } else {
      i18n.locale = nouvelleLangue;
    }
  }, []);

  const onInit = useCallback(async (db) => {
    console.log('--- INITIALISATION RootLayout ---');
    try {
      await migrateDbIfNeeded(db);
      const session = await db.getFirstAsync('SELECT clientId FROM Session LIMIT 1');
      console.log('Session en BD:', session);
      if (session) {
        const user = await db.getFirstAsync('SELECT * FROM Client WHERE id = ?', [session.clientId]);
        console.log('Utilisateur trouvé pour session:', user);
        if (user) {
          const userNormalise = { ...user, admin: Number(user.admin) };
          setUsager(userNormalise);
          const l = userNormalise.langue || 'fr-CA';
          setLangue(l);
          i18n.locale = (l === 'auto') ? (getLocales()[0]?.languageTag || 'fr-CA') : l;
        }
      }
    } catch (e) {
      console.error('Erreur fatale onInit RootLayout:', e);
    }
  }, []);

  const deconnexion = useCallback(() => {
    setUsager(null);
    setPanier([]);
    router.replace('/');
  }, []);

  return (
    <SQLiteProvider databaseName="pfi.db" onInit={onInit}>
      <GlobalContext.Provider value={{ usager, setUsager, panier, setPanier, langue, setLangue: changerLangue, deconnexion, theme, setTheme }}>
        <Stack screenOptions={{ 
          headerRight: () => <HeaderInfo />,
          headerStyle: { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' },
          headerTintColor: theme === 'dark' ? '#fff' : '#000',
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ title: 'Administration' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="entrepots" options={{ title: 'Nos Entrepôts' }} />
        </Stack>
      </GlobalContext.Provider>
    </SQLiteProvider>
  );
}