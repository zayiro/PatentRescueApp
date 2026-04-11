import AppCalendar from "@/components/AppCalendar";
import Colors from "@/config/Colors";
import Routes from "@/config/Routes";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import dayjs from "dayjs";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StatusBar, View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Text, Button, Divider } from 'react-native-paper';

export default function Calendar() {
    const navigation = useNavigation();

    const { appointment, saveAppointment } = useAppointmentStorage();
    
    const doctorId = appointment?.doctorId;
    const doctorName = appointment?.doctorName;
    const specialtyName = appointment?.specialty.name;

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);    
  
    const handleSlotSelect = useCallback(async () => {    
        await saveAppointment({
            selectedDate: selectedDate,
        });
        
        navigation.navigate(Routes.AppointmentHour);
    }, [saveAppointment, navigation, selectedDate]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

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
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>Telemedicina</Text>
                    <Text>{specialtyName || ''}</Text>                    
                </View>

                <Divider />

                <View style={{ marginTop: 30 }}>
                    <Text variant="titleMedium" style={{ fontWeight: '700' }}>{doctorName}</Text>
                    <Text style={{ marginBottom: 20 }}>Selecciona la fecha y hora disponible</Text>                  

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