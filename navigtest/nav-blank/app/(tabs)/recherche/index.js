import { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import voyages from '../../../trips.json';
import Croisiere from '../../composants/Croisiere';

export default function Recherche() {
    // État pour stocker le texte tapé par l'utilisateur
    const [texteRecherche, setTexteRecherche] = useState('');

    // Filtrer les voyages en fonction de la recherche
    const voyagesFiltres = voyages.map(voyage => {
        // On filtre les croisières internes pour voir si elles correspondent au texte
        const croisieresTrouvees = voyage.croisieres.filter(c => 
            c.destination.toLowerCase().includes(texteRecherche.toLowerCase()) ||
            c.depart.toLowerCase().includes(texteRecherche.toLowerCase()) ||
            voyage.cruiseLine.toLowerCase().includes(texteRecherche.toLowerCase())
        );

        return {
            ...voyage,
            croisieres: croisieresTrouvees
        };
    }).filter(voyage => voyage.croisieres.length > 0); // On ne garde que les lignes qui ont des résultats

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titrePrincipal}>Rechercher une croisière</Text>
            
            {/* Barre de recherche */}
            <TextInput
                style={styles.barreRecherche}
                placeholder="Ex: Caraïbes, Miami, Alaska..."
                value={texteRecherche}
                onChangeText={setTexteRecherche}
                clearButtonMode="always" // Ajoute un petit (x) pour effacer sur iOS
            />

            {/* Affichage des résultats */}
            {voyagesFiltres.length > 0 ? (
                <FlatList
                    data={voyagesFiltres}
                    keyExtractor={(item) => item.cruiseLine}
                    renderItem={({ item }) => (
                        <Croisiere 
                            ligne={item.cruiseLine} 
                            croisieres={item.croisieres} 
                            afficherJours={true} // On affiche les jours pour plus de détails
                        />
                    )}
                />
            ) : (
                <Text style={styles.aucunResultat}>Aucune croisière trouvée pour "{texteRecherche}"</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    titrePrincipal: {
        fontSize: 30,
        color: 'white',
        backgroundColor: '#38f',
        padding: 10,
        textAlign: 'center'
    },
    barreRecherche: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        margin: 15,
        backgroundColor: 'white',
        fontSize: 16
    },
    aucunResultat: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
        fontStyle: 'italic'
    }
});