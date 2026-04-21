import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity
} from 'react-native';
import {
  Avatar,
  Button,
  Chip,
  Icon,
  List,
  RadioButton,
  SegmentedButtons,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import BottomSheetCustom from '@/components/BottomSheetCustom';
import LoadingSpinner from '@/components/LoadingSpinner';
import axios from 'axios';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import Colors from '@/config/Colors';
import { formatPrice } from '@/utils/priceUtils';
import StarRating from '@/components/StarRating';
import { theme } from '@/config/theme';
import { ConsultationTypes } from '@/enums/ConsultationTypes';
import Routes from '@/config/Routes';
import { APP_BASE_URL, headerAxiosApp, timeoutAxios } from '@/config/configApp';

export function CollaboratorDetail() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const { appointment, saveAppointment } = useAppointmentStorage();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: appointment?.doctorName,
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: 'bold' },
    });
  }, [appointment]);

  const doctorId = appointment?.doctorId;
  const consultationType = appointment?.consultationType ? parseInt(appointment?.consultationType.toString()) : 0;
  
  const [userId, setUserId] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [collaboratorDetail, setCollaboratorDetail] = useState<any>({});
  const [addressSelected, setAddressSelected] = useState<any>({});
  const [serviceSelected, setServiceSelected] = useState<any>({});  
  const [value, setValue] = useState<string>('1');

  const handleCalendar = useCallback((item: any) => {        
    if (Object.keys(serviceSelected).length === 0) {
      Alert.alert('Consulta presencial', 'Por favor seleccione el servicio que necesitas para la consulta');
      return;
    }
    
    if (consultationType == ConsultationTypes.MedicalConsultation) {
      if (collaboratorDetail.address.length == 0) {
        Alert.alert('Aviso', 'No hay direcciones disponibles para este doctor. Por favor selecciona otro doctor.');
        return;
      }
      
      if (Object.keys(addressSelected).length === 0) {
        Alert.alert('Consulta presencial', 'Por favor seleccione el consultorio y el servicio que necesitas para la consulta');
        return;
      }
    }
    
    saveAppointment({ 
      doctorId: collaboratorDetail.id,
      doctorName: collaboratorDetail.name,
      address: addressSelected,
      service: serviceSelected,
      step: 3
    });

    navigation.navigate(Routes.Calendar);
  }, [saveAppointment, consultationType, collaboratorDetail, serviceSelected, addressSelected, serviceSelected, navigation]);

  const fetchCollaboratorDetail = useCallback(async (doctorId: any) => {    
    if (!doctorId) {
      Alert.alert('Error', 'ID del colaborador requerido');
      return;
    }

    try {
      setLoading(true);
      
      const formData = {
        doctorId: doctorId,
      };

      const response = await axios.post(
        `${APP_BASE_URL}/api/collaboratorDetail.php`, formData, {
        headers: headerAxiosApp,
        timeout: timeoutAxios,
      });
      
      setCollaboratorDetail(response.data);
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'No se pudierón cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

   const selectConsultationType = useCallback((type: number) => {
    if (consultationType === type) return;

    setValue(type.toString());

    saveAppointment({
      consultationType: type,
    });
  }, [consultationType, value, saveAppointment]);

  useEffect(() => {
    setValue(consultationType.toString());

    if (doctorId) {
      fetchCollaboratorDetail(doctorId);
    }
  }, [consultationType, doctorId]);

  if (loading) return (<LoadingSpinner message={'Cargando información...'} />);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {collaboratorDetail && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            <View style={{ flex: 1 }}>       
              <View style={styles.header}>
                <Avatar.Image size={100} source={{ uri: collaboratorDetail.photo }} />
                <Text><StarRating rating={collaboratorDetail.rating} /></Text>
                <Text variant='titleLarge' style={styles.name}>{collaboratorDetail.name}</Text>
                <Text variant='titleMedium'>{collaboratorDetail.selectedSpecialty}</Text>
              </View>
                    
              <List.Section>
                <List.Subheader>
                  <Chip icon="send" onPress={() => Alert.alert("Aviso", "Chat")}>Enviar mensaje</Chip>                  
                </List.Subheader>                
              </List.Section>  
              
              <View style={{ paddingHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                  <Icon
                    source="phone"
                    color={Colors.SlateGray}
                    size={24}              
                  />
                  <Text style={{ marginLeft: 5, fontSize: 16 }}>
                    {collaboratorDetail.phoneMain}
                  </Text>  
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                  <Icon
                    source="email"
                    color={Colors.SlateGray}
                    size={24}
                  />
                  <Text style={{ marginLeft: 5, fontSize: 16 }}>
                    {collaboratorDetail.email}
                  </Text>  
                </View>    
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                  <Icon
                    source="web"
                    color={Colors.SlateGray}
                    size={24}
                  />
                  <Text style={{ marginLeft: 5, fontSize: 16 }}>
                    <TouchableRipple onPress={() => Linking.openURL(collaboratorDetail.link)} style={{ marginLeft: 5 }}>
                      <Text style={{ color: Colors.link }}>
                        {' '} Ver pagina web
                      </Text>
                    </TouchableRipple>
                  </Text>  
                </View>         
              </View>

              <BottomSheetCustom
                visible={visible}
                onClose={() => setVisible(false)}
                title="Dra. María González 🩺"
                height={630} // 60% ≈ 400px
              >                
              </BottomSheetCustom>
            </View>
           
            <View style={{ marginHorizontal: 15, paddingVertical: 20 }}>
                    
              <View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Experiencia</Text>
                  <Text>{collaboratorDetail.experience}</Text> 
                </View> 
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: '700' }}>Expecialista en</Text>
                  <Text style={{ marginLeft: 5}}>
                    Epidemia, Epidemia, Epidemia, Epidemia, Epidemia
                  </Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: '700' }}>Enfermedades tratadas</Text>
                  <Text style={{ marginLeft: 5}}>
                    Epidemia, Epidemia, Epidemia, Epidemia, Epidemia
                  </Text>
                </View>  
              </View>

              <View style={{ justifyContent: 'center', marginTop: 15, marginBottom: 20 }}>
                <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Tipo de Consulta</Text>  
                <SegmentedButtons
                  value={value}
                  onValueChange={(value) => {
                      if (consultationType === parseInt(value)) return;
                      selectConsultationType(consultationType === ConsultationTypes.MedicalConsultation ? ConsultationTypes.Telemedicine : ConsultationTypes.MedicalConsultation)
                    }
                  }
                  buttons={[
                    {
                      value: ConsultationTypes.MedicalConsultation.toString(),
                      label: 'Presencial',
                      labelStyle: {
                        color: theme.colors.primary,
                        fontSize: 16,
                        fontWeight: '600'
                      },
                      checkedColor: theme.colors.primary, // Selected text color
                      uncheckedColor: Colors.Gray400, // Unselected text color
                    },
                    {
                      value: ConsultationTypes.Telemedicine.toString(),
                      label: 'Telemedicina',
                      labelStyle: {
                        color: theme.colors.primary,
                        fontSize: 16,
                        fontWeight: '600'
                      },
                      checkedColor: theme.colors.primary, // Selected text color
                      uncheckedColor: Colors.Gray400, // Unselected text color
                    },
                  ]}
                />
              </View>

              <View style={{ paddingVertical: 20 }}>  

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Servicios</Text>
                  {collaboratorDetail.services.map((item: any, index: number) => (
                    <TouchableOpacity 
                      key={index}
                      onPress={() => setServiceSelected(item)} 
                      activeOpacity={0.7}
                    >
                      <View style={{  flexDirection: 'row', marginBottom: 10, marginLeft: 10 }}>
                        <RadioButton
                          value={item.id.toString()}
                          status={serviceSelected.id === item.id ? 'checked' : 'unchecked'}
                          onPress={() => setServiceSelected(item)} 
                        />
                        <View>
                          <Text style={{ paddingTop: 5 }}>{item.name}</Text>
                          {item.price ? (
                            <Text style={{ fontWeight: '700' }}>{formatPrice(item.price)}</Text>
                          ) : null}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>  
                
                <View style={styles.section}>
                  
                  <Text style={styles.sectionTitle}>Consultorios</Text>

                  {consultationType === ConsultationTypes.MedicalConsultation ? (
                    <>
                      {collaboratorDetail.address.length > 0 && collaboratorDetail.address.map((item: { id: number; name: string; location: string; phone: any; }) => {
                        const phoneAddress = item.phone.map((s: any) => s.phone);
                        return (
                          <TouchableOpacity 
                            key={item.id}
                            onPress={() => setAddressSelected(item)} 
                            activeOpacity={0.7}
                          >
                            <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 10 }}>
                              <RadioButton
                                value={item.id.toString()}
                                status={addressSelected.id === item.id ? 'checked' : 'unchecked'}
                                onPress={() => setAddressSelected(item)} 
                              />                        
                                <View>
                                  <Text style={{ fontWeight: '700', paddingTop: 5 }}>{item.name}</Text>
                                  <Text>{item.location}</Text>                        
                                  <Text>{phoneAddress}</Text>
                                </View>                           
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                    </>
                  ) : (
                    <>
                      {collaboratorDetail.address.length > 0 && collaboratorDetail.address.map((item: { id: number; name: string; location: string; phone: any; }) => {                        
                        return (
                          <View key={item.id} style={{ marginLeft: 10, marginTop: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Icon
                                source="check"
                                color={Colors.GreenLight}
                                size={24}              
                              />
                              <Text style={{ fontWeight: '700', marginLeft: 5 }}>{item.name}</Text>
                            </View>
                            <Text>{item.location}</Text>  
                          </View>  
                        )
                      })}
                    </>
                  )}
                </View>  

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Opiniones</Text>
                  <Text>data informacion</Text> 
                </View>
              </View>

            </View>       
          </ScrollView>
        )}

        <View>
          <Button 
            mode="contained" 
            onPress={handleCalendar}
            style={styles.btn}
          >
            🩺 Agendar Cita
          </Button>
        </View>
      </KeyboardAvoidingView>    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 40,
    backgroundColor: '#FFF',
  },
  button: {
    marginVertical: 20,
    marginBottom: 20
  },
  scrollContent: {
    flex: 1,    
  }, 
  lista: { flexGrow: 0, paddingHorizontal: 10 },
  header: { alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 10, alignContent: 'center' },
  card: { margin: 10 },
  btn: { 
    paddingVertical: 8,
    borderRadius: 12,
  },
  contentArea: { padding: 20, margin: 10, elevation: 2, borderRadius: 8 },
  actionBtn: { 
    marginBottom: 12,
    borderRadius: 12,
  },

  tabList: {
    height: 60,
  },
  tabListContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    padding: 10,
    paddingTop: 1,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  selectedText: {
    color: Colors.White,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  doctorCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  doctorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  rating: {
    color: '#FFD700',
    fontWeight: '500',
  },
  scrollBtn: {
    margin: 20,
    borderRadius: 12,
  },
});