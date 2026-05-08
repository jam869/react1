import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'lightblue',
            headerShown: false
        }}>
            <Tabs.Screen 
                name="accueil/index" 
                options={{
                    title: "accueil",
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />
                }} 
            />
            <Tabs.Screen 
                name="croisieres" 
                options={{
                    title: "croisières",
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="boat" color={color} />
                }} 
            />
            <Tabs.Screen 
                name="recherche/index" 
                options={{
                    title: "recherche",
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="search" color={color} />
                }} 
            />
        </Tabs>
    );
}