import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Link } from 'expo-router';
import { GlobalContext } from '../_layout';

export default function CompteClient() {
  const db = useSQLiteContext();
  const { usager, setUsager, langue, setLangue, deconnexion } = useContext(GlobalContext);

  const [mdp, setMdp] = useState(usager?.mdp || '');
  const [adresse, setAdresse] = useState(usager?.adresse || '');
  const [langSelect, setLangSelect] = useState(langue);

  const sauvegarder = async () => {
    if (!usager) return;

    await db.runAsync(
      'UPDATE Client SET mdp = ?, adresse = ?, langue = ? WHERE id = ?',
      [mdp, adresse, langSelect, usager.id]
    );

    setUsager({ ...usager, mdp, adresse, langue: langSelect });
    setLangue(langSelect);
    Alert.alert('Succes', 'Vos informations ont ete mises a jour.');
  };

  if (!usager) return <Text style={styles.nonConnecte}>Non connecte</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom (non modifiable) :</Text>
      <TextInput value={usager.nom} editable={false} style={[styles.input, { backgroundColor: '#eee' }]} />

      <Text style={styles.label}>Mot de passe :</Text>
      <TextInput value={mdp} onChangeText={setMdp} style={styles.input} secureTextEntry />

      <Text style={styles.label}>Adresse :</Text>
      <TextInput value={adresse} onChangeText={setAdresse} style={styles.input} />

      <Text style={styles.label}>Langue preferee :</Text>
      <View style={styles.radioGroup}>
        {['fr-CA', 'en-CA', 'auto'].map((l) => (
          <Pressable
            key={l}
            onPress={() => setLangSelect(l)}
            style={[styles.radioBtn, langSelect === l && styles.radioBtnActive]}
          >
            <Text style={{ color: langSelect === l ? 'white' : 'black' }}>{l}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={sauvegarder} style={styles.saveBtn}>
        <Text style={styles.actionText}>Sauvegarder</Text>
      </Pressable>

      <Link href="/entrepots" asChild>
        <Pressable style={styles.mapBtn}>
          <Text style={styles.actionText}>Voir nos entrepots</Text>
        </Pressable>
      </Link>

      <Pressable onPress={deconnexion} style={styles.logoutBtn}>
        <Text style={styles.actionText}>Deconnexion</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  nonConnecte: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 18 },
  label: { fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  radioGroup: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  radioBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', borderRadius: 5 },
  radioBtnActive: { backgroundColor: 'blue', borderColor: 'blue' },
  saveBtn: { backgroundColor: 'green', padding: 15, borderRadius: 5, marginTop: 10 },
  mapBtn: { backgroundColor: '#e67e22', padding: 15, borderRadius: 5, marginTop: 20 },
  logoutBtn: { backgroundColor: '#c0392b', padding: 15, borderRadius: 5, marginTop: 20 },
  actionText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
