import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { IMessage, SendProps, GiftedChat } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { useMedicalChat } from '@/hooks/useMedicalChat'
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/config/Colors';

interface MedicalMessage extends IMessage {
  text: string;
  tokens?: number;
}

interface ChatLimits {
  maxMensajes: number;
  maxTokens: number;
  maxInputChars: number;
}

const LIMITES: ChatLimits = {
  maxMensajes: 25,
  maxTokens: 4000,
  maxInputChars: 300,
};

const contarTokens = (text: string): number => Math.ceil(text.length / 2.5);

export default function MedicaAssistant() {  
  const [tokensUsed, setTokensUsed] = useState(0);
  const [inputError, setInputError] = useState('');
  
  const {
    messages,
    loading,
    disclaimerAceptado,
    enviarMensaje,
    aceptarDisclaimer,
    limpiarChat,
  } = useMedicalChat();

  /*const renderActions = () => (
    <View style={styles.actions}>
      <IconButton icon="delete" onPress={limpiarChat} size={24} />
      <IconButton icon="refresh" onPress={() => window.location.reload()} size={24} />
    </View>
  );*/

  const renderActions = () => (
    <View style={styles.actions}>
      <IconButton icon="delete" iconColor={Colors.Violet} onPress={limpiarChat} size={24} />
    </View>
  );

  if (!disclaimerAceptado) {
    return (
      <Modal visible={!disclaimerAceptado} animationType="slide">
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerTitle}>⚠️ AVISO LEGAL</Text>
          <Text style={styles.disclaimerText}>
            Dr. IA es un asistente de{' '}
            <Text style={styles.bold}>INFORMACIÓN GENERAL</Text>
            {'\n\n'}
            ❌ NO diagnostica enfermedades
            {'\n'}
            ❌ NO prescribe medicamentos
            {'\n'}
            ✅ Te ayuda a entender síntomas comunes
            {'\n\n'}
            🚨 EMERGENCIAS: Llama al 911 inmediatamente
          </Text>
          <TouchableOpacity style={styles.btnAceptar} onPress={aceptarDisclaimer}>
            <Text style={styles.btnText}>Acepto y continuar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
    >
      <SafeAreaView style={{ flex: 1, paddingBottom: 32 }}>
        <GiftedChat
          key="medical-chat-main"
          messages={messages}
          alwaysShowSend={true}  // ✅ Send SIEMPRE visible
          onSend={msg => enviarMensaje(msg[0].text)}
          renderSend={(props) => (
            <TouchableOpacity style={styles.sendBtn}>
              <Text style={styles.sendText}>Enviar</Text>
            </TouchableOpacity>
          )}
          user={{ 
            _id: 1,
            name: 'Paciente',
            avatar: '👤', 
          }}
          renderActions={renderActions}
          isTyping={loading}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Text>Dr. IA está pensando...</Text>
            </View>
          )}
          inverted={false}  // ✅ Abajo arriba (estándar chat)
          scrollToBottom={true}  
          keyboardShouldPersistTaps="handled"   
          showUserAvatar={false}
       
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    chatContainer: {
    backgroundColor: '#f5f7fa',
    flex: 1,
  },
  sendText: {
    flex: 1,
    color: Colors.Violet,
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 11,
    paddingRight: 15
  },
  sendBtn: {

  },
  disclaimerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  disclaimerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  btnAceptar: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row'
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});