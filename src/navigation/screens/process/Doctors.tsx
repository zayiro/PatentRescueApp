// screens/DoctorsScreen.tsx
import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Card,
  Avatar,
  Text,
  Chip,
  Searchbar,
} from 'react-native-paper';
import { useDoctorsFilter } from '@/hooks/useDoctorsFilter'
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import LoadingSpinner from '@/components/LoadingSpinner';
import Colors from '@/config/Colors';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import StarRating from '@/components/StarRating';

export default function Doctors() {
  const navigation = useNavigation();
  const { saveAppointment, appointment } = useAppointmentStorage();

  const [search, setSearch] = useState<string>('');

  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
  const specialtyId = parseInt(appointment?.specialty.id || '0');
  
  const { doctors, total, loading } = useDoctorsFilter(consultationType, specialtyId, search);  
  
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSelectCalendar = useCallback((doctorId: string) => {
    saveAppointment({ 
      doctorId,
    });

    console.log("doctorId: ", doctorId);

     navigation.navigate(Routes.Calendar);
  }, [saveAppointment, navigation]);

  const renderDoctor = ({ item }: { item: any}) => (
    <TouchableOpacity style={styles.boxDoctor} onPress={() => handleSelectCalendar(item.id)}>
      <View>
        <View style={styles.doctorRow}>
          {/* 🔹 Foto */}
          <View style={{ alignItems: 'center' }}>
            <Avatar.Image 
                size={75} 
                source={{ uri: 'https://i.pravatar.cc/300' }} 
            />
            <StarRating rating={5} />
          </View>
        
          {/* 🔹 Info */}
          <View style={styles.infoCol}>
              <Text style={styles.doctorName}>{item.name}</Text>
              <Text style={{ fontSize: 12 }}>Anestesiólogo +</Text>                                   
              {/* 🔹 Precio + Slots */}
              <View style={styles.detailsRow}>
                <Text>$ 180.000 COP</Text>              
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
      <View style={{ flex: 1 }}>                  
        <View>
          <Text>
            Especialidad: {specialtyId}
          </Text>
          <Text>
            {filteredDoctors.length} doctores disponibles
          </Text>
        </View>
        
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
    paddingVertical: 50,
    backgroundColor: '#FFF',
  },
  boxDoctor: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    marginTop: 18,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.Violet
  },
  specialty: {
    marginBottom: 8,
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
    margin: 16,
  },
});