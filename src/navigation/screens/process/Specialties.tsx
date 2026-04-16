import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Divider, IconButton, List } from 'react-native-paper';
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
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        ¿Qué especialidad busca?
      </Text>
    
      <FlatList
        data={specialties}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleSelectSpecialty(item)}
          >
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <List.Icon color={Colors.Gray400} icon={'dots-vertical'} />
              <View style={{ flex: 1, alignItems: 'flex-start',  marginLeft: 15 }}>
                <Text style={[styles.specialtyName, { color: Colors.Title }]}>{item.name}</Text>
              </View>
              <IconButton icon="chevron-right" size={20} iconColor={Colors.Gray400} />
            </View>
            <Divider style={{ marginVertical: 10 }} />
          </TouchableOpacity>          
        )}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 2 }}
        
        // UX esencial
        contentContainerStyle={styles.listaContenido}
        style={styles.flatList}
        
        // Scroll suave
        decelerationRate="normal"
        bounces={true}
        
        // Performance
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
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
  flatList: {
    flex: 1,                  
  },
  listaContenido: {
    paddingTop: 15,
    paddingBottom: 100,        
  },
  searchbar: {
    margin: 5,
    marginBottom: 20 
  },
  specialtyCard: {
    backgroundColor: Colors.White,
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
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});