import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../Context';
import { i18n } from '../../locales/i18n';
import { View, Text, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function TabLayout() {
  const { langue, usager, deconnexion, theme } = useContext(GlobalContext);
  const db = useSQLiteContext();
  
  i18n.locale = langue;
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      await db.runAsync('DELETE FROM Session');
    } catch (e) { console.log(e); }
    
    deconnexion();
  };

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: isDark ? '#888' : '#aaa',
        tabBarStyle: { 
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
          borderTopColor: isDark ? '#333' : '#eee'
        },
        headerStyle: { 
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
          borderBottomColor: isDark ? '#333' : '#eee'
        },
        headerTintColor: isDark ? '#fff' : '#000',
        headerRight: () => (
          usager ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 15 }}>
              <Text style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>{usager.nom}</Text>
              <Pressable onPress={handleLogout}>
                <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Déconnexion</Text>
              </Pressable>
            </View>
          ) : null
        )
      }}
    >
      <Tabs.Screen 
        name="produits" 
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
