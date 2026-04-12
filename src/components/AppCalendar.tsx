import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,  
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import axios from 'axios';
import Colors from '@/config/Colors';
import LoadingSpinner from '@/components/LoadingSpinner';
import Routes from '@/config/Routes';
import { useNavigation } from "@react-navigation/native";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import dayjs from 'dayjs';

interface CalendarProps {
  doctorId: string;
  doctorName: string;
}

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  today: "Hoy"
};

LocaleConfig.defaultLocale = 'es';

const AppCalendar = ({ doctorId, doctorName }: CalendarProps) => {
  const navigation = useNavigation();

  const [availableDates, setAvailableDates] = useState<Record<string, string[]>>({});
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingHours, setLoadingHours] = useState<boolean>(false);

  //const hoy = dayjs().format('YYYY-MM-DD');
  const hoy = dayjs().format('YYYY-MM-DD');

  const { appointment, saveAppointment } = useAppointmentStorage();

  // Obtener fechas y horas del doctor específico
  const fetchDoctorAvailableDates = async () => {
    if (!doctorId) {
      Alert.alert('Error', 'ID del doctor requerido');
      return;
    }

    try {
      setLoading(true);
      
      const formData = {
        doctorId: doctorId,
      };

      const response = await axios.post('https://esdecali.com/truedoctor/api/available-dates.php', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      const data = response.data;

      setAvailableDates(data.availableDates);

      // Crear markedDates para el calendario
      const marked: Record<string, any> = {};
      Object.keys(data.availableDates).forEach(date => {
        const hoursCount = data.availableDates[date].length;
        marked[date] = {
          selected: true,
          marked: true,
          selectedColor: hoursCount >= 3 ? Colors.Teal : '#FF9800',
          selectedTextColor: 'white',
          customStyles: {
            container: {
              borderRadius: 10,
            },
          },
        };
      });

      setMarkedDates(marked);
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', `No se pudierón cargar las fechas del ${doctorName || ''}\n${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day: { dateString: any; }) => {
    const dateString = day.dateString;
    const hours = availableDates[dateString];
    
    if (hours && hours.length > 0) {
      setSelectedDate(dateString);
      setSelectedHours(hours);
      setModalVisible(true);
    } else {
      Alert.alert('Info', 'No hay horas disponibles para este día');
    }
  };

  const selectHour = useCallback( async(hour: string) => {
    await saveAppointment({
        selectedDate: selectedDate,
        selectedTime: hour
    });

    setModalVisible(false);

    navigation.navigate(Routes.Patient);
  }, [selectedDate, navigation])

  // Cargar datos cuando cambie el doctorId
  useEffect(() => {
    if (doctorId) {
      fetchDoctorAvailableDates();
    }
  }, [doctorId]);

  const renderHourItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.hourItem}
      onPress={() => selectHour(item)}
      activeOpacity={0.7}
    >
      <Text style={[styles.hourText]}>{item}</Text>
    </TouchableOpacity>
  );

  const calendarTheme = {
    // 🌟 TEXTOS PRINCIPALES
    textDayFontSize: 16,        // Día (15, 16, etc.)
    textMonthFontSize: 21,      // MES (Enero)
    textDayHeaderFontSize: 15,  // Encabezados días (Lun, Mar...)
    
    // 🌟 COLORES Y FONDO
    backgroundColor: Colors.White,
    calendarBackground: Colors.White,
    textSectionTitleColor: Colors.Teal,
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: Colors.Teal,
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#FF6B6B',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: Colors.Teal,
    selectedDotColor: '#ffffff',
    arrowColor: Colors.Teal,
    disabledArrowColor: '#d9e1e8',
    monthTextColor: Colors.Teal,
    indicatorColor: Colors.Red,
    textDayFontWeight: 500 as const,
    textMonthFontWeight: 700 as const,
    textDayHeaderFontWeight: 600 as const,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message={'Cargando Agenda...'} />        
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}        
        theme={calendarTheme}
        enableSwipeMonths={true}
        minDate={hoy}
      />

      {/* Modal de horas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {dayjs(selectedDate).format('dddd, DD [de] MMMM [del] YYYY')}
            </Text>            
            <Text style={styles.modalSubtitle}>
              <Text style={{ fontWeight: '700' }}>{selectedHours.length}</Text> consultas disponibles              
            </Text>
            <Text style={{ color: Colors.Gray400, marginBottom: 10 }}>Selecciona la hora de la consulta</Text>

            <FlatList
              data={selectedHours}
              renderItem={renderHourItem}
              keyExtractor={(item) => item}
              horizontal={true}           // ← HORIZONTAL
              showsHorizontalScrollIndicator={true}              
              scrollIndicatorInsets={{ right: 20 }} // ← Indicador un poco más adentro
              contentContainerStyle={styles.horizontalHoursList}
              snapToInterval={110}        // ← Snap suave entre items
              decelerationRate="fast"     // ← Scroll rápido
              bounces={true}
              overScrollMode="never"
              getItemLayout={(data, index) => ({
                length: 100,
                offset: 110 * index,
                index,
              })}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <Text onPress={fetchDoctorAvailableDates} style={{ fontSize: 15, color: Colors.Violet, textDecorationLine: 'underline' }}>Actualizar agenda</Text>
      </View>
    </View>
  );
};

export default AppCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 10,
    color: '#666',
  },
  hoursList: {
    paddingBottom: 20,
  },
  closeButton: {
    marginTop: 40,
    backgroundColor: Colors.Violet,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  refreshButton: {
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
    paddingBottom: 5
  },
  horizontalHoursList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxHeight: 80, // Altura fija para mejor UX
  },
  hourItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,    
    minHeight: 60,
    paddingTop: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    minWidth: 70,
    alignItems: 'center',
    marginRight: 17,
  },
  hourText: {    
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
  },
  
  // Modal más compacto para horizontal
  modalContent: {
    backgroundColor: 'white',    
    padding: 20,
    width: '95%',
    elevation: 15,    
  },
});
