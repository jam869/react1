import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router'; 
import voyages from '../../../trips.json';
import Croisiere from '../../composants/Croisiere';

export default function Details() {
    // 1. On extrait la variable 'id' depuis l'URL cliquée
    // Si on a cliqué sur "Norwegian", id = "Norwegian"
    const { id } = useLocalSearchParams();

    // 2. On cherche dans notre tableau JSON la ligne de croisière qui correspond
    const voyageSelectionne = voyages.find(v => v.cruiseLine === id);

    return (
        <ScrollView style={styles.container}>
            {/* 3. On configure l'entête du Stack pour afficher le bouton "Retour" */}
            <Stack.Screen options={{ title: 'Retour' }} />

            {/* 4. Si la croisière existe, on appelle le composant Croisiere
                   en lui passant les informations et en demandant d'afficher les jours */}
            {voyageSelectionne ? (
                <Croisiere 
                    ligne={voyageSelectionne.cruiseLine} 
                    croisieres={voyageSelectionne.croisieres} 
                    afficherJours={true} 
                />
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    }
});