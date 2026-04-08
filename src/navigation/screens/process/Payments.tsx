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

export default function Payments() {
    const navigation = useNavigation();
    const { user } = useAuth();

    const route = useRoute<RouteProp<{ Detail: Props }, 'Detail'>>();
    const { appointmentId } = route.params;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<any>(null);
   
    const handleSubmit = useCallback(async () => {               
      navigation.navigate(Routes.payment);    
  }, [navigation]);

  const getAppointmentDetails = useCallback( async(appointmentId: string) => {
    setLoading(true)
    const result: any = await getAppoinments(appointmentId)
    setAppointment(result);
    setLoading(false)
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
          {loading ? (
            <>            
              <View>
                <LoadingSpinner message="Cargando..." />
              </View>
            </>
          )
          :
          (
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.Title, textAlign: 'center', marginTop: 30 }}>Pagos</Text>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>appointmentId: {appointmentId}</Text>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>Valor: {formatCOP(appointment.specialtyAmount)} COP</Text>
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