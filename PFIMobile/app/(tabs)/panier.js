import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Modal, Image } from 'react-native';
import { GlobalContext } from '../../Context';
import { i18n } from '../../locales/i18n';

export default function PanierClient() {
  const { panier, setPanier, usager, langue, theme } = useContext(GlobalContext);
  const [modalVisible, setModalVisible] = useState(false);

  const formaterPrix = (montant) => {
    try {
      return new Intl.NumberFormat(langue === 'auto' ? 'fr-CA' : langue, { 
        style: 'currency', 
        currency: 'CAD' 
      }).format(montant);
    } catch (e) {
      return Number(montant).toFixed(2) + ' $';
    }
  };

  const total = panier.reduce((somme, item) => somme + Number(item.prix || 0) * (item.quantite || 1), 0);
  
  i18n.locale = langue === 'auto' ? 'fr-CA' : langue;

  const acheter = () => {
    if (panier.length === 0) return;
    setModalVisible(true);
  };

  const fermerModal = () => {
    setModalVisible(false);
    setPanier([]);
  };

  const modifierQuantite = (id, delta) => {
    setPanier((precedent) => {
      return precedent
        .map((item) => {
          if (item.id === id) {
            const nvQuantite = (item.quantite || 1) + delta;
            return nvQuantite > 0 ? { ...item, quantite: nvQuantite } : null;
          }
          return item;
        })
        .filter((item) => item !== null);
    });
  };

  if (!usager) {
    return (
      <View style={styles.container}>
        <Text style={styles.vide}>{i18n.t('non_connecte') || 'Connectez-vous pour utiliser le panier.'}</Text>
      </View>
    );
  }

  const isDark = theme === 'dark';
  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#121212' : '#f8f9fa' },
    text: { color: isDark ? '#fff' : '#000' },
    card: { 
      backgroundColor: isDark ? '#1e1e1e' : 'white',
      shadowColor: isDark ? '#000' : '#000'
    },
    footer: { borderColor: isDark ? '#333' : '#eee' },
    totalText: { color: isDark ? '#fff' : '#2c3e50' },
    modalContent: { backgroundColor: isDark ? '#1e1e1e' : 'white' },
    modalText: { color: isDark ? '#bbb' : '#34495e' }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {panier.length === 0 ? (
        <Text style={[styles.vide, { color: isDark ? '#888' : '#7f8c8d' }]}>{i18n.t('vide')}</Text>
      ) : (
        <FlatList
          data={panier}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, dynamicStyles.card]}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, dynamicStyles.text]}>{item.nom}</Text>
                <Text style={styles.itemPrice}>{formaterPrix(item.prix)} x {item.quantite}</Text>
                <Text style={styles.itemSubtotal}>{i18n.t('sous_total') || 'Sous-total :'} {formaterPrix(item.prix * item.quantite)}</Text>
              </View>
              <View style={styles.qtyContainer}>
                <Pressable onPress={() => modifierQuantite(item.id, -1)} style={[styles.qtyBtn, { backgroundColor: isDark ? '#333' : '#eee' }]}>
                  <Text style={[styles.qtyBtnText, dynamicStyles.text]}>-</Text>
                </Pressable>
                <Text style={[styles.qtyText, dynamicStyles.text]}>{item.quantite}</Text>
                <Pressable onPress={() => modifierQuantite(item.id, 1)} style={[styles.qtyBtn, { backgroundColor: isDark ? '#333' : '#eee' }]}>
                  <Text style={[styles.qtyBtnText, dynamicStyles.text]}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <View style={[styles.footer, dynamicStyles.footer]}>
        <Text style={[styles.totalText, dynamicStyles.totalText]}>{i18n.t('total')} {formaterPrix(total)}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={() => setPanier([])} style={[styles.button, { backgroundColor: '#e74c3c' }]}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{i18n.t('vider') || 'Vider'}</Text>
          </Pressable>
          <Pressable onPress={acheter} style={[styles.button, { backgroundColor: '#2ecc71' }]}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{i18n.t('acheter')}</Text>
          </Pressable>
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
            <Text style={[styles.modalTitle, dynamicStyles.text]}>🎉 {i18n.t('merci_titre') || 'Merci !'}</Text>
            <Text style={[styles.modalText, dynamicStyles.modalText]}>{i18n.t('merci_message') || 'Votre achat a été complété avec succès.'}</Text>
            <Pressable style={styles.modalBtn} onPress={fermerModal}>
              <Text style={styles.modalBtnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f8f9fa' },
  vide: { textAlign: 'center', fontSize: 18, marginTop: 50, color: '#7f8c8d' },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: { width: 60, height: 60, marginRight: 15, borderRadius: 5 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { color: '#7f8c8d' },
  itemSubtotal: { color: '#2ecc71', fontWeight: 'bold' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { backgroundColor: '#eee', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 20, fontWeight: 'bold' },
  qtyText: { fontSize: 16, fontWeight: 'bold', minWidth: 20, textAlign: 'center' },
  footer: { marginTop: 20, borderTopWidth: 1, borderColor: '#eee', paddingTop: 15 },
  totalText: { fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 15, color: '#2c3e50' },
  button: { padding: 15, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', width: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#34495e' },
  modalBtn: { backgroundColor: '#2ecc71', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
  modalBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});

