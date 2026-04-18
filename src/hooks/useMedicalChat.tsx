import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enviarConsultaMedica } from '@/services/openaiService'
import { IMessage } from 'react-native-gifted-chat';

interface Message extends IMessage {
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar?: string;
  };
}

export const useMedicalChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [disclaimerAceptado, setDisclaimerAceptado] = useState(false);

  // Cargar historial
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('medicalChat');
      if (history) {
        setMessages(JSON.parse(history));
      }
    } catch (error) {
      console.log('Error loading history');
    }
  };

  const enviarMensaje = useCallback(async (mensaje: string) => {
    if (!disclaimerAceptado || loading) return;

    const userMessage = {
      _id: Math.random().toString(),
      text: mensaje,
      createdAt: new Date(),
      user: { _id: 1, name: 'Tú', avatar: '👤' },
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const respuestaIA = await enviarConsultaMedica(mensaje);
      const aiMessage = {
        _id: Math.random().toString(),
        text: respuestaIA,
        createdAt: new Date(),
        user: { 
          _id: 2, 
          name: 'Dr. IA', 
          avatar: '🩺🤖' 
        },
      };

      setMessages(prev => [...prev, aiMessage]);
      await AsyncStorage.setItem('medicalChat', JSON.stringify([...messages, userMessage, aiMessage]));
    } catch (error) {
      const errorMessage = {
        _id: Math.random().toString(),
        text: '❌ Error de conexión. Revisa tu internet.',
        createdAt: new Date(),
        user: { _id: 2, name: 'Dr. IA' },
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [disclaimerAceptado, loading, messages]);

  const aceptarDisclaimer = () => setDisclaimerAceptado(true);

  const limpiarChat = () => {
    setMessages([]);
    AsyncStorage.removeItem('medicalChat');
  };

  return {
    messages,
    loading,
    disclaimerAceptado,
    enviarMensaje,
    aceptarDisclaimer,
    limpiarChat,
  };
};