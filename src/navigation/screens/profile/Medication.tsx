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
  Card,
  List,
  IconButton
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/config/Colors';
import { getMedicalHistoryData, getUserData, updateDocumentCollection } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { NameCollection } from '@/enums/NameCollection';
import { UserDataType } from '@/type/UserDataType';
import LoadingSpinner from '@/components/LoadingSpinner';

export function Medication() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [activeDiseases, setActiveDiseases] = useState<string>('');
  const [familyDiseases, setFamilyDiseases] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('');  
  
  const [alergia, setAlergia] = useState('');
  const [listaAlergias, setListaAlergias] = useState<any>([]);

  const [activeMedications, setActiveMedications] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

   // Añadir alergia al array local
  const handleAddAlergia = () => {
    if (alergia.trim() === '') {
      Alert.alert('Error', 'Por favor escribe una alergia');
      return;
    }
    setListaAlergias([...listaAlergias, alergia]);
    setAlergia(''); // Limpiar input
  };

  // Guardar array en Firestore [3, 12]
  const saveToFirebase = async () => {
  if (listaAlergias.length === 0) {
    Alert.alert('Aviso', 'No hay alergias para guardar');
    return;
  }

  try {
    /*await addDoc(collection(db, "pacientes_alergias"), {
      alergias: listaAlergias,
      fecha: new Date()
    });
    */
    Alert.alert('Éxito', 'Alergias guardadas');
    setListaAlergias([]);
  } catch (error) {
    Alert.alert('Error', String(error));
  }
}

  const handleProfile = useCallback( async () => {      
    setLoading(true)

    let userData = {
      activeDiseases: activeDiseases.trim(),
      familyDiseases: familyDiseases.trim(),
      allergies: activeDiseases.trim(),
      activeMedications: activeMedications.trim()
    };
      
    const updateUser = await updateDocumentCollection(NameCollection.MedicalHistory, user?.uid, userData)
            
    if (updateUser.isSuccess) {      
      setLoading(false)
      Alert.alert("Éxito", "Perfil actualizado correctamente.")
    } else {
      setLoading(false)
      Alert.alert("Error", "Hubo un error al actualizar el perfil.")
    }
  }, [activeDiseases, familyDiseases, allergies, activeMedications, activeMedications, user]);

  const onUserData = useCallback( async(userId: string) => {
    const result: any = await getMedicalHistoryData(userId)
    
    setLoading(true)
    if (result) {
      setActiveDiseases(result.activeDiseases || '');
      setFamilyDiseases(result.familyDiseases || '');
      setAllergies(result.allergies || '');
      setActiveMedications(result.activeMedications || '');
    }
    setLoading(false)
  }, []);  
  
  useEffect(() => {
    if (user?.uid) {
      onUserData(user.uid)
    }
  }, [user, onUserData]);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}
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
                  Polen, moho, alimentos (maní, leche, mariscos), picaduras de insectos y ciertos medicamentos...
                </Text>
                <TextInput
                  label="Agregar alergia"
                  value={activeDiseases}
                  onChangeText={setActiveDiseases}
                  multiline={true}
                  mode="outlined"
                />
                <Text variant='labelLarge' style={{ marginTop: 5, marginBottom: 30, color: Colors.SlateGray }}>
                  Ej: Picadura de abejas
                </Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <Button icon="account" mode="contained" onPress={handleProfile} loading={loading} disabled={loading} style={[styles.button]}>
                  <Text style={{ fontSize: 20, color: '#fff' }}>{loading ? 'Actualizando...' : 'Guardar'}</Text>
                </Button>
              </View>
            </>
          )
        }          
        </ScrollView>
      </KeyboardAvoidingView>    
    </>
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
  button: {
    paddingVertical: 10,
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
  list: { maxHeight: 300 },

});