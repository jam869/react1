// Nathan Aguiar Labo 3 App1 - Exercice 1 12 février 2026
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

const Entete = (props) => (
  <View style={styles.entete}>
    <Text style={styles.titre}>RECETTES</Text>
  </View>
);

const DessertPic = (props) => (
  <Image style={styles.imageFormat} source={{ uri: props.uriPic }} />
);

const Dessert = (props) => (
  <View style={styles.dessertConteneur}>
    <DessertPic uriPic={props.uriPic} />
    <Text style={{ fontSize: 20, padding: 10 }}>{props.nom}</Text>
  </View>
);

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Entete />
      <Dessert nom="Gâteau à la vanille" uriPic="https://www.lifeloveandsugar.com/wp-content/uploads/2023/05/Raspberry-Dream-Cake3E.jpg" />
      <Dessert nom="Tarte aux baies" uriPic="http://www.peanutbutterandpeppers.com/wp-content/uploads/2012/05/Berry-Tart-006.jpg" />
      <Dessert nom="Gâteau au chocolat végan" uriPic="https://thebananadiaries.com/wp-content/uploads/2023/06/vegan-chocolate-cake_3640.jpg" />
      <Dessert nom="Biscuits au chocolat et à l'orange" uriPic="https://www.mashed.com/img/gallery/trader-joes-brought-back-this-chocolate-citrus-holiday-favorite/l-intro-1639235243.jpg" />
      <StatusBar style="light" />
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