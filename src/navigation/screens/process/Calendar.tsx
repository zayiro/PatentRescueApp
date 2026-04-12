import AppCalendar from "@/components/AppCalendar";
import Colors from "@/config/Colors";
import Routes from "@/config/Routes";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StatusBar, View, StyleSheet, Platform } from "react-native";
import { Text, Divider } from 'react-native-paper';

export default function Calendar() {
    const navigation = useNavigation();

    const { appointment } = useAppointmentStorage();
      
    const doctorId = appointment?.doctorId;
    const doctorName = appointment?.doctorName;
    const specialtyName = appointment?.specialty.name;
    const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
    const address = appointment?.address || null;

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);    
      
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e) => {
            setSelectedDate(appointment?.selectedDate || '');
        });

    return () => unsubscribe();
  }, [navigation, appointment]); 

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
                <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>
                        {consultationType == 1 ? 'Telemedicina' : 'Consulta Presencial' }
                    </Text>                    
                    <Text>{specialtyName || ''}</Text>                    
                </View>

                <Divider />

                <View style={{ marginTop: 20 }}>                    
                    <Text variant="titleMedium" style={{ fontWeight: '700' }}>{doctorName}</Text>
                    {consultationType == 2 && (
                        <Text>{address ? address.name + ' ' + address.location : ''}</Text>
                    )}
                    <Text style={{ fontSize:13, marginTop: 5, marginBottom: 20, color: Colors.Gray400 }}>Selecciona la fecha y hora que prefieras para tu cita. Si no ves la fecha que deseas, intenta actualizar la agenda.</Text>

                    <AppCalendar
                        doctorId={doctorId || ''}
                        doctorName={doctorName || ''}
                    />
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
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12, // 📱 Android
  }, 
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 15,
    marginBottom: 24,
  },
});