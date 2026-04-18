import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { useMedicalChat } from '@/hooks/useMedicalChat'
import { SafeAreaView } from 'react-native-safe-area-context';


export default function MedicaAssistant() {
  const {
    messages,
    loading,
    disclaimerAceptado,
    enviarMensaje,
    aceptarDisclaimer,
    limpiarChat,
  } = useMedicalChat();

  const renderActions = () => (
    <View style={styles.actions}>
      <IconButton icon="delete" onPress={limpiarChat} size={24} />
      <IconButton icon="refresh" onPress={() => window.location.reload()} size={24} />
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
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={msg => enviarMensaje(msg[0].text)}
        user={{ _id: 1 }}
        renderActions={renderActions}
        isTyping={loading}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text>Dr. IA está pensando...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    chatContainer: {
    backgroundColor: '#f5f7fa',
    flex: 1,
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
    flexDirection: 'row',
    padding: 10,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});