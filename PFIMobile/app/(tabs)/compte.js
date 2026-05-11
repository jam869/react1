import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Switch } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Link } from 'expo-router';
import { GlobalContext } from '../../Context';
import { i18n } from '../../locales/i18n';

export default function CompteClient() {
  const db = useSQLiteContext();
  const { usager, setUsager, langue, setLangue, theme, setTheme } = useContext(GlobalContext);

  const [mdp, setMdp] = useState(usager?.mdp || '');
  const [adresse, setAdresse] = useState(usager?.adresse || '');
  const [langSelect, setLangSelect] = useState(langue);

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
    setLangue(langSelect);
    Alert.alert(i18n.t('succes') || 'Succès', i18n.t('succes_maj'));
  };

  if (!usager) return <Text style={styles.nonConnecte}>{i18n.t('non_connecte') || 'Non connecté'}</Text>;

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#121212' : '#f8f9fa' },
    text: { color: isDark ? '#fff' : '#000' },
    label: { color: isDark ? '#bbb' : '#333' },
    input: { 
      backgroundColor: isDark ? '#1e1e1e' : '#fff', 
      color: isDark ? '#fff' : '#000',
      borderColor: isDark ? '#333' : '#ccc'
    }
  };

  const RadioButton = ({ value, label }) => (
    <Pressable onPress={() => setLangSelect(value)} style={styles.radioRow}>
      <View style={[styles.radioCircle, dynamicStyles.input]}>
        {langSelect === value && <View style={styles.radioDot} />}
      </View>
      <Text style={[styles.radioLabel, dynamicStyles.text]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.header}>
        <Text style={[styles.label, dynamicStyles.label]}>{i18n.t('dark_mode')}</Text>
        <Switch 
          value={isDark} 
          onValueChange={(val) => setTheme(val ? 'dark' : 'light')} 
          trackColor={{ false: '#767577', true: '#2ecc71' }}
        />
      </View>

      <Text style={[styles.label, dynamicStyles.label]}>{i18n.t('nom_label')}</Text>
      <TextInput value={usager.nom} editable={false} style={[styles.input, dynamicStyles.input, { opacity: 0.6 }]} />

      <Text style={[styles.label, dynamicStyles.label]}>{i18n.t('mdp_label')}</Text>
      <TextInput value={mdp} onChangeText={setMdp} style={[styles.input, dynamicStyles.input]} secureTextEntry />

      <Text style={[styles.label, dynamicStyles.label]}>{i18n.t('adresse_label')}</Text>
      <TextInput value={adresse} onChangeText={setAdresse} style={[styles.input, dynamicStyles.input]} />

      <Text style={[styles.label, dynamicStyles.label]}>{i18n.t('langue_label')}</Text>
      <View style={styles.radioGroup}>
        <RadioButton value="fr-CA" label="Français" />
        <RadioButton value="en-CA" label="English" />
        <RadioButton value="auto" label={i18n.t('auto')} />
      </View>

      <Pressable onPress={sauvegarder} style={styles.saveBtn}>
        <Text style={styles.actionText}>{i18n.t('sauvegarder')}</Text>
      </Pressable>

      <Link href="/entrepots" asChild>
        <Pressable style={styles.mapBtn}>
          <Text style={styles.actionText}>{i18n.t('voir_entrepots')}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  nonConnecte: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 18 },
  label: { fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 5 },
  radioGroup: { marginTop: 10, marginBottom: 20 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radioCircle: { height: 24, width: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioDot: { height: 12, width: 12, borderRadius: 6, backgroundColor: '#2ecc71' },
  radioLabel: { fontSize: 16 },
  saveBtn: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, marginTop: 10 },
  mapBtn: { backgroundColor: '#e67e22', padding: 15, borderRadius: 10, marginTop: 20 },
  actionText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});