// screens/DoctorsScreen.tsx
import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Avatar,
  Text,
  Searchbar,
} from 'react-native-paper';
import { useDoctorsFilter } from '@/hooks/useDoctorsFilter'
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import LoadingSpinner from '@/components/LoadingSpinner';
import Colors from '@/config/Colors';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import StarRating from '@/components/StarRating';
import { Icon, MD3Colors } from 'react-native-paper';

export default function Doctors() {
  const navigation = useNavigation();

  const [search, setSearch] = useState<string>('');

  const { saveAppointment, appointment } = useAppointmentStorage();

  const specialtyName = appointment?.specialty.name;
  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
  const specialtyId = parseInt(appointment?.specialty.id || '0');

  console.log("consultationType: "+consultationType);
  
  const { doctors, total, loading } = useDoctorsFilter(consultationType, specialtyId, search);  
  
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSelectCalendar = useCallback((doctorId: string, doctorName: string) => {
    saveAppointment({ 
      doctorId,
      doctorName
    });

     navigation.navigate(Routes.Calendar);
  }, [saveAppointment, navigation]);

  const renderDoctor = ({ item }: { item: any}) => (
    <TouchableOpacity style={styles.boxDoctor} onPress={() => handleSelectCalendar(item.id, item.name)}>
      <View>
        <View>
          <Text style={styles.doctorName}>{item.name}</Text>          
          <Text><StarRating rating={4} /></Text>
        </View>
        <View style={styles.doctorRow}>
          {/* 🔹 Foto */}
          <View style={{ alignItems: 'center' }}>
            <Avatar.Image 
                size={75} 
                source={{ uri: 'https://i.pravatar.cc/300' }} 
            />
          </View>
        
          {/* 🔹 Info */}
          <View style={styles.infoCol}>
              {consultationType == 2 && (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon
                      source="google-maps"
                      color={Colors.Violet}
                      size={20}
                    /><Text style={{ fontSize: 13 }}>Cra 7E # 70-134</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '700' }}>Clínica inbanaco, consultorio 301</Text>
                  </View>
                </>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                <Icon
                  source="heart-plus"
                  color={Colors.Violet}
                  size={20}
                /><Text style={{ fontSize: 13 }}>Visita nutricion y Dietetica, Asesoria nutricional, Alimentación del lactante</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <Text style={{ fontSize: 13, fontWeight: '700' }}>$ 180.000</Text>
              </View>
          </View>
        </View>        
      </View>
    </TouchableOpacity>
  );

  if (loading) return (<LoadingSpinner />);

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
          {consultationType == 1 ? 'Telemedicina' : 'Consulta Presencial' }
        </Text>
        <Text>{filteredDoctors.length} especialistas disponibles en</Text>
        <Text style={{ fontWeight: '700' }}>{specialtyName || ''}</Text>
      </View>

      <View style={{ flex: 1 }}>        
        {/* 🔹 Search */}
        <Searchbar
          placeholder="Buscar por nombre..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />

        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctor}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          numColumns={1}
        />
      </View>  
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
  boxDoctor: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    marginTop: 20,
    borderRadius: 5,
    borderColor: Colors.Gray400,
    borderWidth: 1,
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
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: 8,
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
  },
});