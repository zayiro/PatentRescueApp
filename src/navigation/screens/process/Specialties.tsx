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

  const handleSelectSpecialty = useCallback((item: any) => {
    saveAppointment({ 
      specialty: {
        id: item.id,
        name: item.name,
        price: item.price || '0',
      }
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
    } catch (err) {   
      setLoading(false);
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
            <IconButton icon={'gesture-tap'} size={40} style={{ backgroundColor: Colors.Violet + '20' }} />
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
    paddingVertical: 15,
    margin: 8,
    borderRadius: 5,
    borderColor: Colors.Gray400,
    borderWidth: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  specialtyName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});