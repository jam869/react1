import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../_layout';
import { i18n } from '../../locales/i18n';

export default function TabsLayout() {
  const { langue } = useContext(GlobalContext);
  i18n.locale = langue;

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen name="produits" options={{ title: i18n.t("produits"), tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} />
      <Tabs.Screen name="produits/details" options={{ href: null }} />
      <Tabs.Screen name="panier" options={{ title: i18n.t("panier"), tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} /> }} />
      <Tabs.Screen name="compte" options={{ title: i18n.t("compte"), tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}

