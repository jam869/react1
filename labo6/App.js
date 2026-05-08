// Nathan Aguiar Laboratoire 6 

import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'; 

export default function App() {

  const [compte, setCompte] = useState({
    nom: 'Jean Leblanc',
    cell: '514 444 232',
    mdp: 'abc'
  }); 


  const [mdpNouveau, setMdpNouveau] = useState(compte.mdp);

  const [mdpModifié, setMdpModifié] = useState(0);

  useEffect(() => {
    if (mdpModifié > 0) {
      Alert.alert("Modification", "Votre mot de passe a été modifié");
    }
  }, [mdpModifié]); 

  const handleSoumettre = () => {
    if (mdpNouveau.length >= 5 && mdpNouveau !== compte.mdp) {
      setCompte({ ...compte, mdp: mdpNouveau }); 
      setMdpModifié(mdpModifié + 1);
    }
  };

  const handleAnnuler = () => {
    setMdpNouveau(compte.mdp);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitre}>UseEffect: Profile</Text>

      <Text style={styles.label}>Nom:</Text>
      <TextInput 
        style={styles.input}
        value={compte.nom}
        onChangeText={(text) => setCompte({ ...compte, nom: text })}
      />

      <Text style={styles.label}>Cellulaire:</Text>
      <TextInput 
        style={styles.input}
        value={compte.cell}
        onChangeText={(text) => setCompte({ ...compte, cell: text })}
      />

      <Text style={styles.label}>Mot de passe:</Text>
      <TextInput 
        style={styles.input}
        value={mdpNouveau}
        onChangeText={setMdpNouveau}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'salmon' }]} 
          onPress={handleSoumettre}
        >
          <Text style={styles.buttonText}>Soumettre</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'grey' }]} 
          onPress={handleAnnuler}
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text>nom: {compte.nom}</Text>
        <Text>cell: {compte.cell}</Text>
        <Text>mot de passe: {compte.mdp}</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>
          Le mot de passe a été modifié {mdpModifié} fois
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 50,
  },
  mainTitre: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    height: 30,
    width: 120,
    borderRadius: 15, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 40,
    padding: 15,
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
  }
});