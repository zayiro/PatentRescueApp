import LoadingSpinner from "@/components/LoadingSpinner";
import TermsModal from "@/components/TermsModal";
import Colors from "@/config/Colors";
import Routes from "@/config/Routes";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useAuth } from "@/hooks/useAuth";
import { getAppoinments } from "@/service/firestore";
import dayjs from "@/utils/dayjs";
import { formatDate } from "@/utils/formatDateTime";
import { formatCOP } from "@/utils/priceUtils";
import { DrawerActions, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Button, TextInput, Text, Divider, Checkbox, IconButton } from "react-native-paper";

interface Props {
    appointmentId: string;
}

export default function Summary() {
    const navigation = useNavigation();
    const { user } = useAuth();

    const route = useRoute<RouteProp<{ Detail: Props }, 'Detail'>>();
    const { appointmentId } = route.params;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<any>(null);
   
    const handleSubmit = useCallback(async () => {               
      navigation.navigate(Routes.Payments, { appointmentId }); 
  }, [navigation]);

  const getAppointmentDetails = useCallback( async(appointmentId: string) => {
    const result: any = await getAppoinments(appointmentId)
    setAppointment(result);
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
          {appointment ? (
            <>            
              <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>Telemedicina</Text>
                  <Text>{appointment.name}</Text>
                  <Text>{formatDate(appointment.selectedDate)}</Text>
                  <Text>{appointment.selectedTime}</Text>
              </View>

              <Divider /> 

              <View style={{ marginTop: 40 }}>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>El valor de la consulta por especialidad es de {formatCOP(appointment.specialtyAmount)} COP</Text>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Despues de confirmado el pago, te llegara un correo con el enlace a la conferencia.</Text>
                <Text variant="bodyMedium" style={{ marginBottom: 20 }}>Tambien podras ver el enlace en la sección mis citas activas</Text>
                <Button icon="calendar" mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={[styles.button]}>
                  <Text style={{ fontSize: 20, color: '#fff', paddingVertical: 5 }}>{loading ? 'Validando...' : 'Pagar'}</Text>
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
    paddingHorizontal: 24,
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