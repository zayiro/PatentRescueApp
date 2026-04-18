import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Avatar,
  Text,
  Searchbar,
  SegmentedButtons,
  IconButton,
} from 'react-native-paper';
import { useDoctorsFilter } from '@/hooks/useDoctorsFilter'
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import LoadingSpinner from '@/components/LoadingSpinner';
import Colors from '@/config/Colors';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import StarRating from '@/components/StarRating';
import { Icon } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ConsultationTypes } from '@/enums/ConsultationTypes';
import { limpiarString } from '@/utils/utils';

export default function Doctors() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [search, setSearch] = useState<string>('');
  const [value, setValue] = useState<string>(ConsultationTypes.MedicalConsultation.toString());
  const [doctorIdSelected, setDoctorIdSelected] = useState<string>('');
  const [doctorNameSelected, setDoctorNameSelected] = useState<string>('');

  const { saveAppointment, appointment } = useAppointmentStorage();

  const specialtyName = appointment?.specialty.name;
  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
  const specialtyId = parseInt(appointment?.specialty.id || '0');
  
  const {
    doctors,
    loading,
  } = useDoctorsFilter(consultationType, specialtyId, search);

  console.log(doctors);

  const doctorAddress = doctors[0]?.address || [];
  
  const filteredDoctors = doctors.filter(doctor => {
      return limpiarString(doctor.name).includes(limpiarString(search))
    }
  );

  const selectConsultationType = useCallback((type: number) => {
    if (consultationType === type) return;

    setValue(type.toString());

    saveAppointment({
      consultationType: type,
    });
  }, [consultationType, value, saveAppointment]);
  
  const handleSelectDoctor = useCallback(async (item: any) => {
    setDoctorIdSelected(item.id);
    setDoctorNameSelected(item.name);

    await saveAppointment({ 
        doctorId: item.id,
        doctorName: item.name
    });    

    navigation.navigate(Routes.CollaboratorDetail);
  }, [saveAppointment, consultationType, doctorAddress, navigation]);

    const maxVisible = 1;
    const mostrarMas = doctorAddress.length > maxVisible;

  const renderDoctor = ({ item }: { item: any}) => (
    <TouchableOpacity style={styles.doctorBox} onPress={() => handleSelectDoctor(item)}>
      <View>
        <View style={[styles.doctorRow]}>
          <View style={{ position: 'relative', alignItems: 'center' }}>
            <Avatar.Image 
              size={85} 
              source={{ uri: item.photo }} 
            />
            {item.isVerified && (
              <IconButton
                icon="check-circle"
                size={20}
                iconColor="#4CAF50"
                style={styles.checkIcon}
              />
            )}
          </View>
          <View style={[styles.infoCol, { marginLeft: 10 }]}>
            <Text style={styles.doctorName}>{item.name}</Text>
            <Text style={{ color: '#565f5f' }}>{specialtyName}</Text>
            <Text style={{ fontWeight: '700', color: '#565f5f' }}>{item.yearsExperience} { item.yearsExperience > 1 ? ' años' : ' año' } de experiencia</Text>
            <Text><StarRating rating={4} /></Text>
          </View>
        </View>
        <View>
          <View style={styles.infoCol}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
              <Icon
                source="account-check"
                color={Colors.Violet}
                size={25}
              />
              <Text style={{ fontSize: 16, fontWeight: '700' }}>Especialista en</Text>
            </View>
            <View style={{  paddingLeft: 8 }}>
              <Text>Diabetes tipo 1</Text>
            </View>
          </View>

          <View style={styles.infoCol}>
            {item.services && item.services.length > 0 && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                  <Icon
                    source="check-bold"
                    color={Colors.Violet}
                    size={21}
                  />
                  <Text style={{ fontSize: 16, fontWeight: '700' }}>Servicios</Text>
                </View>
                {item.services.slice(0, 2).map((service: string, index: number) => (
                  <View key={index} style={{  paddingLeft: 8 }}>
                    <Text>{service}</Text>
                  </View>
                ))}
                {item.services.length > 2 && (
                  <Text style={{ marginBottom: 6, fontSize: 13, color: Colors.Violet, paddingLeft: 8 }}>
                    +{item.services.length - 3} servicios adicionales
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return (<LoadingSpinner message='Buscando especialistas...' />);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" /> 
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      > 
      <View style={{ alignItems: 'flex-start', marginHorizontal: 20, marginBottom: 20 }}>        
        {filteredDoctors.length ? (
          <>
            <Text style={{ fontSize: 17, fontWeight: '700', marginTop: 5 }}>{specialtyName || ''}</Text>  
            <Text>{filteredDoctors.length} {filteredDoctors.length > 1 ? 'especialistas disponibles' : 'especialista disponible' }</Text>
          </>        
        ): (null)}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 15, marginBottom: 30, justifyContent: 'center' }}>
          <SegmentedButtons
            value={value}
            onValueChange={(value) => {
                if (consultationType === parseInt(value)) return;
                selectConsultationType(consultationType === ConsultationTypes.MedicalConsultation ? ConsultationTypes.Telemedicine : ConsultationTypes.MedicalConsultation)
              }
            }
            buttons={[
              {
                value: ConsultationTypes.MedicalConsultation.toString(),
                label: 'Presencial',
                labelStyle: {
                  color: theme.colors.primary,
                  fontSize: 16,
                  fontWeight: '600'
                },
                checkedColor: theme.colors.primary, // Selected text color
                uncheckedColor: Colors.Gray400, // Unselected text color
              },
              {
                value: ConsultationTypes.Telemedicine.toString(),
                label: 'Telemedicina',
                labelStyle: {
                  color: theme.colors.primary,
                  fontSize: 16,
                  fontWeight: '600'
                },
                checkedColor: theme.colors.primary, // Selected text color
                uncheckedColor: Colors.Gray400, // Unselected text color
              },
            ]}
          />
        </View>

        <Searchbar
          placeholder="Buscar por nombre..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        
        {filteredDoctors.length ? (
          <View style={{ backgroundColor: Colors.LightGray }}>                    
            <FlatList
              data={filteredDoctors}
              renderItem={renderDoctor}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={1}
            />
          </View>
        )
      :
        (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', marginTop: 30 }}>
              No se encontrarón especialistas para {specialtyName}
            </Text>
            <TouchableOpacity
              style={{ marginTop: 20, padding: 12, borderRadius: 5 }}
              onPress={() => navigation.navigate(Routes.Specialties) }
            >
              <Text style={{ color: Colors.Violet, textDecorationLine: 'underline', alignItems: 'center', alignSelf: 'center' }}>nueva busqueda</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: Colors.White,    
  },
  doctorBox: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: Colors.Gray400,
    borderWidth: 1,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
  },
  doctorName: {
    fontSize: 19,
    fontWeight: '700',
  },
  specialty: {
    marginBottom: 8,
    fontSize: 18,
    color: Colors.Violet,
  },
  searchbar: {
    marginHorizontal: 15,
    marginBottom: 20
  },
  checkIcon: {
    position: 'absolute',
    bottom: -8,   // ✅ Justo abajo
    right: -8,    // ✅ Justo derecha
    margin: 0,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});