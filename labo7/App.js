// Nathan Aguiar Laboratoire 7 16 mars 2026

import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import Header from './Header';

const Item = ({ id, task, completed }) => {
  return (
    <View style={styles.itemContainer}>
      <Text>
        {id}: {task} {completed ? <Text style={{fontWeight: 'bold'}}>completed</Text> : ""}
      </Text>
    </View>
  );
}

export default function App() {
  const [taches, setTaches] = useState([]);
  
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["#FA8072", "#90EE90", "#ADD8E6"];

  const fetchTasks = () => {
    fetch("https://dummyjson.com/todos")
      .then(response => response.json())
      .then(json => {
        const lastId = taches.length > 0 ? taches[taches.length - 1].id : 0;
        
        const newTasks = json.todos.map((task, index) => {
          return {
            ...task,
            id: lastId + index + 1
          };
        });

        setTaches(prevTaches => [...prevTaches, ...newTasks]);
        
        setColorIndex(prevIndex => (prevIndex + 1) % 3);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const itemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <Header titre="Tâches Nathan" couleurFond="blue"/>
      
      <View style={{justifyContent: 'center', flex: 1}}>
        <Pressable 
          onLongPress={fetchTasks} 
          delayLongPress={1000} 
          style={[styles.pressable, { backgroundColor: colors[colorIndex] }]}
        >
          <Text style={{fontSize: 16}}>Fetch Tasks</Text>
        </Pressable>
      </View>

      <View style={{flex: 12}}>
        <FlatList
          data={taches}
          renderItem={({ item }) => <Item id={item.id} task={item.todo} completed={item.completed} />}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={itemSeparator}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 20
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  itemContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  }
});