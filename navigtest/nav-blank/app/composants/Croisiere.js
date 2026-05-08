import { View, Text, StyleSheet } from 'react-native';

const Croisiere = ({ ligne, croisieres, afficherJours = false }) => {
    return (
        <View>
            <Text style={styles.titreLigne}>{ligne}</Text>
            {croisieres.map((c, index) => (
                <View key={index} style={styles.item}>
                    <Text style={styles.bleuGras}>Destination: {c.destination}</Text>
                    <Text style={styles.bleuGras}>départ de {c.depart}</Text>
                    {afficherJours && <Text style={styles.bleuGras}>nombre de jours: {c.nbreJours}</Text>}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    titreLigne: { fontSize: 25, color: 'white', backgroundColor: 'blue', padding: 7, margin: 7 },
    item: { padding: 4, margin: 4 },
    bleuGras: { fontSize: 15, color: 'blue', fontWeight: 'bold' }
});

export default Croisiere;