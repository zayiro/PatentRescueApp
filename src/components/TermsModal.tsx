import Colors from '@/config/Colors';
import React, { useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Checkbox, Button } from 'react-native-paper';

interface TermsModalProps {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function TermsModal({ visible, onAccept, onClose }: TermsModalProps) {
  const [checked, setChecked] = useState(false);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        {/* 🔹 Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Términos y Condiciones</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
        
        {/* 🔹 Contenido Scrollable */}
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>1. Aceptación</Text>
          <Text style={styles.paragraph}>
            Al usar nuestro servicio de reservas, aceptas estos términos. <Text style={{ fontWeight: '700' }}>Si no estás de acuerdo, no uses la plataforma.</Text> Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios importantes.
          </Text>
          
          <Text style={styles.sectionTitle}>2. Citas</Text>
          <Text style={styles.paragraph}>
            No hay reembolsos por no-shows. Puedes cancelar o reprogramar hasta 24 horas antes.
          </Text>
          
          <Text style={styles.sectionTitle}>3. Pagos</Text>
          <Text style={styles.paragraph}>
            El pago se realiza al reservar. Aceptamos tarjetas de crédito y débito. Los precios pueden cambiar, pero te notificaremos antes de cobrar.
            El doctor o clinica es el responsable de establecer el valor del servicio prestado.
          </Text>
          
          {/* Más secciones... */}
        </ScrollView>
        
        {/* 🔹 Checkbox + Botones */}
        <View style={styles.footer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              color="#007AFF"
            />
            <Text style={styles.checkboxText}>
              He leído y acepto los Términos y Condiciones
            </Text>
          </View>
          
          <Button
            mode="contained"
            onPress={onAccept}
            disabled={!checked}
            style={styles.acceptBtn}
          >
            Aceptar
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.Violet,
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 22,
    color: '#4B5563',
    marginBottom: 7,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 40,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginLeft: 12,
  },
  acceptBtn: {
    marginTop: 10,
    paddingVertical: 8,
  },
});