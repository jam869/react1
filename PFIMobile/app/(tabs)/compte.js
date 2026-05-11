import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Link } from 'expo-router';
import { GlobalContext } from '../../Context';
import { i18n } from '../../locales/i18n';

export default function CompteClient() {
  const db = useSQLiteContext();
  const { usager, setUsager, langue, setLangue } = useContext(GlobalContext);

  const [mdp, setMdp] = useState(usager?.mdp || '');
  const [adresse, setAdresse] = useState(usager?.adresse || '');
  const [langSelect, setLangSelect] = useState(langue);

  // Assure-toi que la page réagit au changement de langue
  i18n.locale = langue;
useEffect(() => {
    if (usager) {
      setMdp(usager.mdp);
      setAdresse(usager.adresse);
      setLangSelect(usager.langue);
    }
  }, [usager]);
  const sauvegarder = async () => {
    if (!usager) return;

    await db.runAsync(
      'UPDATE Client SET mdp = ?, adresse = ?, langue = ? WHERE id = ?',
      [mdp, adresse, langSelect, usager.id]
    );

    setUsager({ ...usager, mdp, adresse, langue: langSelect });
    setLangue(langSelect); // Ceci met à jour tout le reste de l'application
    Alert.alert('Succès', 'Vos informations ont été mises à jour.');
  };

  if (!usager) return <Text style={styles.nonConnecte}>{i18n.t('non_connecte') || 'Non connecté'}</Text>;

  return (
    <View style={styles.container}>
      {/* Remplacer les textes par i18n.t('ta_cle_de_traduction') */}
      <Text style={styles.label}>{i18n.t('nom_label') || 'Nom (non modifiable) :'}</Text>
      <TextInput value={usager.nom} editable={false} style={[styles.input, { backgroundColor: '#eee' }]} />

      <Text style={styles.label}>{i18n.t('mdp_label') || 'Mot de passe :'}</Text>
      <TextInput value={mdp} onChangeText={setMdp} style={styles.input} secureTextEntry />

      <Text style={styles.label}>{i18n.t('adresse_label') || 'Adresse :'}</Text>
      <TextInput value={adresse} onChangeText={setAdresse} style={styles.input} />

      <Text style={styles.label}>{i18n.t('langue_label') || 'Langue préférée :'}</Text>
      <View style={styles.radioGroup}>
        {['fr-CA', 'en-CA'].map((l) => (
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
        <Text style={styles.actionText}>{i18n.t('sauvegarder') || 'Sauvegarder'}</Text>
      </Pressable>

      <Link href="/entrepots" asChild>
        <Pressable style={styles.mapBtn}>
          <Text style={styles.actionText}>{i18n.t('voir_entrepots') || 'Voir nos entrepôts'}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... garde tes mêmes styles
  container: { flex: 1, padding: 20 },
  nonConnecte: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 18 },
  label: { fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  radioGroup: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  radioBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', borderRadius: 5 },
  radioBtnActive: { backgroundColor: 'blue', borderColor: 'blue' },
  saveBtn: { backgroundColor: 'green', padding: 15, borderRadius: 5, marginTop: 10 },
  mapBtn: { backgroundColor: '#e67e22', padding: 15, borderRadius: 5, marginTop: 20 },
  actionText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});