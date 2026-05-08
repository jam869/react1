import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';

export default function AccueilScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Logique de vérification factice
    if (username.toLowerCase() === 'admin') {
      navigation.replace('Admin'); // replace empêche de revenir à l'accueil avec le bouton "Retour"
    } else {
      navigation.replace('ClientApp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Contenu principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Mon Entreprise Inc.</Text>
        
        <Image 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.logo}
        />

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Se connecter" onPress={handleLogin} />
          <Text style={styles.hint}>Indice: tapez 'admin' pour le rôle administrateur.</Text>
        </View>
      </View>

      {/* Footer avec vos noms */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Créé par: [Ton Nom] & [Nom du coéquipier]</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 10,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  hint: {
    marginTop: 10,
    textAlign: 'center',
    color: 'gray',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});