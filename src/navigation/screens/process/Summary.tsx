import LoadingSpinner from "@/components/LoadingSpinner";
import Colors from "@/config/Colors";
import Routes from "@/config/Routes";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useAuth } from "@/hooks/useAuth";
import { getAppoinments } from "@/service/firestore";
import { formatDate } from "@/utils/formatDateTime";
import { formatCOP } from "@/utils/priceUtils";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, View, StyleSheet } from "react-native";
import { Button, Text, Divider } from "react-native-paper";

export default function Summary() {
    const navigation = useNavigation();
    const { user } = useAuth();

    const { appointment } = useAppointmentStorage();

    const appointmentId = appointment?.appointmentId || '';
    
    const [loading, setLoading] = useState<boolean>(false);
    const [appointmentData, setAppointmentData] = useState<any>(null);

    const [generateLink, setGenerateLink] = useState<string>('');
    const [expirationDate, setExpirationDate] = useState<string>('');
   
    const handleSubmit = useCallback(async () => {               
      navigation.navigate(Routes.ThankYouPage); 
    }, [navigation]);

  const getAppointmentDetails = useCallback( async(appointmentId: string) => {
    const result: any = await getAppoinments(appointmentId)    
    setAppointmentData(result);
  }, []);

  useEffect(() => {
    getAppointmentDetails(appointmentId);    
  }, [appointmentId]);

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
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>Telemedicina</Text>
                  <Text>{appointmentData.name}</Text>
                  <Text>{formatDate(appointmentData.selectedDate)}</Text>
                  <Text>{appointmentData.selectedTime}</Text>                  
              </View>

              <Divider /> 

              <View style={{ marginTop: 40 }}>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>El valor de la consulta por especialidad es de {formatCOP(appointmentData.specialtyAmount)} COP</Text>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Confirmado el pago, se generara el link de la video llamada.</Text>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Lo puedes ver en la sección citas programadas</Text>
                <Button icon="calendar" mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={[styles.button]}>
                  <Text style={{ fontSize: 20, color: '#fff', lineHeight: 30 }}>{loading ? 'Validando...' : 'Pagar'}</Text>
                </Button>
              </View>
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