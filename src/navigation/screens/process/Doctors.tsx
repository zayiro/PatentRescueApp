import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import {
  Avatar,
  Text,
  Searchbar,
  RadioButton,
  Button,
  Divider,
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
import { formatPrice } from '@/utils/priceUtils';
import { ConsultationTypes } from '@/enums/ConsultationTypes';

export default function Doctors() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [doctorIdSelected, setDoctorIdSelected] = useState<string>('');
  const [doctorNameSelected, setDoctorNameSelected] = useState<string>('');
  const [doctorPrice, setDoctorPrice] = useState<string>('');

  const [search, setSearch] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState<string>('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle: any = { backgroundColor: 'white', width: '92%', alignSelf: 'center', borderRadius: 8 };

  const { saveAppointment, appointment } = useAppointmentStorage();

  const specialtyName = appointment?.specialty.name;
  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
  const specialtyId = parseInt(appointment?.specialty.id || '0');
  
  const {
    doctors,
    loading,
  } = useDoctorsFilter(consultationType, specialtyId, search);

  const doctorAddress = doctors[0]?.address || [];

  const limpiarString = (str: string | null | undefined): string => {
    if (!str) return '';
  
    return str
      .trim()                    // Espacios
      .toLowerCase()             // Minúsculas
      .normalize('NFD')          // Descomponer acentos
      .replace(/[\u0300-\u036f]/g, '')  // Quitar acentos
      .replace(/[^a-z0-9\s]/g, '')     // Solo letras/números/espacios
      .replace(/\s+/g, ' ');     // Espacios múltiples → uno
  };
  
  const filteredDoctors = doctors.filter(doctor => {
      return limpiarString(doctor.name).includes(limpiarString(search))
    }
  );
  
  const handleSelectDoctor = useCallback((item: any) => {    
    setDoctorIdSelected(item.id);
    setDoctorNameSelected(item.name);
    setDoctorPrice(item.price)

    if (consultationType === 2) {
      if (doctorAddress.length === 0) {
        Alert.alert('Aviso', 'No hay direcciones disponibles para este doctor. Por favor selecciona otro doctor.');
      } else if (doctorAddress.length === 1) {
        saveAppointment({ 
          doctorId: item.id,
          doctorName: item.name
        });
        navigation.navigate(Routes.Calendar);
      } else {
        showModal();
      }
    } else {
      saveAppointment({ 
        doctorId: item.id,
        doctorName: item.name
      });
      navigation.navigate(Routes.Calendar);
    }
  }, [saveAppointment, consultationType, doctorAddress, navigation]);

    const maxVisible = 2;
    const mostrarMas = doctorAddress.length > maxVisible;

  const renderDoctor = ({ item }: { item: any}) => (
    <TouchableOpacity style={styles.doctorBox} onPress={() => handleSelectDoctor(item)}>
      <View>
        <View style={[styles.doctorRow, { marginBottom: 10 }]}>
          <View style={{ alignItems: 'center' }}>
            <Avatar.Image 
              size={75} 
              source={{ uri: 'https://i.pravatar.cc/300' }} 
            />
          </View>
          <View style={[styles.infoCol, { marginLeft: 10 }]}>
            <Text style={styles.doctorName}>{item.name}</Text>          
            <Text><StarRating rating={4} /></Text>
            <Text style={{ fontSize: 13, fontWeight: '700' }}>{formatPrice(item.price)}</Text>
          </View>
        </View>
        <View style={styles.doctorRow}>                  
          {/* 🔹 Info */}
          <View style={styles.infoCol}>
              {consultationType == 2 && (                                 
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                    <Icon
                      source="google-maps"
                      color={Colors.Violet}
                      size={20}
                    />
                    <Text style={{ fontSize: 14, fontWeight: '700' }}>Direcciones</Text>                
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
                </>
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

  const handleConfirm = useCallback(() => {
    if (checked) {      
      saveAppointment({ 
        doctorId: doctorIdSelected,
        doctorName: doctorNameSelected,
        price: doctorPrice,
        address: doctorAddress.find((addr: any) => addr.id === checked)
      });

      hideModal();
      navigation.navigate(Routes.Calendar);
    } else {
      Alert.alert('Aviso', 'Por favor selecciona una dirección para continuar');
    }
  }, [saveAppointment, checked, doctorIdSelected, doctorNameSelected, doctorPrice, navigation]);

  const renderAddress = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => {setChecked(item.id)}} activeOpacity={0.7}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 15, borderWidth: 1, borderColor: '#dbd8d8', backgroundColor: '#F3F4F6', padding: 10, borderRadius: 5 }}>
        <RadioButton
          value='first'
          status={ checked === item.id ? 'checked' : 'unchecked' } 
          onPress={() => {setChecked(item.id)}}         
        />    
        <View>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.name}</Text>
          <Text style={{ fontSize: 14 }}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return (<LoadingSpinner message='Buscando coincidencias...' />);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" /> 
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      > 
      <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.Title }}>
          {consultationType == ConsultationTypes.Telemedicine ? 'Telemedicina' : 'Consulta Presencial' }
        </Text>
        {filteredDoctors.length ? (
          <>
            <Text style={{ fontWeight: '700', marginTop: 5 }}>{specialtyName || ''}</Text>  
            <Text>{filteredDoctors.length} {filteredDoctors.length > 1 ? 'especialistas disponibles' : 'especialista disponible' }</Text>
            
          </>        
        ): (null)}
      </View>

      <View style={{ flex: 1 }}>
        {/* 🔹 Search */}
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
      <Modal 
        visible={visible} 
        onDismiss={hideModal} 
        contentContainerStyle={containerStyle}
      >
        <View style={styles.headerPaper}>
          <Button 
            mode="text" 
            onPress={() => setVisible(false)}
            style={styles.botonCerrarPaper}
            icon="close"
          >
            Cerrar
          </Button>
        </View>
        <View style={{ padding: 20 }}>
          {doctorAddress.length > 0 && (
            <>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>Elige el lugar de la consulta?</Text>
              <Text style={{ fontSize: 14, marginBottom: 25 }}>{doctorAddress.length} direcciones habilitadas</Text>
              <FlatList
                data={doctors[0].address}
                renderItem={renderAddress}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaDirecciones}
                style={{ maxHeight: 300 }}
                keyboardShouldPersistTaps="handled"
              />
            </>
          )}
        </View>

        <Divider  />

        <View style={{ padding: 24 }}>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: checked ? theme.colors.primary : Colors.Gray400 }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
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
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
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
    padding: 3,
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
    margin: 5,
    marginBottom: 20
  },
});