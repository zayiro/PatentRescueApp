import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  List,
  Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';
import { getUserData } from '@/service/firestore';
import Colors from '@/config/Colors';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import { appName, appVersion } from '@/utils/version'

const { width, height } = Dimensions.get('window');

interface MenuItem {
  id: number;
  name: string;
  route: any;
}

const menuItems: MenuItem[] = [ 
  {
    id: 1,
    name: 'Agendar Cita Médica',
    route: Routes.Specialties,
  },
  {
    id: 2,
    name: 'Citas Programadas',
    route: Routes.Appointments,
  },
  {
    id: 3,
    name: 'Mensajes',
    route: Routes.Home,
  },
  {
    id: 4,
    name: 'Asistente Médico',
    route: Routes.MedicaAssistant,
  },
  {
    id: 5,
    name: 'Perfil',
    route: Routes.ProfileSegment,
  },
  {
    id: 6,
    name: 'Configuración',
    route: Routes.Configuration,
  },
];

export function Menu() {
  const navigation = useNavigation();
  const { saveAppointment } = useAppointmentStorage();

  const { user, isAuthenticated, logout } = useAuth();

  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onUserData = useCallback( async(userId: string) => {
    try {
      setLoading(true);

      const result: any = await getUserData(userId)
      if (result)
        setUserName(result.firstName || '');
    } catch (error) {
      Alert.alert("Error: datos no cargado");
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

  const handleLogout = useCallback( async () => {
    logout();
    navigation.navigate(Routes.Login);
  }, []);

  const handleMenu = useCallback((item: MenuItem) => {
    navigation.navigate(item.route);
  }, [navigation]);

  if (loading) return (<LoadingSpinner message='Cargando...' />);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >        
        <View style={styles.container}>
          <FlatList
            data={menuItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => handleMenu(item)}
              >
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <List.Icon color={Colors.Gray400} icon={'dots-vertical'} />
                  <View style={{ flex: 1, alignItems: 'flex-start',  marginLeft: 15 }}>
                    <Text style={[styles.name, { color: Colors.Title }]}>{item.name}</Text>
                  </View>
                  <IconButton icon="chevron-right" size={20} iconColor={Colors.Gray400} />
                </View>
                <Divider style={{ marginVertical: 10 }} />
              </TouchableOpacity>          
            )}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 2 }}
            contentContainerStyle={styles.listaContenido}
            style={styles.flatList}
            decelerationRate="normal"
            bounces={true}
            removeClippedSubviews={false}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>  
              <Button icon="logout" mode="contained" onPress={handleLogout} style={styles.button}>
                <Text style={{ fontSize: 20, color: '#fff', paddingVertical: 10 }}>Cerrar sesión</Text>
              </Button>
            </View>
            
            <View style={styles.versionContainer}>
              <Text style={{ color: Colors.Violet, fontWeight: '700' }}>{appName}</Text>   
              <Text style={styles.versionText}>{appVersion}</Text>
            </View>
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
    paddingVertical: 20,
    backgroundColor: Colors.White,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  flatList: {
    flex: 1,                  
  },
  listaContenido: {
    paddingTop: 15,
    paddingBottom: 100,        
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
  },
  button: {
    marginVertical: 10,
    borderRadius: 12
  },  
  twoColumns: {
    flexDirection: 'row',  
    justifyContent: 'space-between', 
    gap: 14,
  },
  column: {
    flex: 1,     
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
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
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    alignSelf: 'center'
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});
