import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enviarConsultaMedica } from '@/services/openaiService'
import { IMessage } from 'react-native-gifted-chat';
import { Alert } from 'react-native';

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

  const MAX_MSGS_CHAT = 20; // 20 intercambios

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

    // Límite mensajes por chat
    if (messages.length >= MAX_MSGS_CHAT * 2) {
      Alert.alert(
        'Límite alcanzado',
        `Chat completo (${MAX_MSGS_CHAT} intercambios). Inicia nuevo.`,
        [{ text: 'Nuevo chat', onPress: () => setMessages([]) }]
      );
      return;
    }

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
    Alert.alert('Limpiar', '¿Borrar conversación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpiar', onPress: () => { 
          setMessages([])
          AsyncStorage.removeItem('medicalChat');
        }
      }
    ]);
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