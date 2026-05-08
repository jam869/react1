import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

const translations = {
  'en-CA': { 
    produits: 'Products', panier: 'Cart', compte: 'Account', acheter: 'Buy', total: 'Total:', vide: 'Empty cart', ajout: 'Add to cart',
    non_connecte: 'Not connected', nom_label: 'Name (read-only):', mdp_label: 'Password:', adresse_label: 'Address:', 
    langue_label: 'Preferred language:', sauvegarder: 'Save', voir_entrepots: 'Our Warehouses', succes_maj: 'Success: Information updated.'
  },
  'fr-CA': { 
    produits: 'Produits', panier: 'Panier', compte: 'Compte', acheter: 'Acheter', total: 'Total :', vide: 'Panier vide', ajout: 'Ajouter au panier',
    non_connecte: 'Non connecté', nom_label: 'Nom (non modifiable) :', mdp_label: 'Mot de passe :', adresse_label: 'Adresse :', 
    langue_label: 'Langue préférée :', sauvegarder: 'Sauvegarder', voir_entrepots: 'Nos Entrepôts', succes_maj: 'Succès : Informations mises à jour.'
  },
};

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'fr-CA';
i18n.locale = getLocales()[0]?.languageTag || 'fr-CA';
