import LoadingSpinner from "@/components/LoadingSpinner";
import Colors from "@/config/Colors";
import Routes from "@/config/Routes";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useAuth } from "@/hooks/useAuth";
import { getAppoinments } from "@/service/firestore";
import { formatCOP } from "@/utils/priceUtils";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, Divider } from "react-native-paper";
import dayjs from "@/utils/dayjs";
import { ConsultationTypes } from "@/enums/ConsultationTypes";

export default function Summary() {
    const navigation = useNavigation();
    const { user } = useAuth();

    const { appointment } = useAppointmentStorage();

    const appointmentId = appointment?.appointmentId || '';
    const specialtyName = appointment?.specialty.name;
    const selectedDate = appointment?.selectedDate;
    const selectedTime = appointment?.selectedTime;
    const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
    const address = appointment?.address || null;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [appointmentData, setAppointmentData] = useState<any>(null);
   
    const handleSubmit = useCallback(async () => {               
      navigation.navigate(Routes.ThankYouPage, { appointmentId: appointmentId }); 
    }, [appointmentId, navigation]);

  const getAppointmentDetails = useCallback( async(appointmentId: string) => {
    const result: any = await getAppoinments(appointmentId)    
    setAppointmentData(result);
  }, []);

  useEffect(() => {
    getAppointmentDetails(appointmentId);    
  }, [appointmentId]);

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
          <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>
                {consultationType === ConsultationTypes.Telemedicine ? 'Telemedicina' : 'Consulta Presencial' }
              </Text>
              <Text style={{ fontWeight: '700' }}>{appointment?.doctorName || ''}</Text>
              <Text>{specialtyName || ''}</Text>
              {address && consultationType === ConsultationTypes.MedicalConsultation ? (
                <Text style={{ marginTop: 5 }}>{address.name + ' ' + address.location}</Text>
              ): null}
              <Text>{dayjs(selectedDate).locale('es').format('dddd, DD [de] MMMM [del] YYYY')}</Text>
              <Text>Hora: {selectedTime}</Text>             
          </View>

          <Divider /> 

          <View style={{ marginTop: 40 }}>
            <Text style={{ fontWeight: '700', fontSize: 28, color: Colors.Title }}>Servico seleccionado</Text>
            <Text>{appointmentData?.service.name}</Text>
            <Text variant="bodyMedium" style={{ marginBottom: 20 }}><Text style={{ fontWeight: '700' }}>{formatCOP(appointmentData?.service.price)} COP</Text></Text>
            {consultationType === ConsultationTypes.Telemedicine && (
              <>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Confirmado el pago, se generara el link de la video llamada.</Text>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Lo puedes ver en la sección citas programadas</Text>              
              </>
            )}
            
            <Button icon="check" mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={[styles.button]}>
              <Text style={{ fontSize: 20, color: '#fff', lineHeight: 30 }}>{loading ? 'Validando...' : 'Confirmar cita'}</Text>
            </Button>            
          </View>          
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
    marginTop: 30,
    paddingVertical: 10,
    shadowColor: '#000',
    borderRadius: 12,
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