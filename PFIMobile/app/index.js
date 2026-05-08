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

  // 1. Vérification sécurisée de la session au démarrage
  useEffect(() => {
    let isMounted = true; // Protection contre le Hot Reload

    async function verifierSession() {
      try {
        const session = await db.getFirstAsync('SELECT clientId FROM Session ORDER BY id DESC LIMIT 1');
        
        if (session?.clientId && isMounted) {
          const user = await db.getFirstAsync('SELECT * FROM Client WHERE id = ?', [session.clientId]);
          if (user && isMounted) {
            const userNormalise = { ...user, admin: Number(user.admin) };
            setUsager(userNormalise);
            setLangue(userNormalise.langue || 'fr-CA');
            i18n.locale = userNormalise.langue || 'fr-CA';
          }
        }
      } catch (erreur) {
        console.log("Session non trouvée ou erreur SQLite ignorée au démarrage :", erreur);
      }
    }

    verifierSession();

    // Si on quitte l'écran, on annule pour éviter les crashs
    return () => { isMounted = false; };
  }, [db, setUsager, setLangue]);

  // 2. Navigation Automatique (Source unique de vérité)
  useEffect(() => {
    if (usager) {
      if (Number(usager.admin) === 1) {
        router.replace('/admin');
      } else {
        router.replace('/produits/index'); // Bien mettre /index ici !
      }
    }
  }, [usager, router]);

  // 3. Bouton de Connexion
  const handleLogin = async () => {
    try {
      if (!nom || !mdp) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
        return;
      }

      const user = await db.getFirstAsync('SELECT * FROM Client WHERE nom = ? AND mdp = ?', [
        nom.trim(),
        mdp,
      ]);

      if (!user) {
        Alert.alert('Erreur', "Nom d'utilisateur ou mot de passe incorrect.");
        return;
      }

   // ... (suite de ta fonction handleLogin après la vérification du mot de passe)
      const userNormalise = { ...user, admin: Number(user.admin) };
      await db.runAsync('DELETE FROM Session');
      await db.runAsync('INSERT INTO Session (id, clientId) VALUES (1, ?)', [userNormalise.id]);

      // Mise à jour de tes variables globales
      setUsager(userNormalise);
      const langueChoisie = userNormalise.langue || 'fr-CA';
      setLangue(langueChoisie);
      i18n.locale = langueChoisie;

      // On vide les champs
      setNom('');
      setMdp('');

      // La vraie route sans (tabs) et sans le mot index !
      if (userNormalise.admin === 1) {
        router.replace('/admin');
      } else {
        router.replace('/produits'); 
      }

    } catch (erreur) {
      console.error("Erreur lors de la connexion SQLite :", erreur);
      Alert.alert('Erreur', 'Un problème est survenu avec la base de données.');
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