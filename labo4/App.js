// Nathan Aguiar Labo 4 19 février 2026

import React, { useState, useRef, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput,  Button, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import initialMessages from './lesMessages';

const ButtonBox = ({ onAnnuler, onEnvoyer }) => (
  <View style={styles.buttonBox}>
    <Button title="ANNULER" color="gray" onPress={onAnnuler} />
    <Button title="ENVOYER" onPress={onEnvoyer} />
  </View>
);

const NouveauMessage = ({ messageText, setMessageText, handleSend, handleCancel }) => (
  <View style={styles.nouveauMessageContainer}>
    <TextInput
      style={styles.inputMessage}
      placeholder="Saisissez votre message"
      placeholderTextColor="#6e7276"
      value={messageText}
      onChangeText={setMessageText}
      autoFocus={true} 
    />
    <ButtonBox onAnnuler={handleCancel} onEnvoyer={handleSend} />
  </View>
);

const Message = ({ de, texte }) => {
  const isVous = de === "vous";
  return (
    <View style={[styles.messageBulle, isVous ? styles.bulleVous : styles.bulleAutre]}>
      <Text style={[styles.messageTexte, isVous ? styles.texteVous : styles.texteAutre]}>
        {texte}
      </Text>
    </View>
  );
};

const Conversation = ({ messages, scrollRef }) => (
  <ScrollView 
    style={styles.conversationScroll}
    ref={scrollRef}
    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })} 
  >
    {messages.map((m, index) => (
      <Message key={index} de={m.de} texte={m.texte} />
    ))}
  </ScrollView>
);

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [currentMessage, setCurrentMessage] = useState("");
  const scrollRef = useRef();

  const handleSend = () => {
    if (currentMessage.trim() === "") return;

    const nouveauMsg = { texte: currentMessage, de: "vous" };
    const nouvelleListe = [...messages, nouveauMsg];
    setMessages(nouvelleListe);
    setCurrentMessage("");

    setTimeout(() => {
      const reponses = ["Oui", "Non", "Peut-être"];
      const reponseAleatoire = {
        texte: reponses[Math.floor(Math.random() * reponses.length)],
        de: "Solange"
      };
      setMessages(prev => [...prev, reponseAleatoire]);
    }, 2000);
  };

  const handleCancel = () => setCurrentMessage("");

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}>

      <View style={{ flex: 1 }}>
        <Conversation messages={messages} scrollRef={scrollRef} />
      </View>

      <NouveauMessage 
        messageText={currentMessage}
        setMessageText={setCurrentMessage}
        handleSend={handleSend}
        handleCancel={handleCancel}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  buttonBox: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 5,
  },
  nouveauMessageContainer: {
    borderTopWidth: 1, 
    borderTopColor: '#2199de', 
    padding: 5, 
    margin: 5,
  },
  inputMessage: {
    backgroundColor: '#f2f3f3',
    borderRadius: 10, 
    color: '#6e7276',
    padding: 10, 
    fontSize: 16,
  },
  conversationScroll: {
    flex: 1, 
  },
  messageBulle: {
    padding: 10, 
    margin: 10, 
    borderRadius: 10, 
    maxWidth: '80%',
  },
  messageTexte: {
    fontWeight: 'bold', 
  },
  bulleVous: {
    backgroundColor: '#2199de', 
    alignSelf: 'flex-end', 
  },
  texteVous: {
    color: 'white', 
  },
  bulleAutre: {
    backgroundColor: '#f2f3f3', 
    alignSelf: 'flex-start', 
  },
  texteAutre: {
    color: '#6e7276',
  },
});