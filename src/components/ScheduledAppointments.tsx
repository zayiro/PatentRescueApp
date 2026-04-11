import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/LoadingSpinner';
import Colors from '@/config/Colors';
import { Button, Divider } from 'react-native-paper';

interface Cita {
  id: string;
  doctor: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: string;
  ubicacion: string;
  doctorImage?: string;
}

interface DetalleCitaProps {
  cita: Cita;
  cerrarModal: () => void;
}

const ScheduledAppointments = ({ patientId }: any) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular datos (reemplaza con tu API)
  const cargarCitas = async () => {
    setLoading(true);
    try {
      // const response = await fetch(`https://tu-api.com/patients/${patientId}/appointments`);
      // const data = await response.json();
      
      // Datos de prueba
      const datosPrueba = [
        {
          id: '1',
          doctor: 'Dr. Juan Pérez',
          especialidad: 'Cardiólogo',
          fecha: '2024-01-20',
          hora: '10:00',
          estado: 'confirmada',
          ubicacion: 'Clínica Central',
          doctorImage: 'https://via.placeholder.com/80/4CAF50/FFFFFF?text=JP',
        },
        {
          id: '2',
          doctor: 'Dra. María Gómez',
          especialidad: 'Pediatra',
          fecha: '2024-01-25',
          hora: '15:30',
          estado: 'pendiente',
          ubicacion: 'Hospital Infantil',
          doctorImage: 'https://via.placeholder.com/80/4CAF50/FFFFFF?text=MG',
        },
        {
          id: '3',
          doctor: 'Dr. Carlos López',
          especialidad: 'Dermatologo',
          fecha: '2024-02-01',
          hora: '14:00',
          estado: 'cancelada',
          ubicacion: 'Centro Dermatológico',
          doctorImage: 'https://via.placeholder.com/80/4CAF50/FFFFFF?text=CL',
        },
      ];
      
      setCitas(datosPrueba);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [patientId]);

  const cancelarCita = (citaId: any) => {
    Alert.alert(
      'Cancelar cita',
      '¿Estás seguro de cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              // await fetch(`https://tu-api.com/appointments/${citaId}/cancel`, { method: 'POST' });
              setCitas(citas.filter(cita => cita.id !== citaId));
              Alert.alert('Cancelada', 'Cita cancelada exitosamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cancelar');
            }
          },
        },
      ]
    );
  };

  const renderCita = ({ item }: { item: any }) => {
    const fechaFormateada = dayjs(item.fecha).format('DD/MM/YYYY');
    const esProxima = dayjs(item.fecha).isAfter(dayjs(), 'day');
    
    return (
      <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, marginBottom: 16, backgroundColor: 'white' }}>
        <View style={{ padding: 16 }}>
            <View style={styles.citaHeader}>
            <View style={[styles.iconoEstado, { backgroundColor: getColorEstado(item.estado) }]}>
                <Ionicons 
                name={getIconoEstado(item.estado)} 
                size={20} 
                color="white" 
                />
            </View>
            <Text style={styles.estadoTexto}>{item.estado.toUpperCase()}</Text>
            </View>

            <View style={styles.citaInfo}>
            <Text style={styles.doctorNombre}>{item.doctor}</Text>
            <Text style={styles.especialidad}>{item.especialidad}</Text>
            <View style={styles.fechaHora}>
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text style={styles.fechaTexto}>{fechaFormateada} - {item.hora}</Text>
            </View>
            <Text style={styles.ubicacion}>{item.ubicacion}</Text>
            </View>

            {esProxima && (
            <TouchableOpacity 
                style={styles.botonCancelar} 
                onPress={() => cancelarCita(item.id)}
            >
                <Ionicons name="close-circle" size={20} color="#ef4444" />
                <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            )}

            <View style={{ marginTop: 12, marginBottom: 20 }}>
                <Text style={{ textDecorationLine: 'underline', color: Colors.link }}>Ingresar a la conferencia</Text>
            </View>
        </View>

        <Divider />

        <View style={{ marginVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
            <Button icon="cart-check" mode="contained" onPress={() => Alert.alert('Pago', 'Funcionalidad de pago en desarrollo')}>
                Pagar
            </Button>
            <Button icon="cart-check" mode="contained" onPress={() => Alert.alert('Cancelar', 'Funcionalidad de cancelación en desarrollo')}>
                Cancelar
            </Button>
        </View>
      </View>
    );
  };

  const getColorEstado = (estado: any) => {
    switch (estado) {
      case 'confirmada': return '#10b981';
      case 'pendiente': return '#f59e0b';
      case 'cancelada': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getIconoEstado = (estado: any) => {
    switch (estado) {
      case 'confirmada': return 'checkmark-circle';
      case 'pendiente': return 'time-outline';
      case 'cancelada': return 'close-circle';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return (
      <LoadingSpinner message="Cargando..." />
    );
  }

  return (
    <View style={styles.container}>      
      <FlatList
        data={citas}
        renderItem={renderCita}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 2 }}
        contentContainerStyle={styles.listaContenido}
        ListEmptyComponent={
          <View style={styles.vacioContainer}>
            <Ionicons name="calendar-outline" size={60} color="#d1d5db" />
            <Text style={styles.vacioTexto}>No tienes citas programadas</Text>
            <Text style={styles.vacioSubtexto}>Programa tu primera cita</Text>
          </View>
        }
      />
    </View>
  );
};

export default ScheduledAppointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  citaInfo: {
    flex: 1,                    // Ocupa espacio disponible
    marginLeft: 12,             // Espacio desde icono estado
},
    vacioSubtexto: {
  fontSize: 16,
  color: '#9ca3af',
  textAlign: 'center',
  lineHeight: 24,
  fontWeight: '400',
  marginBottom: 32,
},
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 25,
    textAlign: 'center',
  },
  citaCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  citaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconoEstado: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  doctorNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  especialidad: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  fechaHora: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fechaTexto: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  ubicacion: {
    fontSize: 14,
    color: '#9ca3af',
  },
  botonCancelar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  textoCancelar: {
    marginLeft: 6,
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  listaContenido: {
    paddingBottom: 100,
  },
  vacioContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  vacioTexto: {
    fontSize: 20,
    color: '#6b7280',
    marginTop: 16,
  },
  //detalle cita
  modalOverlayDetalle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Container principal
  modalContainerDetalle: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 15,
  },
  
  // Botón cerrar
  botonCerrar: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header estado
  detalleHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconoEstadoGrande: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  estadoGrande: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Doctor section
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  fotoDoctor: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#10b981',
  },
  doctorInfoDetalle: {
    flex: 1,
  },
  nombreDoctor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  especialidadDoctor: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingDoctor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingTexto: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
  
  // Fecha section
  fechaSection: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTextoContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  // Ubicación
  ubicacionSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
  },
  ubicacionTexto: {
    marginLeft: 16,
    flex: 1,
  },
  ubicacionValor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 4,
  },
  
  // Botones acción
  botonesSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  botonRecordatorio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  botonReprogramar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  botonTexto: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});