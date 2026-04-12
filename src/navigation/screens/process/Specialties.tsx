import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';
import Colors from '@/config/Colors';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Specialty {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  amount?: number;
}

export default function Specialties() {
  const navigation = useNavigation();
  const { saveAppointment } = useAppointmentStorage();

  const [loading, setLoading] = useState<boolean>(true);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [search, setSearch] = useState<string>('');

  const specialtiesList = [
    { id: 1, name: 'Medicina general', icon: 'heart', color: Colors.Violet, amount: 50000 },
    { id: 2, name: 'Cardiología', icon: 'heart', color: Colors.Violet, amount: 70000 },
    { id: 3, name: 'Dermatología', icon: 'hand-back-left', color: Colors.Violet, amount: 60000 },
    { id: 4, name: 'Pediatría', icon: 'baby-carriage', color: Colors.Violet, amount: 55000 },
    { id: 5, name: 'Neurología', icon: 'brain', color: Colors.Violet, amount: 80000 },
    { id: 6, name: 'Gastroenterología', icon: 'food-apple', color: Colors.Violet, amount: 65000 },
    { id: 7, name: 'Psiquiatría', icon: 'emoticon-happy', color: Colors.Violet, amount: 75000 },    
  ];

  const handleSelectSpecialty = useCallback((specialty: any) => {
    saveAppointment({ 
      specialty,
     });

     navigation.navigate(Routes.Doctors);
  }, [saveAppointment, specialties, navigation]);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('https://esdecali.com/truedoctor/api/specialties.php', {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`, // Si usas auth
        },
        timeout: 10000, // 10 segundos
      });

      const data = response.data;

      setSpecialties(data.specialties);
      console.log(data.specialties);
    } catch (err) {
      console.error('Error especialidades:', err);      
      Alert.alert('Error', String(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar especialidades al montar el componente
  useEffect(() => {
    fetchSpecialties();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner message="Cargando especialidades..." />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.Title, marginBottom: 20 }}>
        ¿Qué especialidad necesitas?
      </Text>
      <FlatList
        data={specialties}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.specialtyCard}
            onPress={() => handleSelectSpecialty(item)}
          >
            <IconButton icon={'gesture-tap'} size={40} style={{ backgroundColor: item.color + '20' }} />
            <Text style={[styles.specialtyName, { color: Colors.Title }]}>{item.name}</Text>
          </TouchableOpacity>          
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  searchbar: {
    margin: 5,
    marginBottom: 20 
  },
  specialtyCard: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 5,
    paddingBottom: 15,
    margin: 8,
    borderRadius: 5,
    borderColor: Colors.Gray400,
    borderWidth: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  specialtyName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});