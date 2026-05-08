// Nathan Aguiar Labo 3 - Final (Exercices 3, 4, 5) 12 février 2026

import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, Button, Alert } from 'react-native';

const Entete = (props) => (
  <View style={styles.entete}>
    <Text style={styles.titre}>{props.titre}</Text>
  </View>
);

const DessertPic = (props) => {
  const uriDefaut = "https://cdn-icons-png.flaticon.com/512/5717/5717439.png";
  return (
    <Image 
      style={styles.imageFormat} 
      source={{ uri: (props.uriPic && props.uriPic !== "") ? props.uriPic : uriDefaut }} 
    />
  );
};

const Dessert = (props) => (
  <View style={styles.dessertConteneur}>
    <DessertPic uriPic={props.uriPic} />
    <Text style={{ fontSize: 20, padding: 10 }}>{props.nom}</Text>
  </View>
);

export default function App() {
  const [lesDesserts, setLesDesserts] = useState({
    "Gâteau à la vanille": "https://www.lifeloveandsugar.com/wp-content/uploads/2023/05/Raspberry-Dream-Cake3E.jpg",
    "Tarte aux baies": "http://www.peanutbutterandpeppers.com/wp-content/uploads/2012/05/Berry-Tart-006.jpg",
    "Gâteau au chocolat végan": "https://thebananadiaries.com/wp-content/uploads/2023/06/vegan-chocolate-cake_3640.jpg",
    "Biscuits au chocolat et à l'orange": "https://www.mashed.com/img/gallery/trader-joes-brought-back-this-chocolate-citrus-holiday-favorite/l-intro-1639235243.jpg",
    "un gâteau null": null,
    "un gâteau vide": ""
  });

  const [nouveau, setNouveau] = useState({ nom: '', url: '' });

  const ajouter = () => {
    setLesDesserts({ ...lesDesserts, [nouveau.nom]: nouveau.url });
    Alert.alert("Confirmation", "Nouveau dessert ajouté " + nouveau.nom);
    setNouveau({ nom: '', url: '' });
  };

  const listeDesserts = [];
  for (let k in lesDesserts) {
    listeDesserts.push(<Dessert key={k} nom={k} uriPic={lesDesserts[k]} />);
  }

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <Entete titre="RECETTES 5" />
  
      <ScrollView style={{ flex: 1 }}>
        {listeDesserts}
      </ScrollView>
      
      <View style={{ padding: 10 }}>
        <TextInput 
          style={styles.input} 
          placeholder="Nouveau dessert" 
          value={nouveau.nom}
          onChangeText={(val) => setNouveau({ ...nouveau, nom: val })} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Nouveau url" 
          value={nouveau.url}
          onChangeText={(val) => setNouveau({ ...nouveau, url: val })} 
        />
        <Button title="AJOUTER DESSERT" onPress={ajouter} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

// -- Ne pas modifier ceci
const styles = StyleSheet.create({
  dessertConteneur: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    borderBottomColor: '#DDD',
    borderBottomWidth: 2,
    alignItems: 'center',
    paddingTop: 5
  },
  imageFormat: {
    width: 110,
    height: 110,
    paddingRight: 10
  },
  entete:{
    backgroundColor: "salmon",
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titre:{
    color: "#F3F3F3",
    fontSize: 30,
    fontWeight: '900',
    textTransform: 'uppercase'
  }
});