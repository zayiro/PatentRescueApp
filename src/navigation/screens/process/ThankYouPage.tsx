import LoadingSpinner from "@/components/LoadingSpinner";
import Colors from "@/config/Colors";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useAuth } from "@/hooks/useAuth";
import { getAppoinments, updateDocumentCollection } from "@/service/firestore";
import { formatDate } from "@/utils/formatDateTime";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View, StyleSheet, Alert, Linking } from "react-native";
import { Text, Divider, Button } from "react-native-paper";
import axios from 'axios';
import { NameCollection } from "@/enums/NameCollection";
import dayjs from "@/utils/dayjs";
import Routes from "@/config/Routes";

export default function ThankYouPage() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const { appointment } = useAppointmentStorage();

  const appointmentId = appointment?.appointmentId || '';
  const specialtyId = appointment?.specialty.id;
  const specialtyName = appointment?.specialty.name;
  const selectedDate = appointment?.selectedDate;
  const selectedTime = appointment?.selectedTime;
  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
  
  const [loading, setLoading] = useState<boolean>(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const [generateLink, setGenerateLink] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  
  const getAppointmentDetails = useCallback( async(appointmentId: string) => {
    const result: any = await getAppoinments(appointmentId)
     
    if (result) {
      setAppointmentData(result);
      const isPay = 'Confirmed'; //si el pago salio confirmado, cambiar por el resultado del response del gateway de pagos
      
      if (result.link == '' && isPay == 'Confirmed') {
        onGenerateLink(result, appointmentId);
      }
    }
  }, []);

  useEffect(() => {
    if (appointmentId) {
      getAppointmentDetails(appointmentId);
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
        
        setGenerateLink(response.data.link);
        setExpirationDate(response.data.expira);
        
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

  const abrirLinkLlamada = async () => {
    if (!generateLink) {
      Alert.alert('Error', 'Genera un link primero');
      return;
    }

    try {
      // Verificar si puede abrir URL
      const supported = await Linking.canOpenURL(generateLink);
      
      if (supported) {
        // Abrir en navegador del dispositivo
        await Linking.openURL(generateLink);
        Alert.alert('✅', '¡Link abierto! Únete a la llamada en tu navegador');
      } else {
        Alert.alert('Error', 'No se puede abrir el navegador');
      }
    } catch (error) {
      console.error('Error abrir link:', error);
      Alert.alert('Error', 'No se pudo abrir el link');
    }
  };

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
          {appointmentData ? (
            <>            
              <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>
                    {consultationType == 1 ? 'Telemedicina' : 'Consulta Presencial' }
                  </Text>
                  <Text style={{ fontWeight: '700' }}>{appointment?.doctorName || ''}</Text>
                  <Text>{specialtyName || ''}</Text>              
                  <Text style={{ marginTop: 5 }}>{dayjs(selectedDate).locale('es').format('dddd, DD [de] MMMM [del] YYYY')}</Text>
                  <Text>Hora: {selectedTime}</Text>   
              </View>

              <Divider /> 

              <View style={{ marginTop: 40, marginBottom: 40 }}>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>La consulta esta pagada y confirmada!</Text>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Para ingresar a la video conferencia, ingrese a la sección citas programadas y haga click en el enlace "Entrar a la video conferencia".</Text>
                <Text>Recuerde conectarse 15 minutos antes de la hora programada, para validar el video y el audio.</Text>
                <Text>La conferencia se activará solo a la hora definida en la cita. ({appointmentData.selectedTime})</Text>
              </View>

              <Button icon="message-video" mode="contained" onPress={() => navigation.navigate(Routes.Appointments)} style={[styles.button]}>
                <Text style={{ fontSize: 20, color: '#fff', lineHeight: 30 }}>Citas Programadas</Text>
              </Button>
            </>
          )
          :
          (
            <View>
              <LoadingSpinner message="Cargando..." />
            </View>
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
    paddingVertical: 50,
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