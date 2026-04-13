import LoadingSpinner from "@/components/LoadingSpinner";
import Colors from "@/config/Colors";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useAuth } from "@/hooks/useAuth";
import { getAppoinments, updateDocumentCollection } from "@/service/firestore";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View, StyleSheet, Alert } from "react-native";
import { Text, Divider, Button } from "react-native-paper";
import axios from 'axios';
import { NameCollection } from "@/enums/NameCollection";
import dayjs from "@/utils/dayjs";
import Routes from "@/config/Routes";
import { useRoute } from '@react-navigation/native';
import { ConsultationTypes } from "@/enums/ConsultationTypes";

export default function ThankYouPage() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const route = useRoute();
  const { appointmentId } = (route.params as { appointmentId: string }) || {};

  const { appointment, clearAppointment } = useAppointmentStorage();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  
  const getAppointmentDetails = useCallback( async(appointmentId: string) => {
    setLoading(true);

    try {
      const result: any = await getAppoinments(appointmentId)
      
      if (result) {
        setAppointmentData(result);
        const isPay = 'Confirmed'; //si el pago salio confirmado, cambiar por el resultado del response del gateway de pagos
        
        if (result.link == '' && result.consultationType == ConsultationTypes.Telemedicine && isPay == 'Confirmed') {
          onGenerateLink(result, appointmentId);          
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los detalles de la cita. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appointmentId) {
      getAppointmentDetails(appointmentId);
    }

    if (appointment) {
      clearAppointment();
    }    
  }, [appointmentId]);

  const onGenerateLink = useCallback( async(result: any, appointmentId: string) => {   
    setLoading(true);       
    try {
      const formData = {
        nombreSala: appointmentId,
        nombreUsuario: result.name,
        fechaHora: result.selectedDate+""+result.selectedTime,
      };

      const response = await axios.post('https://esdecali.com/truedoctor/create-link.php', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      let data = {
        link: response.data.link,
        expira: response.data.expira,
        reponseVideo: response.data
      }
  
      if (response.data.success) {       
        await updateDocumentCollection(NameCollection.Appointments, appointmentId, data)                
        Alert.alert('✅', 'Link generado correctamente');
      } else {
        Alert.alert('Error', response.data.error || 'Error desconocido');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        String(error)
      );
    } finally {
      setLoading(false);
    }
  }, [])

  if (loading) return (<LoadingSpinner message='Confirmando cita...' />);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {appointmentData && (
            <>
              <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>
                    {appointmentData.consultationType === ConsultationTypes.Telemedicine ? 'Telemedicina' : 'Consulta Presencial' }
                  </Text>
                  <Text style={{ fontWeight: '700' }}>{appointmentData.doctorName || ''}</Text>
                  <Text>{appointmentData.specialty.name || ''}</Text>
                  {appointmentData.address && appointmentData.consultationType === ConsultationTypes.MedicalConsultation ? (
                    <Text style={{ marginTop: 5 }}>{appointmentData.address ? appointmentData.address.name + ' ' + appointmentData.address.location : ''}</Text>
                  ): null}
                  <Text>{dayjs(appointmentData.selectedDate).locale('es').format('dddd, DD [de] MMMM [del] YYYY')}</Text>
                  <Text>Hora: {appointmentData.selectedTime}</Text>     
              </View>

              <Divider /> 

              <View style={{ marginTop: 20, marginBottom: 40 }}>
                <Text variant="titleMedium" style={{ marginBottom: 20, color: Colors.Title }}>¡Gracias por reservar tu cita con nosotros!</Text>
                {appointmentData.consultationType == ConsultationTypes.Telemedicine ? (
                  <>
                  <Text variant="bodyMedium" style={{ marginBottom: 10 }}>Para ingresar a la video conferencia, ingrese a la sección <Text style={{ fontWeight: '700' }}>citas programadas</Text> y haga click en el enlace "Entrar a la video conferencia".</Text>
                  <Text style={{ marginBottom: 10 }}>Recuerde conectarse 15 minutos antes de la hora programada, para validar el video y el audio.</Text>
                  <Text>La conferencia se activará solo a la hora definida en la cita. ({appointmentData.selectedTime})</Text>
                  </>                  
                ) : (
                  <Text variant="bodyMedium" style={{ marginBottom: 10 }}>Recuerde asistir a la dirección del consultorio, 15 minutos antes de la hora programada.</Text>
                )}                              
              </View>

              <Button icon="message-video" mode="contained" onPress={() => navigation.navigate(Routes.Appointments)} style={[styles.button]}>
                <Text style={{ fontSize: 20, color: '#fff', lineHeight: 30 }}>Citas Programadas</Text>
              </Button> 
            </>
          )}                 
        </ScrollView>
      </KeyboardAvoidingView>    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: '#FFF',
  },
  button: {
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12, // 📱 Android
  }, 
  textArea: {
    minHeight: 120,
    height: 100, // Altura fija para forzar el área de texto
    textAlignVertical: 'top', // Alinea el texto al inicio en Android
  },
  checkbox: {
    paddingVertical: 0,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    lineHeight: 20,
  },
});