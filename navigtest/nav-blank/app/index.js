import { Redirect } from 'expo-router';

export default function Index() {
    // Redirige automatiquement vers le dossier accueil dans les tabs
    return <Redirect href="/accueil" />;
}