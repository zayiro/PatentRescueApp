import TermsModal from "@/components/TermsModal";
import Colors from "@/config/Colors";
import Routes from "@/config/Routes";
import { NameCollection } from "@/enums/NameCollection";
import { useAppointmentStorage } from "@/hooks/useAppointmentStorage";
import { useAuth } from "@/hooks/useAuth";
import { createDocument, getUserData } from "@/service/firestore";
import dayjs from "@/utils/dayjs";
import { useNavigation } from "@react-navigation/native";
import { serverTimestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Button, TextInput, Text, Divider, Checkbox, RadioButton } from "react-native-paper";
import uuid from 'react-native-uuid'
import { formatDateTime } from '@/utils/formatDateTime';

export default function Patient() {
    const navigation = useNavigation();
    const { user } = useAuth();
    
    const { appointment, saveAppointment, clearAppointment } = useAppointmentStorage();

    const specialtyId = appointment?.specialty.id;
    const specialtyName = appointment?.specialty.name;
    const selectedDate = appointment?.selectedDate;
    const selectedTime = appointment?.selectedTime;

    const [value, setValue] = useState<string>('first');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

     // 🔹 Crear Date
  const getDate = (): Date | null => {
    const d = parseInt(day);
    const m = parseInt(month) - 1;  // Mes 0-index
    const y = parseInt(year);
    
    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 0 || m > 11) {
      return null;
    }
    
    const date = new Date(y, m, d);
    return date.getDate() === d && date.getMonth() === m && date.getFullYear() === y 
      ? date 
      : null;
  };

  const date = getDate();
  const isValid = date && date <= new Date();

    const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
        
    const handleTermsAccept = () => {
      setTermsAccepted(true);
      setShowTermsModal(false);
    };

    const handleSubmit = useCallback(async () => {
      if (!termsAccepted) {
        Alert.alert('Error', 'Debes aceptar términos y condiciones');
        return false;
      }

      if (!firstName.length) {
        Alert.alert("Error", "El nombre es obligatorio.")
        
        return false;
      }

      if (!description.length) {
        Alert.alert("Error", "La descripción es obligatoria.")        
        return false;
      }

      let createdAt: any = serverTimestamp(); 

      // 🔹 Guardar datos paciente
      await saveAppointment({ 
          patientData: {
              name: firstName.trim(),
              userId: user?.uid || '',
              description: description.trim(),
          },
          status: 'completed',
          createdAt: formatDateTime(new Date(), undefined, 'YYYY-MM-DDTHH:mm:ssZ')
      });

      let appointmentId = uuid.v4().toString();

      let data = {
        id: appointmentId,
        creationDate: appointment?.createdAt,
        userId: appointment?.patientData.userId,
        name: appointment?.patientData.name,
        description: appointment?.patientData.description,
        specialtyId: appointment?.specialty?.id,
        specialtyName: appointment?.specialty?.name,
        specialtyAmount: appointment?.specialty?.amount,
        selectedDate: appointment?.selectedDate,
        selectedTime: appointment?.selectedTime,
        createdAt,
      }

      createDocument(NameCollection.Appointments, appointmentId, data);
      console.log("Appointment saved with ID:", appointmentId, "Data:", data);

      //await clearAppointment();

      navigation.navigate(Routes.Summary, { appointmentId });    
  }, [saveAppointment, navigation, firstName, description, user, termsAccepted]);

  const onUserData = useCallback( async(userId: string) => {
      const result: any = await getUserData(userId)
      console.log(result);
      setFirstName(result.firstName || '');      
      setLastName(result.lastName || '');      
    }, [firstName]);  
  
    useEffect(() => {
      if (user) {
        onUserData(user?.uid);
      }
    }, [user]);

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
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>Telemedicina</Text>
              <Text>{specialtyName || ''}</Text>
              <Text>{dayjs(selectedDate).locale('es').format('DD [de] MMMM [de] YYYY')}, a las {selectedTime}</Text>
          </View>

          <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate(Routes.Specialties)}>
              <Text style={{ color: Colors.link, textDecorationLine: 'underline' }}>Cambiar datos</Text>
              </TouchableOpacity>
          </View>

          <Divider />

          <View style={{ alignItems: 'flex-start', marginTop: 30, marginBottom: 20 }}>
            <Text variant="headlineSmall">¿Para quién es la cita?</Text>
          </View>

          <View style={{ marginBottom: 10 }}>            
            <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>                
                <RadioButton value="first" />
                <Text style={{ paddingTop: 5 }}>{ firstName } { lastName}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>                
                <RadioButton value="second" />
                <Text style={{ paddingTop: 5 }}>Para otra persona</Text>
              </View>
            </RadioButton.Group>
          </View>

          <View style={{ marginTop: 30 }}>
            <TextInput
              label="Nombre del paciente"        
              onChangeText={setFirstName}
              value={firstName}
              right={<TextInput.Icon icon="account" color={Colors.iconInput} />}
              mode="outlined"
            />
          </View>

          <View style={{ marginTop: 30 }}>
            <TextInput
              label="Apellido del paciente"        
              onChangeText={setFirstName}
              value={lastName}
              right={<TextInput.Icon icon="account" color={Colors.iconInput} />}
              mode="outlined"
            />
          </View>

          <View>
            <Text style={{ marginTop: 30 }}>Fecha de Nacimiento</Text>
          </View>
          <View style={styles.dateRow}>
            
            {/* 🔹 Día */}
            <TextInput
              style={styles.input}
              label="Día"
              value={day}
              onChangeText={(text) => {
                setDay(text.replace(/\D/g, '').slice(0, 2));
              }}
              keyboardType="numeric"
              maxLength={2}
              mode="outlined"
            />
            
            {/* 🔹 Mes */}
            <TextInput
              style={styles.input}
              label="Mes"
              value={month}
              onChangeText={(text) => {
                setMonth(text.replace(/\D/g, '').slice(0, 2));
              }}
              keyboardType="numeric"
              maxLength={2}
              mode="outlined"
            />
            
            {/* 🔹 Año */}
            <TextInput
              style={styles.input}
              label="Año"
              value={year}
              onChangeText={(text) => {
                setYear(text.replace(/\D/g, '').slice(0, 4));
              }}
              keyboardType="numeric"
              maxLength={4}
              mode="outlined"
            />
          </View>
          
          <View style={{ marginTop: 25 }}>
            <TextInput
              label="Cuéntanos el motivo de la reunión"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
              style={styles.textArea}
              mode="outlined"
            />
          </View>

          <View style={{ marginTop: 40 }}>
            <Button icon="calendar" mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={[styles.button]}>
              <Text style={{ fontSize: 20, color: '#fff', lineHeight: 28 }}>{loading ? 'Registrando...' : 'Agendar'}</Text>
            </Button>
          </View>

          <View style={{ marginTop: 30, alignSelf: 'center', paddingHorizontal: 15 }}>            
            <TouchableOpacity
              onPress={() => setShowTermsModal(true)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Checkbox
                status={termsAccepted ? 'checked' : 'unchecked'}
                color="#007AFF"
              />
              <Text style={{ textDecorationLine: 'underline', color: Colors.link }}>Acepto los Términos y Condiciones del servicio y Política de Privacidad</Text>
            </TouchableOpacity>

            <TermsModal
              visible={showTermsModal}
              onAccept={handleTermsAccept}
              onClose={() => setShowTermsModal(false)}
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
  dateRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
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