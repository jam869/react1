// Nathan Aguiar 26 février 2026

import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity, Pressable } from 'react-native';

const maison1 = require("./images/images/maison1.jpeg");
const maison2 = require("./images/images/maison2.jpeg");
const maison3 = require("./images/images/maison3.jpeg");
const maison4 = require("./images/images/maison4.jpeg");
const maison5 = require("./images/images/maison5.jpeg");
const maison6 = require("./images/images/maison6.jpeg");
const maison7 = require("./images/images/maison7.jpeg");
const maison8 = require("./images/images/maison8.jpeg");
const maison9 = require("./images/images/maison9.jpeg");
const maison10 = require("./images/images/maison10.jpeg");

const data = [
  { num: 1, titre: "Magnifique maison avec térasse", image: maison1 },
  { num: 2, titre: "Splendide demeure LEED sur 2 étages", image: maison2 },
  { num: 3, titre: "Un pavillion de banlieu pas comme les autres", image: maison3 },
  { num: 4, titre: "Jolie Cottage", image: maison4 },
  { num: 5, titre: "Authentique maison longue amerindienne", image: maison5 },
  { num: 6, titre: "Votre duplexe de rêve", image: maison6 },
  { num: 7, titre: "Mini-maison, max-liberté", image: maison7 },
  { num: 8, titre: "Bungalow fait pour les fan d'extérieur", image: maison8 },
  { num: 9, titre: "Le cottage qui redéfini le luxe", image: maison9 },
  { num: 10, titre: "Split level en pyramide", image: maison10 },
];

const data2 = [];
for (let i = 0; i < 100000; i++) {
  data.forEach((item) => {
    data2.push({ ...item, num: data2.length + 1 });
  });
}

const Maison = ({ maison }) => (
  <View style={styles.maisonConteneur}>
    <Image style={styles.imageMaison} source={maison.image} />
    <Text style={styles.titreMaison}>{maison.titre} {maison.num}</Text>
  </View>
);

const AfficherScrollView = ({ maisons }) => (
  <ScrollView>
    {maisons.map((m) => (
      <Maison key={m.num} maison={m} /> 
    ))}
  </ScrollView>
);

const AfficherFlatList = ({ maisons }) => {
  const ListSeparator = () => <View style={styles.separator} />;
  
  return (
    <FlatList 
      data={maisons}
     renderItem={({ item }) => <Maison maison={item} />} 
      keyExtractor={(item) => item.num.toString()}
      ItemSeparatorComponent={ListSeparator}
    />
  );
};

export default function App() {
  const [affichage, setAffichage] = useState("SCROLLVIEW");
  const [listeMaison, setListeMaison] = useState(data); 

  const isData2 = listeMaison.length > 10;

  return (
    <View style={styles.container}>
      <View style={styles.titreView}>
        <Text style={[styles.titre, isData2 && { color: 'red' }]}>
          CENTRIS NATHAN {affichage}
        </Text>
      </View>

      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.to_button} onPress={() => setAffichage("SCROLLVIEW")}>
          <Text style={{ color: 'white' }}>SCROLLVIEW</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.to_button} onPress={() => setAffichage("FLATLIST")}>
          <Text style={{ color: 'white' }}>FLATLIST</Text>
        </TouchableOpacity>

        <Pressable 
        onPress={() => setListeMaison(data)}
          onLongPress={() => setListeMaison(data2)} 
          style={({ pressed }) => [
            styles.to_button,
            { backgroundColor: pressed ? 'blue' : 'green' } 
          ]}
        >
          <Text style={{ color: 'white' }}>DATA: {listeMaison.length}</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        {affichage === "SCROLLVIEW" ? (
          <AfficherScrollView maisons={listeMaison} />
        ) : (
          <AfficherFlatList maisons={listeMaison} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 25
  },
  maisonConteneur: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 5,
    height: 160
  },
  titreView: {
    backgroundColor: "#00008b",
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titre: {
    color: "#F3F3F3",
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  to_button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 10,
    margin: 5,
    borderRadius: 5
  },
  titreMaison: {
    fontSize: 18,
    marginLeft: 10,
    marginRight: 10,
    flexShrink: 1
  },
  imageMaison: {
    width: 150,
    height: 150,
    paddingRight: 10
  },
  separator: {
    height: 2,
    width: '100%',
    backgroundColor: 'blue' 
  }
});