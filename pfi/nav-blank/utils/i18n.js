import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Auto Prestige",
      login: "Login",
      logout: "Logout",
      username: "Username",
      password: "Password",
      address: "Address",
      language: "Language",
      products: "Products",
      cart: "Cart",
      account: "Account",
      admin: "Admin",
      delete: "Delete",
      add: "Add",
      price: "Price",
      quantity: "Quantity",
      total: "Total",
      grand_total: "Grand Total",
      buy: "Buy",
      empty_cart: "Empty Cart",
      warehouses: "Warehouses",
      save: "Save",
      auto: "Auto",
      success_purchase: "Purchase Successful!",
      close: "Close",
      financing_calc: "Financing Calculator",
      months: "Months",
      interest: "Interest %",
      monthly_payment: "Monthly Payment"
    }
  },
  fr: {
    translation: {
      welcome: "Bienvenue chez Auto Prestige",
      login: "Connexion",
      logout: "Déconnexion",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      address: "Adresse",
      language: "Langue",
      products: "Produits",
      cart: "Panier",
      account: "Compte",
      admin: "Admin",
      delete: "Supprimer",
      add: "Ajouter",
      price: "Prix",
      quantity: "Quantité",
      total: "Total",
      grand_total: "Total général",
      buy: "Acheter",
      empty_cart: "Vider le panier",
      warehouses: "Entrepôts",
      save: "Sauvegarder",
      auto: "Auto",
      success_purchase: "Achat réussi!",
      close: "Fermer",
      financing_calc: "Calculateur de Financement",
      months: "Mois",
      interest: "Intérêt %",
      monthly_payment: "Paiement mensuel"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (Localization.getLocales ? Localization.getLocales()[0].languageCode : 'en'),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
