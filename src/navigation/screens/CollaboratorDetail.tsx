import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  FlatList,
  ScrollView,
  Pressable,
  Alert,
  Linking
} from 'react-native';
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  List,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import BottomSheetCustom from '@/components/BottomSheetCustom';
import LoadingSpinner from '@/components/LoadingSpinner';
import axios from 'axios';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import Colors from '@/config/Colors';
import { formatPrice } from '@/utils/priceUtils';
import StarRating from '@/components/StarRating';

const tabs = [
  { id: "section_1", title: 'Experiencia' },
  { id: "section_2", title: 'Servicios y precios' },
  { id: "section_3", title: 'Consultorios' },
  { id: "section_4", title: 'Opiniones' },
];

export function CollaboratorDetail() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const { appointment } = useAppointmentStorage();

  const doctorId = appointment?.doctorId;
 
  const [userId, setUserId] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const scrollViewRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [collaboratorDetail, setCollaboratorDetail] = useState<any>({});

  const scrollToSelectedSection = (index: number) => {
    (scrollViewRef.current as FlatList<any> | null)?.scrollToIndex?.({
      index,
      animated: true,
    });
  };

  const TabButton = ({ item, index }: { item: any, index: any}) => {
    const isSelected = index === selectedTab;
    return (
      <Pressable
        style={[
          styles.tab,
          { backgroundColor: isSelected ? '#4ECDC4' : '#F8F9FA' },
        ]}
        onPress={() => { 
          setSelectedTab(index)
          scrollToSelectedSection(item?.id)
        }
      }>
        <Text style={[styles.tabText, isSelected && styles.selectedText]}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  const handleCalendar = useCallback(() => {
    navigation.navigate(Routes.Calendar);
  }, [])  

  const fetchCollaboratorDetail = async (doctorId: any) => {    
    if (!doctorId) {
      Alert.alert('Error', 'ID del colaborador requerido');
      return;
    }

    try {
      setLoading(true);
      
      const formData = {
        doctorId: doctorId,
      };

      const response = await axios.post('https://esdecali.com/truedoctor/api/collaboratorDetail.php', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log(response.data.photo);
      //console.log(response.data);
      
      setCollaboratorDetail(response.data);
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'No se pudierón cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchCollaboratorDetail(doctorId);
    }
  }, [doctorId]);

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
                  <Chip icon="message-check-outline" onPress={() => Alert.alert("Aviso", "Chat")}>Enviar mensaje</Chip>
                  <TouchableRipple onPress={() => Linking.openURL(collaboratorDetail.link)} style={{ marginLeft: 5 }}>
                    <Text style={{ color: Colors.link }}>
                      {' '} Visitar pagina web
                    </Text>
                  </TouchableRipple>
                </List.Subheader>
                <List.Item title={collaboratorDetail.phoneMain} right={() => <List.Icon icon="phone" color={Colors.SlateGray} />} />
                <List.Item title={collaboratorDetail.email} right={() => <List.Icon icon="email" color={Colors.SlateGray} />} />
              </List.Section>              

              <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                <Button 
                  mode="contained" 
                  onPress={() => setVisible(true)}
                  style={styles.btn}
                >
                  🩺 Abrir Dra. López (60%)
                </Button>        
              </View>

              <BottomSheetCustom
                visible={visible}
                onClose={() => setVisible(false)}
                title="Dra. María González 🩺"
                height={630} // 60% ≈ 400px
              >
                
              </BottomSheetCustom>
            </View>

            <View>
              {/* 🔘 BOTONES HORIZONTALES */}
              <FlatList
                data={tabs}
                renderItem={({ item, index }) => (
                  <TabButton item={item} index={index} />               
                )}
                keyExtractor={item => item.id.toString()}
                horizontal
                style={styles.tabList}
                contentContainerStyle={styles.tabListContent}
                showsHorizontalScrollIndicator={false}
              />
        
              <View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
                <View key={"section_1"} style={styles.section}>
                  <Text style={styles.sectionTitle}>Experiencia</Text>
                  <Text>{collaboratorDetail.experience}</Text> 
                </View>    
                <View key={"section_2"} style={styles.section}>
                  <Text style={styles.sectionTitle}>Servicios y precios</Text>
                  {collaboratorDetail.services && collaboratorDetail.services.length > 0 && (
                    <>                    
                      {collaboratorDetail.services.map((service: any, index: number) => (
                        <View key={index} style={{  flexDirection: 'row' }}>
                          <Text>{service.name}</Text>
                          {service.price ? (
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                              <Text>{formatPrice(service.price)}</Text>
                            </View>
                          ) : null}
                          <Divider />
                        </View>
                      ))}
                    </>
                  )}
                </View>  
                <View key={"section_3"} style={styles.section}>
                  <Text style={styles.sectionTitle}>Consultorios</Text>
                  {collaboratorDetail.address.length > 0 && collaboratorDetail.address.map((item: { id: number; name: string; location: string; phone: any; }) => {
                    const phoneAddress = item.phone.map((s: any) => s.phone);
                    return (
                      <View key={item.id} style={{ marginBottom: 6 }}>
                        <Text style={{ fontWeight: '700' }}>{item.name}</Text>
                        <Text>{item.location}</Text>                        
                        <Text>{phoneAddress}</Text>
                      </View>
                    )
                  })}
                </View>  
                <View key={"section_4"} style={styles.section}>
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