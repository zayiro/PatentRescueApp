// MedicalAssistantScreen.tsx
import React, { useState, useRef } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';

const MedicalAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const enviarMensaje = async (message) => {
    const userMessage = {
      _id: Math.random().toString(),
      text: message.text,
      createdAt: new Date(),
      user: { _id: 1, name: 'Usuario' },
    };

    setMessages(prev => GiftedChat.append(prev, [userMessage]));
    setLoading(true);

    try {
      const response = await axios.post('/api/medical-ai', {
        message: message.text,
        context: 'consulta_medica',
      });

      const aiMessage = {
        _id: Math.random().toString(),
        text: response.data.respuesta,
        createdAt: new Date(),
        user: { _id: 2, name: 'Dr. IA', avatar: '🤖' },
      };

      setMessages(prev => GiftedChat.append(prev, [aiMessage]));
    } catch (error) {
      console.error('Error IA:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={enviarMensaje}
      user={{ _id: 1 }}
      placeholder="Describe tus síntomas..."
      loading={loading}
      renderLoading={() => <ActivityIndicator size="large" color="#0066CC" />}
    />
  );
};