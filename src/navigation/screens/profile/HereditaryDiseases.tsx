import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  View,
  Alert,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  Button,
  TextInput,
  Text,
  Divider,
  IconButton,
  Chip,
  List
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getMedicalHistoryData, updateDocumentCollection } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { NameCollection } from '@/enums/NameCollection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { serverTimestamp } from "firebase/firestore";
import { useMedicalHistory } from '@/hooks/useMedicalHistory';
import Colors from '@/config/Colors';

interface Disease {
  id: string;
  name: string;
}

export function HereditaryDiseases() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const userId = user?.uid ?? '';

  const diseaseItem = 'hereditaryDiseases';

  const { diseasesList, removeFromMedicalHistory } = useMedicalHistory(userId, diseaseItem);

  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [medicalHistoryList, setMedicalHistoryList] = useState<Disease[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddMedicaHistory = useCallback( async () => {   
    const newDisease: Disease = { id: Date.now().toString(), name: medicalHistory };
    setMedicalHistoryList(prev => [...prev, newDisease]);

    try {
      setLoading(true)

      let data = {
        hereditaryDiseases: [...medicalHistoryList, newDisease],
        updatedAt: serverTimestamp()
      };

      const response = await updateDocumentCollection(NameCollection.MedicalHistory, user?.uid, data)

      if (response.isSuccess) {
        setMedicalHistory('')
        Alert.alert("Éxito", "Datos guardados correctamente")
      } else {
        Alert.alert("Error", response.errorMessage)
      }
    } catch (error) {
      Alert.alert("Error", String(error))
    } finally {
      setLoading(false)
    }
  }, [medicalHistory, medicalHistoryList, user]);

  const onUserData = useCallback( async(userId: string) => {
    const result: any = await getMedicalHistoryData(userId)
    
    setLoading(true)
    if (result) {
      setMedicalHistory(result.activeDiseases || '');
    }
    setLoading(false)
  }, []);  
  
  useEffect(() => {
    if (user?.uid) {
      onUserData(user.uid)
    }
  }, [user, onUserData]);

  useEffect(() => {       
    setMedicalHistoryList(diseasesList);
  }, [diseasesList]);

  const handleDelete = (diseaseId: string) => {
    console.log("diseaseId: "+ diseaseId);
    Alert.alert(
      'Eliminar',
      '¿Quitar enfermedad del historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeFromMedicalHistory(userId, diseaseId),
        },
      ]
    );
  };

  const renderDisease = ({ item }: { item: any }) => (
    <List.Item
      title={item.name}
      left={() => <List.Icon icon="check" color={Colors.SlateGray} />}
      right={() => (
        <View style={styles.rightContent}>                  
          <IconButton
            icon="delete"
            size={20}
            iconColor={Colors.Red}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      )}
      onPress={() => Alert.alert('Info', item.name)}
    />
  );

  const ListItemSeparator = () => (
  <View style={{
    height: 1,
    backgroundColor: Colors.LightGray,
    marginHorizontal: 15,
  }} />
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
              <View style={{ marginTop: 25 }}>                
                <Text style={{ marginBottom: 30 }}>
                  Ejemplo: Hipertensión, Asma, EPOC, Diabetes (tipo 1 o 2), obesidad, colesterol alto...
                </Text>
                <TextInput
                  value={medicalHistory}
                  onChangeText={setMedicalHistory}
                  multiline={true}
                  mode="flat"
                  placeholder='Ej: Diabetes'
                />
              </View>

              <View style={{ marginVertical: 30 }}>
                <Button icon="account-heart" mode="contained" onPress={handleAddMedicaHistory} loading={loading} disabled={loading} style={[styles.button]}>
                  <Text style={{ fontSize: 20, color: '#fff', lineHeight: 30 }}>{loading ? 'Actualizando...' : 'Registrar'}</Text>
                </Button>
              </View>

              <Divider />

              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: '700' }}>
                  Enfermedades hereditarias ({ medicalHistoryList.length })
                </Text>
              </View>  
              <View style={{ flex: 1 }}>
                <FlatList
                  data={medicalHistoryList}
                  renderItem={renderDisease}
                  keyExtractor={(item) => item.id}
                  style={{ flex: 1 }} 
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={ListItemSeparator}
                />
              </View>
            </>
          )
        }          
      </KeyboardAvoidingView>    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: Colors.White
  },
  button: {
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12, // 📱 Android
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center',
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "#eee",
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  textArea: {
    minHeight: 120,
    height: 100, // Altura fija para forzar el área de texto
    textAlignVertical: 'top', // Alinea el texto al inicio en Android
  },
  card: { padding: 10, marginBottom: 10},
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1 },  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 20,
    paddingBottom: 10,
  },
  list: {
    flex: 1,
    paddingBottom: 80,  // Espacio FAB
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityChip: {
    height: 24,
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
  },
});