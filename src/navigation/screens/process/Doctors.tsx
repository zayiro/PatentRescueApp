// screens/DoctorsScreen.tsx
import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
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

     //navigation.navigate(Routes.Calendar);
  }, [saveAppointment, navigation]);

  const renderDoctor = ({ item }: { item: any}) => (
    <TouchableOpacity onPress={() => handleSelectCalendar(item.id)}>
        <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
            <View style={styles.doctorRow}>
              {/* 🔹 Foto */}
              <Avatar.Image 
                  size={80} 
                  source={{ uri: 'https://i.pravatar.cc/300' }} 
              />
            
              {/* 🔹 Info */}
              <View style={styles.infoCol}>
                  <Text style={styles.doctorName}>{item.name}</Text>
                  <Text style={styles.specialty}>{item.id}</Text>                                        
                  {/* 🔹 Precio + Slots */}
                  <View style={styles.detailsRow}>
                    <Chip style={styles.priceChip}>$ {item.name}</Chip>              
                  </View>
              </View>
            </View>
        </Card.Content>
        </Card>
    </TouchableOpacity>
  );

  if (loading) return (<LoadingSpinner />);

  return (
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
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 12,
  },
  card: {
    marginVertical: 8,
    elevation: 2,
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
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialty: {
    color: Colors.specialityGrayName,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 8,
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