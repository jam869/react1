import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useCart } from '../../../context/CartContext';
import { useTranslation } from 'react-i18next';
import Slider from '@react-native-community/slider';

export default function DetailsProduit() {
  const { id } = useLocalSearchParams();
  const [produit, setProduit] = useState(null);
  const { addToCart: ajouterAuPanier } = useCart();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [mois, setMois] = useState(60);
  const [interet, setInteret] = useState(5.5);
  const [acompte, setAcompte] = useState(10000);

  useEffect(() => {
    const chargerProduit = async () => {
      const bdd = await SQLite.openDatabaseAsync('pfi_auto.db');
      const element = await bdd.getFirstAsync('SELECT * FROM Produit WHERE id = ?', [id]);
      setProduit(element);
    };
    chargerProduit();
  }, [id]);

  if (!produit) return <View style={styles.container}><Text>Chargement...</Text></View>;

  const formaterPrix = (prix) => {
    return new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(prix);
  };

  const calculerMensualite = () => {
    const capital = produit.prix - acompte;
    const tauxMensuel = (interet / 100) / 12;
    const nombreDeMois = mois;
    if (tauxMensuel === 0) return (capital / nombreDeMois);
    const mensualite = (capital * tauxMensuel * Math.pow(1 + tauxMensuel, nombreDeMois)) / (Math.pow(1 + tauxMensuel, nombreDeMois) - 1);
    return mensualite > 0 ? mensualite : 0;
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: produit.nom,
        headerStyle: { backgroundColor: '#0A0A0A' },
        headerTintColor: '#D4AF37'
      }} />
      <Image source={{ uri: produit.image }} style={styles.image} />
      
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{produit.nom}</Text>
          <Text style={styles.price}>{formaterPrix(produit.prix)}</Text>
        </View>
        
        <Text style={styles.description}>{produit.description}</Text>
        
        <View style={styles.calculator}>
          <Text style={styles.calcTitle}>{t('financing_calc')}</Text>
          
          <View style={styles.calcSection}>
            <View style={styles.labelRow}>
              <Text style={styles.calcLabel}>{t('months')}</Text>
              <Text style={styles.calcValue}>{mois}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={24}
              maximumValue={84}
              step={12}
              value={mois}
              onValueChange={setMois}
              minimumTrackTintColor="#D4AF37"
              maximumTrackTintColor="#333"
              thumbTintColor="#D4AF37"
            />
          </View>

          <View style={styles.calcSection}>
            <View style={styles.labelRow}>
              <Text style={styles.calcLabel}>{t('interest')}</Text>
              <Text style={styles.calcValue}>{interet.toFixed(1)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.9}
              maximumValue={12.9}
              step={0.1}
              value={interet}
              onValueChange={setInteret}
              minimumTrackTintColor="#D4AF37"
              maximumTrackTintColor="#333"
              thumbTintColor="#D4AF37"
            />
          </View>

          <View style={styles.calcSection}>
            <View style={styles.labelRow}>
              <Text style={styles.calcLabel}>Comptant (Down payment)</Text>
              <Text style={styles.calcValue}>{formaterPrix(acompte)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={produit.prix * 0.5}
              step={1000}
              value={acompte}
              onValueChange={setAcompte}
              minimumTrackTintColor="#D4AF37"
              maximumTrackTintColor="#333"
              thumbTintColor="#D4AF37"
            />
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>{t('monthly_payment')}</Text>
            <Text style={styles.monthlyResult}>{formaterPrix(calculerMensualite())}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            ajouterAuPanier(produit);
            router.back();
          }}
        >
          <Text style={styles.addText}>{t('add')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  image: {
    width: '100%',
    height: 350,
  },
  info: {
    padding: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 0.7,
  },
  price: {
    fontSize: 20,
    color: '#D4AF37',
    fontWeight: '900',
    flex: 0.3,
    textAlign: 'right',
  },
  description: {
    fontSize: 15,
    color: '#BBB',
    lineHeight: 22,
    marginBottom: 30,
  },
  calculator: {
    backgroundColor: '#151515',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  calcTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D4AF37',
    textAlign: 'center',
  },
  calcSection: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calcLabel: {
    fontSize: 14,
    color: '#888',
  },
  calcValue: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resultBox: {
    backgroundColor: '#0A0A0A',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D4AF3733',
  },
  resultLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  monthlyResult: {
    fontSize: 24,
    fontWeight: '900',
    color: '#28a745',
  },
  addButton: {
    backgroundColor: '#D4AF37',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 50,
  },
  addText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
