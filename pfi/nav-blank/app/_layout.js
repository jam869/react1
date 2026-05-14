import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { useEffect } from 'react';
import { initialiserBaseDeDonnees } from '../utils/db';
import '../utils/i18n';

export default function RootLayout() {
  useEffect(() => {
    initialiserBaseDeDonnees();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </AuthProvider>
  );
}
