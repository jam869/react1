import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import voyages from '../../../trips.json';
import Croisiere from '../../composants/Croisiere';

export default function Accueil() {
    const voyagesAccueil = voyages.map(v => ({
        ...v,
        croisieres: v.croisieres.filter(c => c.surPageAccueil === 1)
    })).filter(v => v.croisieres.length > 0);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.header}>Nos Croisières en Promotion</Text>
            <FlatList
                data={voyagesAccueil}
                renderItem={({ item }) => <Croisiere ligne={item.cruiseLine} croisieres={item.croisieres} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: { fontSize: 30, color: 'white', backgroundColor: '#38f', textAlign: 'center', padding: 10 }
});