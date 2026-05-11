import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import { View } from 'react-native';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <Header />
      <Tabs screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopColor: '#333',
          height: 60,
          paddingBottom: 8,
        },
      }}>
        <Tabs.Screen
          name="produits/index"
          options={{
            title: t('products'),
            tabBarIcon: ({ color, size }) => <Ionicons name="car-sport-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="produits/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="panier"
          options={{
            title: t('cart'),
            tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="compte/index"
          options={{
            title: t('account'),
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="compte/entrepots"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
