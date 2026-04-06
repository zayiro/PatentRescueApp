import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  View,
  Platform,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import {
  Text,
  IconButton,
  Card
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/config/Colors';
import { getUserData } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { IMAGE } from '@/assets';
import Routes from '@/config/Routes';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ItemData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  routeItem: any;
}

export function MedicalHistory() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<any>();

  const onUserData = useCallback( async(userId: string) => {
    try {
      setLoading(true);

      const result: any = await getUserData(userId)
      if (result) {
        setFirstName(result.firstName || '');
        setPhotoURL(result.photoURL || '')
      }      
    } catch (error) {
      Alert.alert("Error: datos no cargados");
      return false
    } finally {
      setLoading(false);
    }
  }, []);  
    
  useEffect(() => {
    if (user?.uid) {
      onUserData(user.uid)
    }
  }, [user, onUserData]);

  
  const items = [
  {
    id: '1',
    icon: 'dots-vertical-circle',
    title: 'Enfermedades activas',
    subtitle: '',
    routeItem: Routes.UnderlyingDiseases
  },
  {
    id: '2',
    icon: 'dots-vertical-circle',
    title: 'Enfermedades hereditarias',
    subtitle: 'ompleta tus datos y selecciona tu seguro médico.',
    routeItem: Routes.HereditaryDiseases
  },
  {
    id: '3',
    icon: 'dots-vertical-circle',
    title: 'Alergias',
    subtitle: 'Ubicación fisica',
    routeItem: Routes.Allergies
  },
  {
    id: '4',
    icon: 'dots-vertical-circle',
    title: 'Medicamentos',
    subtitle: '',
    routeItem: Routes.Medication
  },
];

  const renderItem = ({ item }: { item: ItemData }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(item.routeItem)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>          
            <View style={styles.iconRow}>
              <IconButton icon={item.icon} size={28} iconColor={Colors.Gray400} />
              <Text>{item.title}</Text>
              <IconButton icon="chevron-right" size={24} iconColor={Colors.Gray400} />            
          </View>          
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {loading ? (            
            <>
              <View>
                <LoadingSpinner message="Cargando..." />
              </View>
            </>
          )
        :
          (
            <>
              <Text style={{ marginBottom: 30 }}>
                Tu historial médico puede ayudar a los especialistas a entender mejor tu caso.
              </Text>
              
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />    
            </>
          )}  
      </KeyboardAvoidingView>    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
    backgroundColor: Colors.White
  },
  textContainer: {
    flex: 1,                    // 🔹 OCUPA RESTO ESPACIO
    justifyContent: 'center',
  },
  list: {
    padding: 3,
    marginBottom: 20,
    paddingBottom: 1
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 12,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: 0,
    elevation: 0,             // 🔹 Sin sombra Android
    shadowOpacity: 0,
  },
  cardContent: {
    flexDirection: 'row',   
  },
  leftColumn: {
    flex: 1,                     // 🔹 Columna 1 ocupa resto
    alignItems: 'flex-start'
  },
  iconRow: {
    flexDirection: 'row',        // 🔹 Icono + título
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitle: {
  },
  rightColumn: {
    justifyContent: 'center',
  },
  separator: {
    height: 12,
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center',
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: "#eee",
  },
});