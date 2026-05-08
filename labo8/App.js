/**
 * Labo 8 BD
 * expo-sqlite avec SQLiteProvider
 * Fait par : Nathan Aguiar
 */

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, FlatList } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

async function initDb(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS note (
      num INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT,
      contenu TEXT
    );
  `);
}

function NotePressable({ note, rafraichirNotes, isExpanded, onToggle }) {
  const db = useSQLiteContext();
  const [isEditing, setIsEditing] = useState(false);
  const [modifierNote, setModifierNote] = useState({ titre: note.titre, contenu: note.contenu });

  const supprimer = async () => {
    await db.runAsync('DELETE FROM note WHERE num = $num', { $num: note.num });
    rafraichirNotes();
  };

  const sauvegarderModification = async () => {
    await db.runAsync('UPDATE note SET titre = ?, contenu = ? WHERE num = ?', [modifierNote.titre, modifierNote.contenu, note.num]);
    setIsEditing(false);
    rafraichirNotes();
  };

  return (
    <View style={styles.noteContainer}>
      <Pressable onPress={onToggle} style={styles.notePressable}>
        <Text style={styles.titreNote}>{note.titre}</Text>
        {isExpanded && !isEditing && (
          <View style={styles.actionsContainer}>
             <Pressable onPress={() => setIsEditing(true)} style={styles.actionBtn}><Text>✏️ Modifier</Text></Pressable>
             <Pressable onPress={supprimer} style={styles.actionBtn}><Text>🗑️ Supprimer</Text></Pressable>
          </View>
        )}
      </Pressable>
      
      {isExpanded && !isEditing && (
        <Text style={styles.contenuNote}>{note.contenu}</Text>
      )}

      {isExpanded && isEditing && (
        <View style={styles.modifierForm}>
          <TextInput 
            style={styles.input} 
            value={modifierNote.titre} 
            onChangeText={(t) => setModifierNote({ ...modifierNote, titre: t })} 
          />
          <TextInput 
            style={styles.input} 
            multiline 
            value={modifierNote.contenu} 
            onChangeText={(c) => setModifierNote({ ...modifierNote, contenu: c })} 
          />
          <Pressable onPress={sauvegarderModification} style={styles.btnEnregistrer}>
            <Text>Enregistrer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function CacherAfficherBouton({ afficherFormulaire, setAfficherFormulaire }) {
  return (
    <Pressable 
      style={[styles.toggleBtn, { backgroundColor: afficherFormulaire ? 'grey' : 'lightcoral' }]} 
      onPress={() => setAfficherFormulaire(!afficherFormulaire)}
    >
      <Text style={styles.toggleBtnText}>
        {afficherFormulaire ? "Annuler" : "Ajouter une nouvelle note"}
      </Text>
    </Pressable>
  );
}

function Formulaire({ rafraichirNotes, setAfficherFormulaire }) {
  const db = useSQLiteContext();
  const [note, setNote] = useState({ titre: "", contenu: "" });

  const sauvegarder = async () => {
    if (note.titre.trim() !== "") {
      await db.runAsync('INSERT INTO note (titre, contenu) VALUES (?, ?)', [note.titre, note.contenu]);
      setNote({ titre: "", contenu: "" });
      setAfficherFormulaire(false);
      rafraichirNotes();
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput 
        placeholder="Titre" 
        value={note.titre} 
        onChangeText={(t) => setNote({ ...note, titre: t })} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Contenu" 
        value={note.contenu} 
        onChangeText={(c) => setNote({ ...note, contenu: c })} 
        multiline 
        style={styles.input} 
      />
      <Pressable onPress={sauvegarder} style={styles.btnEnregistrer}>
        <Text style={styles.btnEnregistrerText}>Sauvegarder</Text>
      </Pressable>
    </View>
  );
}

function Contenu() {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const fetchNotes = async () => {
    const result = await db.getAllAsync('SELECT * FROM note');
    setNotes(result);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Todo Notes Nathan</Text>
      
      <FlatList
        data={notes}
        keyExtractor={(item) => item.num.toString()}
        renderItem={({ item }) => (
          <NotePressable 
            note={item} 
            rafraichirNotes={fetchNotes} 
            isExpanded={expandedNoteId === item.num}
            onToggle={() => setExpandedNoteId(expandedNoteId === item.num ? null : item.num)}
          />
        )}
        ListEmptyComponent={<Text style={styles.msgVide}>Vous n'avez aucune note pour le moment!</Text>}
        style={styles.list}
      />

      <CacherAfficherBouton 
        afficherFormulaire={afficherFormulaire} 
        setAfficherFormulaire={setAfficherFormulaire} 
      />
      
      {afficherFormulaire && (
        <Formulaire 
          rafraichirNotes={fetchNotes} 
          setAfficherFormulaire={setAfficherFormulaire} 
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SQLiteProvider databaseName="notes.db" onInit={initDb}>
      <Contenu />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  list: {
    flex: 1,
  },
  msgVide: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20
  },
  noteContainer: {
    marginBottom: 10,
  },
  notePressable: {
    backgroundColor: "lightsalmon",
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titreNote: {
    fontSize: 18,
    fontWeight: '500'
  },
  contenuNote: {
    backgroundColor: "lightgrey",
    padding: 15,
    fontSize: 16
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10
  },
  actionBtn: {
    padding: 5,
  },
  toggleBtn: {
    padding: 15,
    alignItems: 'center',
    marginVertical: 10
  },
  toggleBtnText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  formContainer: {
    paddingBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9'
  },
  btnEnregistrer: {
    backgroundColor: 'lightblue',
    padding: 15,
    alignItems: 'center'
  },
  btnEnregistrerText: {
    fontWeight: 'bold'
  },
  modifierForm: {
    backgroundColor: "lightgrey",
    padding: 15,
  }
});