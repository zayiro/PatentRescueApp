import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import {
  Avatar,
  Text,
  Searchbar,
  RadioButton,
  Button,
  Divider,
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import { useDoctorsFilter } from '@/hooks/useDoctorsFilter'
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import LoadingSpinner from '@/components/LoadingSpinner';
import Colors from '@/config/Colors';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import StarRating from '@/components/StarRating';
import { Icon, Modal } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { ConsultationTypes } from '@/enums/ConsultationTypes';
import { limpiarString } from '@/utils/utils';

export default function Doctors() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [search, setSearch] = useState<string>('');
  const [value, setValue] = useState<string>(ConsultationTypes.MedicalConsultation.toString());

  const { saveAppointment, appointment } = useAppointmentStorage();

  const specialtyName = appointment?.specialty.name;
  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
  const specialtyId = parseInt(appointment?.specialty.id || '0');
  
  const {
    doctors,
    loading,
  } = useDoctorsFilter(consultationType, specialtyId, search);

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

  const shareToWhatsApp = async (item: any) => {
    const data = `**${item.name}** 🫀
      Cardióloga | COL
      ✅ Consultas presenciales
      ✅ Consultas en línea

      📱 Agenda: ${item.link}`;

    const message = encodeURIComponent(data);
    
    // WhatsApp URL Scheme
    const whatsappUrl = `whatsapp://send?text=${message}`;
    
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback: WhatsApp Web
        const webUrl = `https://wa.me/?text=${message}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'WhatsApp no está instalado');
    }
  };

  
  const handleSelectDoctor = useCallback((item: any) => {
    navigation.navigate(Routes.CollaboratorDetail);
  }, [saveAppointment, consultationType, doctorAddress, navigation]);

    const maxVisible = 2;
    const mostrarMas = doctorAddress.length > maxVisible;

  const renderDoctor = ({ item }: { item: any}) => (
    <TouchableOpacity style={styles.doctorBox} onPress={() => handleSelectDoctor(item)}>
      <View>
        <View style={[styles.doctorRow, { marginBottom: 10 }]}>
          <View style={{ alignItems: 'center' }}>
            <Avatar.Image 
              size={85} 
              source={{ uri: 'https://i.pravatar.cc/300' }} 
            />
          </View>
          <View style={[styles.infoCol, { marginLeft: 10 }]}>
            <Text style={styles.doctorName}>{item.name}</Text>          
            <Text><StarRating rating={4} /></Text>
            <View style={{ width: 140 }}>                       
              <Chip icon="share" onPress={() => shareToWhatsApp(item)}>Compartir</Chip>   
            </View>
          </View>          
        </View>
        <View style={styles.doctorRow}>                  
          {/* 🔹 Info */}
          <View style={styles.infoCol}>                              
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
              <Icon
                source="google-maps"
                color={Colors.Violet}
                size={20}
              />
              <Text style={{ fontSize: 14, fontWeight: '700' }}>Consultorios</Text>                           
            </View>
            {doctorAddress.length > 0 && doctorAddress.slice(0, maxVisible).map((address) => (
              <View key={address.id} style={{ marginBottom: 6, paddingLeft: 8 }}>
                <Text style={{ fontSize: 13 }}>{address.location}</Text>
                <Text style={{ fontSize: 13 }}>{address.name}</Text>
              </View>
            ))}
            {mostrarMas && (
              <Text style={{ fontSize: 12, color: Colors.Violet, paddingLeft: 8 }}>
                +{doctorAddress.length - maxVisible} direcciones adicionales
              </Text>
            )}
            
            {item.services && item.services.length > 0 && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                  <Icon
                    source="heart-plus"
                    color={Colors.Violet}
                    size={20}
                  />
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>Servicios</Text>                
                </View>
                {item.services.slice(0, 2).map((service: string, index: number) => (
                  <View key={index} style={{  paddingLeft: 8 }}>
                    <Text style={{ fontSize: 13 }}>{service}</Text>
                  </View>    
                ))}
                {item.services.length > 2 && (
                  <Text style={{ marginBottom: 6, fontSize: 12, color: Colors.Violet, paddingLeft: 8 }}>
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
          <>                    
            <FlatList
              data={filteredDoctors}
              renderItem={renderDoctor}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              numColumns={1}
            />
          </>
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
  button: {
    marginVertical: 10,
  }, 
  listaDirecciones: {
    flexGrow: 1,
  },
  headerPaper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  botonCerrarPaper: {
    margin: 0,
    marginTop: 5
  },
  doctorBox: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: Colors.Gray400,
    borderWidth: 1,
    shadowColor: '#9c9a9a',
    shadowOffset: {
      width: 0,
      height: 1,          // Elevación vertical
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    
    // 🌑 ELEVATION Android
    elevation: 8,           // Equivalente iOS shadow
  },
  list: {
  },
  card: {
    backgroundColor: Colors.White,
    marginVertical: 10,
  },
  cardContent: {
    padding: 0,
  },
  confirmButton: {
    marginTop: 5,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
  },
  specialty: {
    marginBottom: 8,
    fontSize: 14,
    color: Colors.Violet,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  priceChip: {
    backgroundColor: '#10B981',
  },
  slotsChip: {
    backgroundColor: '#3B82F6',
  },
  actionBtn: {
    marginLeft: 16,
  },
  searchbar: {
    marginHorizontal: 15,
    marginBottom: 20
  },
});