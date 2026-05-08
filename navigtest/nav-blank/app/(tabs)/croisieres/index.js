import { Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import voyages from '../../../trips.json';

export default function ListeLignes() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.header}>Nos Lignes de Croisières</Text>
            <FlatList
                data={voyages}
                renderItem={({ item }) => (
                    <Pressable 
                        style={({ pressed }) => [styles.btn, { backgroundColor: pressed ? 'blue' : '#3bd' }]}
                        onPress={() => router.push(`/croisieres/${item.cruiseLine}`)}
                    >
                        <Text style={{ color: 'white', fontSize: 18 }}>{item.cruiseLine}</Text>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: { fontSize: 30, color: 'white', backgroundColor: '#38f', padding: 10 },
    btn: { padding: 15, margin: 10, borderRadius: 5 }
});