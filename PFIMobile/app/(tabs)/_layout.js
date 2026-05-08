import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../Context';
import { i18n } from '../../locales/i18n';
import { View, Text, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function TabLayout() {
  const { langue, usager, deconnexion } = useContext(GlobalContext);
  const db = useSQLiteContext();
  
  i18n.locale = langue;
const handleLogout = async () => {
    try {
      await db.runAsync('DELETE FROM Session');
    } catch (e) { console.log(e); }
    
    deconnexion();
  };

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#007AFF',
        headerRight: () => (
          usager ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 15 }}>
              <Text style={{ fontWeight: 'bold' }}>{usager.nom}</Text>
              <Pressable onPress={handleLogout}>
                <Text style={{ color: 'red' }}>Déconnexion</Text>
              </Pressable>
            </View>
          ) : null
        )
      }}
    >
      <Tabs.Screen 
        name="produits/index" 
        options={{ 
          title: i18n.t("produits") || "Produits", 
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> 
        }} 
      />
      
      <Tabs.Screen 
        name="produits/details" 
        options={{ href: null }} 
      />
      
      <Tabs.Screen 
        name="panier" 
        options={{ 
          title: i18n.t("panier") || "Panier", 
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} /> 
        }} 
      />
      
      <Tabs.Screen 
        name="compte" 
        options={{ 
          title: i18n.t("compte") || "Compte", 
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}