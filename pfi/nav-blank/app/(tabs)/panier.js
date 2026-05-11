import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

export default function PanierPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getGrandTotal } = useCart();
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-CA' : 'en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price);
  };

  const handlePurchase = () => {
    setModalVisible(true);
  };

  const confirmPurchase = () => {
    clearCart();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.thumbnail} />
      <View style={styles.details}>
        <Text style={styles.itemName}>{item.nom}</Text>
        <Text style={styles.priceText}>{t('price')}: {formatPrice(item.prix)}</Text>
        <Text style={styles.totalText}>{t('total')}: {formatPrice(item.prix * item.quantity)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Ionicons name="remove-circle-outline" size={26} color="#D4AF37" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Ionicons name="add-circle-outline" size={26} color="#D4AF37" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('cart')}</Text>
      
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#333" />
          <Text style={styles.emptyText}>{t('empty_cart')}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            style={styles.list}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>{t('grand_total')}</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(getGrandTotal())}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearCart}>
                <Text style={styles.clearButtonText}>{t('empty_cart')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buyButton]} onPress={handlePurchase}>
                <Text style={styles.buyButtonText}>{t('buy')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Advanced Extra: Lottie Animation for success */}
            <LottieView
              source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_lk80p9at.json' }} // Confetti checkmark
              autoPlay
              loop={false}
              style={styles.lottie}
            />
            <Text style={styles.modalTitle}>{t('success_purchase')}</Text>
            <Text style={styles.modalTotal}>{t('grand_total')}: {formatPrice(getGrandTotal())}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={confirmPurchase}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 25,
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#151515',
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  priceText: {
    color: '#AAA',
    fontSize: 12,
  },
  totalText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  removeButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginTop: 20,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#0A0A0A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  grandTotalLabel: {
    color: '#888',
    fontSize: 16,
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D4AF37',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 0.48,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
  },
  buyButton: {
    backgroundColor: '#D4AF37',
  },
  clearButtonText: {
    color: '#AAA',
    fontWeight: 'bold',
  },
  buyButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF3744',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 15,
    textAlign: 'center',
  },
  modalTotal: {
    fontSize: 18,
    color: '#D4AF37',
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
