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
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, View, StyleSheet, Alert, Animated } from "react-native";
import { Button, TextInput, Text, Divider, Checkbox, RadioButton } from "react-native-paper";
import uuid from 'react-native-uuid'
import { formatDateTime } from '@/utils/formatDateTime';

export default function Patient() {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const { appointment, saveAppointment } = useAppointmentStorage();

  const specialtyId = appointment?.specialty.id;
  const specialtyName = appointment?.specialty.name;
  const selectedDate = appointment?.selectedDate;
  const selectedTime = appointment?.selectedTime;
  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;

  const [value, setValue] = useState<string>('first');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [firstNameSaved, setFirstNameSaved] = useState<string>('');
  const [lastNameSaved, setLastNameSaved] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [heightAnim] = useState(new Animated.Value(0));

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

  const toggleOtherPerson = () => {
    if (visible) {
      // 🔹 Ocultar
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setVisible(false);
      });
    } else {
      // 🔹 Mostrar
      setVisible(true);
      Animated.timing(heightAnim, {
        toValue: 175,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

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

      let patientName = firstNameSaved+" "+lastNameSaved;      
      if (value !== 'first') {
        if (!firstName.length) {
          Alert.alert("Error", "El nombre es obligatorio.")
          
          return false;
        }

        if (!lastName.length) {
          Alert.alert("Error", "El apellido es obligatorio.")
          
          return false;
        }

        patientName = firstName+" "+lastName;
      }

      if (!description.length) {
        Alert.alert("Aviso", "La descripción es obligatoria.")        
        return false;
      }

      let createdAt: any = serverTimestamp(); 
      let appointmentId = uuid.v4().toString();

      // 🔹 Guardar datos paciente
      await saveAppointment({ 
          appointmentId: appointmentId,
          patientData: {
              name: patientName,
              userId: user?.uid || '',
              description: description.trim(),
          },
          status: 'completed',
          createdAt: formatDateTime(new Date(), undefined, 'YYYY-MM-DDTHH:mm:ssZ')
      });      

      let data = {
        id: appointmentId,
        creationDate: appointment?.createdAt,
        userId: appointment?.patientData.userId,
        name: patientName,
        description: appointment?.patientData.description,
        specialtyId: appointment?.specialty?.id,
        specialtyAmount: appointment?.specialty?.amount,
        doctorId: appointment?.doctorId,
        doctorName: appointment?.doctorName,
        selectedDate: appointment?.selectedDate,
        selectedTime: appointment?.selectedTime,
        link: '',
        isPay: 'Pending',
        createdAt,
      }

      createDocument(NameCollection.Appointments, appointmentId, data);
      //console.log("Appointment saved with ID:", appointmentId, "Data:", data);

      navigation.navigate(Routes.Summary);    
  }, [saveAppointment, navigation, firstName, lastName, firstNameSaved, lastNameSaved, description, user, termsAccepted, value]);

  const onUserData = useCallback( async(userId: string) => {
      const result: any = await getUserData(userId)
      console.log(result);
      setFirstNameSaved(result.firstName || '');      
      setLastNameSaved(result.lastName || '');      
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
          <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>
                {consultationType == 1 ? 'Telemedicina' : 'Consulta Presencial' }
              </Text>
              <Text style={{ fontWeight: '700' }}>{appointment?.doctorName || ''}</Text>
              <Text>{specialtyName || ''}</Text>              
              <Text style={{ marginTop: 5 }}>{dayjs(selectedDate).locale('es').format('dddd, DD [de] MMMM [del] YYYY')}</Text>
              <Text>Hora: {selectedTime}</Text>
          </View>

          <Divider />

          <View>
            <View style={{ alignItems: 'flex-start', marginTop: 30, marginBottom: 20 }}>
              <Text variant="headlineSmall">¿Para quién es la cita?</Text>
            </View>

            <View style={{ marginBottom: 10 }}>            
              <RadioButton.Group onValueChange={newValue => { 
                  setValue(newValue);
                  toggleOtherPerson();
                }} value={value}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>                
                  <RadioButton value="first" />
                  <Text style={{ paddingTop: 5 }}>{ firstNameSaved } { lastNameSaved }</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>                
                  <RadioButton value="second" />
                  <Text style={{ paddingTop: 5 }}>Para otra persona</Text>
                </View>
              </RadioButton.Group>
            </View>

            <Animated.View 
              style={[
                styles.inputContainer,
                {
                  height: heightAnim,
                  opacity: heightAnim.interpolate({
                    inputRange: [0, 60],
                    outputRange: [0, 1],
                  }),
                },
              ]}
            >                    
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
            </Animated.View>
            
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
                <Text style={{ fontSize: 20, color: '#fff', lineHeight: 30 }}>{loading ? 'Registrando...' : 'Agendar'}</Text>
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
  inputContainer: {
    
  }
});