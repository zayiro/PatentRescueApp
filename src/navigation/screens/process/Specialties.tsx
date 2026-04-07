import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Colors from '@/config/Colors';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';

export default function Specialties() {
  const navigation = useNavigation();
  const { saveAppointment } = useAppointmentStorage();

  const specialties = [
    { id: 1, name: 'Medicina general', icon: 'heart', color: '#EF4444', amount: 50000 },
    { id: 2, name: 'Cardiología', icon: 'heart', color: '#EF4444', amount: 70000 },
    { id: 3, name: 'Dermatología', icon: 'hand-back-left', color: '#10B981', amount: 60000 },
    { id: 4, name: 'Pediatría', icon: 'baby-carriage', color: '#3B82F6', amount: 55000 },
    { id: 5, name: 'Neurología', icon: 'brain', color: '#8B5CF6', amount: 80000 },
    { id: 6, name: 'Gastroenterología', icon: 'food-apple', color: '#F59E0B', amount: 65000 },
    { id: 7, name: 'Psiquiatría', icon: 'emoticon-happy', color: '#EC4899', amount: 75000 },    
  ];

  const handleSelectSpecialty = useCallback((specialty: any) => {
    saveAppointment({ 
      specialty,
     });

     navigation.navigate(Routes.Doctors);
  }, [saveAppointment, specialties, navigation]);

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 30 }}>
        Selecciona una opción
      </Text>
      
      <FlatList
        data={specialties}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.specialtyCard}
            onPress={() => handleSelectSpecialty(item)}
          >
            <IconButton icon={item.icon} size={40} style={{ backgroundColor: item.color + '20' }} />
            <Text style={[styles.specialtyName, { color: Colors.Title }]}>{item.name} ({item.id})</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 50,
    backgroundColor: '#FFF',
  },
  specialtyCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    margin: 8,
    borderRadius: 16,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialtyName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
});