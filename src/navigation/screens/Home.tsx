

import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  Button,
  Text,
  IconButton, 
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Routes from '@/config/Routes';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';
import { getUserData } from '@/service/firestore';
import Colors from '@/config/Colors';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import { ConsultationTypes } from '@/enums/ConsultationTypes';
import { theme } from '@/config/theme'

const { width, height } = Dimensions.get('window');

export function Home() {
  const navigation = useNavigation();
  const { saveAppointment } = useAppointmentStorage();

  const { user, isAuthenticated, logout } = useAuth();

  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAppointmentType = useCallback((consultationType: number) => {
    saveAppointment({
      consultationType,
      address: consultationType === ConsultationTypes.Telemedicine ? null : undefined,
      status: 'draft',
     });

    navigation.navigate(Routes.Specialties);
  }, [saveAppointment, navigation]);

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

  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (loading) {
    return (
      <LoadingSpinner message="Cargando información..." />
    );
  }
  
  if (!isAuthenticated) {
    return (
      <>
        <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 24 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            <View style={[styles.container]}>        
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={require('@/assets/fondo-main.jpg')}
                  style={styles.backgroundImage}
                  resizeMode="cover"
                />
              </View>

              <View>
                <Text variant="headlineMedium">En cualquier momento.</Text>
                <Text variant="headlineMedium">En cualquier lugar.</Text>
                <Text variant="displaySmall">Un Doctor presente.</Text>
              </View>
              
              <View style={{ marginBottom: 60 }}>
                <Button icon="login" mode="contained" onPress={() => navigation.navigate(Routes.Login)} style={styles.button}>
                  <Text style={{ fontSize: 22, color: '#fff', paddingVertical: 10 }}>Iniciar sesión</Text>
                </Button>
                <Button icon="login" mode="contained" onPress={() => navigation.navigate(Routes.Register)} style={styles.button}>
                  <Text style={{ fontSize: 20, color: '#fff', paddingVertical: 10 }}>Registrarme</Text>
                </Button>        
              </View>

            </View>   
          </ScrollView>
        </KeyboardAvoidingView> 
      </>
    );
  }

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container2}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: Colors.White }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          <View>                        
              <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 20 }}>Hola, <Text style={{ fontWeight: '700' }}>{userName}</Text></Text>
              </View>

              <View>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>
                  Encuentra tu especialista y pide cita
                </Text>
                <Text variant='labelMedium' style={{ marginTop: 10, marginBottom: 30, color: Colors.SlateGray }}>
                  Más de 60 mil profesionales están aquí para ayudarte.
                </Text>
              </View>

              <View style={styles.twoColumns}>                
                <View style={styles.column}>              
                  <TouchableOpacity 
                    style={[styles.card, { backgroundColor: Colors.White }]}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                    onPress={() => handleAppointmentType(ConsultationTypes.MedicalConsultation)}
                  >
                    <IconButton icon="message-video" size={40} iconColor={theme.colors.primary} />
                    <Text style={[styles.cardName, { color: Colors.SlateGray }]}>Consulta en línea</Text>    
                  </TouchableOpacity>
                </View>
                <View style={styles.column}>
                  <TouchableOpacity 
                    style={[styles.card]}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                    onPress={() => handleAppointmentType(ConsultationTypes.Telemedicine)}
                  >
                    <IconButton icon="hospital-building" size={40} iconColor={theme.colors.primary} />
                    <Text style={[styles.cardName, { color: Colors.SlateGray }]}>Consulta presencial</Text>    
                  </TouchableOpacity>
                </View>
              </View>
            
              <Divider style={{ marginTop: 10, marginBottom: 30 }} />

              <View style={styles.twoColumns}>                
                <View style={styles.column}>              
                  <TouchableOpacity 
                    style={[styles.card, { backgroundColor: Colors.White }]}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate(Routes.Appointments)}
                  >
                    <IconButton icon="message-video" size={40} iconColor={theme.colors.primary} />
                    <Text style={[styles.cardName, { color: Colors.SlateGray }]}>Citas programadas</Text>    
                  </TouchableOpacity>
                </View>
                <View style={styles.column}>
                  <TouchableOpacity 
                    style={[styles.card]}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                    onPress={() => handleAppointmentType(ConsultationTypes.Telemedicine)}
                  >
                    <IconButton icon="hospital-building" size={40} iconColor={theme.colors.primary} />
                    <Text style={[styles.cardName, { color: Colors.SlateGray }]}>Notificaciones</Text>    
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>  
                <Button icon="logout" mode="contained" onPress={handleLogout} style={styles.button}>
                  <Text style={{ fontSize: 20, color: '#fff', paddingVertical: 10 }}>Cerrar sesión</Text>
                </Button>
              </View> 
            </View> 
        </ScrollView>
      </KeyboardAvoidingView>   
    </>
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.White,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: Colors.White,
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
  },
  button: {
    marginVertical: 10,
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
});
function saveAppointment(arg0: { specialty: any; status: string; }) {
  throw new Error('Function not implemented.');
}

