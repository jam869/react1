import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { GlobalContext } from '../Context';
import { i18n } from '../locales/i18n';

export default function Accueil() {
  const [nom, setNom] = useState('');
  const [mdp, setMdp] = useState('');
  const router = useRouter();
  const db = useSQLiteContext();
  const { usager, setUsager, setLangue } = useContext(GlobalContext);

  // 1. On verifie la session UNIQUEMENT pour charger les donnees, pas pour naviguer.
  useEffect(() => {
    let actif = true;

    async function verifierSession() {
      try {
        const session = await db.getFirstAsync('SELECT clientId FROM Session ORDER BY id DESC LIMIT 1');
        if (!actif) return;

        if (session?.clientId) {
          const user = await db.getFirstAsync('SELECT * FROM Client WHERE id = ?', [session.clientId]);
          if (!actif) return;

          if (user) {
            const userNormalise = { ...user, admin: Number(user.admin) };
            setUsager(userNormalise);
            setLangue(userNormalise.langue || 'fr-CA');
          }
        }
      } catch (erreur) {
        console.error('Erreur session', erreur);
      }
    }

    verifierSession();

    return () => {
      actif = false;
    };
  }, [db, setLangue, setUsager]);

  // 2. Toute la navigation post-login passe ici (source unique de verite).
  useEffect(() => {
    if (!usager) return;

    if (Number(usager.admin) === 1) {
      router.replace('/admin');
    } else {
      router.replace('/produits/index');
    }
  }, [router, usager]);

  const handleLogin = async () => {
    try {
      const user = await db.getFirstAsync('SELECT * FROM Client WHERE nom = ? AND mdp = ?', [nom.trim(), mdp]);

      if (!user) {
        Alert.alert('Erreur', "Nom d'utilisateur ou mot de passe incorrect.");
        return;
      }

      const userNormalise = { ...user, admin: Number(user.admin) };
      await db.runAsync('DELETE FROM Session');
      await db.runAsync('INSERT INTO Session (id, clientId) VALUES (1, ?)', [userNormalise.id]);

      setNom('');
      setMdp('');
      setLangue(userNormalise.langue || 'fr-CA');
      i18n.locale = userNormalise.langue || 'fr-CA';

      // Declenche la redirection via le useEffect ci-dessus.
      setUsager(userNormalise);
    } catch (erreur) {
      console.error('Erreur login', erreur);
      Alert.alert('Erreur', 'Impossible de se connecter pour le moment.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto Prestige</Text>
      <Image
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR38cpx6uXtYmLcjVefkuX-8F0xpeU_6o9Nw&s' }}
        style={styles.logo}
      />

      <TextInput placeholder="Nom d'utilisateur" value={nom} onChangeText={setNom} style={styles.input} />
      <TextInput placeholder="Mot de passe" secureTextEntry value={mdp} onChangeText={setMdp} style={styles.input} />

      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text>Créé par : Nathan Aguiar & Zachary Bélanger</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  logo: { width: 150, height: 150, marginBottom: 30 },
  input: { borderWidth: 1, width: '100%', marginBottom: 15, padding: 12, borderRadius: 8 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footer: { position: 'absolute', bottom: 30 },
});
