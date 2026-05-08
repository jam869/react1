import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

const translations = {
  'en-CA': { produits: 'Products', panier: 'Cart', compte: 'Account', acheter: 'Buy', total: 'Total:', vide: 'Empty cart', ajout: 'Add to cart' },
  'fr-CA': { produits: 'Produits', panier: 'Panier', compte: 'Compte', acheter: 'Acheter', total: 'Total :', vide: 'Panier vide', ajout: 'Ajouter au panier' },
};

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'fr-CA';
i18n.locale = getLocales()[0]?.languageTag || 'fr-CA';
