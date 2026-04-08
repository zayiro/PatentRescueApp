import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  View,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Button,
  TextInput,
  Text,
  Menu 
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/config/Colors';
import { getUserData, updateDocumentCollection } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { NameCollection } from '@/enums/NameCollection';
import { UserDataType } from '@/type/UserDataType';
import DocumentTypeData from '@/config/DocumentType';
import MedicalInsuranceData from '@/config/MedicalInsurance';
import LoadingSpinner from '@/components/LoadingSpinner';

export function MedicalInsurance() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [documentTypeUser, setDocumentTypeUser] = useState<string>('');
  const [identification, setIdentification] = useState<string>('');
  const [medicalInsuranceUser, setMedicalInsuranceUser] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const handleProfile = useCallback( async () => {  
    if (!documentTypeUser || documentTypeUser.trim() === '') {
      return 'Tipo de documento requerido';
    }
   
    if (!identification.length) {
      Alert.alert("Error", "Campo identificación obligatorio.")
      
      return false;
    }

    setLoading(true)

    let userData = {
      documentType: documentTypeUser,
      identification: identification.trim(),
      medicalInsurance: medicalInsuranceUser,
    } as UserDataType;
      
    const updateUser = await updateDocumentCollection(NameCollection.Users, user?.uid, userData)
            
    if (updateUser.isSuccess) {            
      setLoading(false)
      Alert.alert("Éxito", "Perfil actualizado correctamente.")
    } else {
      setLoading(false)
      Alert.alert("Error", "Hubo un error al actualizar el perfil.")
    }
  }, [documentTypeUser, identification, medicalInsuranceUser, user]);

  const onUserData = useCallback( async(userId: string) => {
    try {
      setLoading(true);

      const result: any = await getUserData(userId)
      if (result) {
        setDocumentTypeUser(result.documentType || '');
        setIdentification(result.identification || '')      
        setMedicalInsuranceUser(result.medicalInsurance || '')
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
                <Text style={{ marginBottom: 30 }}>Esta información puede ser necesaria para verificar la cobertura de tu aseguradora</Text>
                <Menu
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <TextInput
                      label="Tipo de documento"
                      value={DocumentTypeData.find(g => g.value === documentTypeUser)?.label || ''}
                      editable={false}
                      right={<TextInput.Icon icon="menu-down" onPress={() => setVisible(true)} />}
                      mode="outlined"
                    />
                  }
                >
                  {DocumentTypeData.map((option) => (
                    <Menu.Item
                      key={option.value}
                      onPress={() => {
                        setDocumentTypeUser(option.value);
                        setVisible(false);                        
                      }}
                      title={option.label}
                    />
                  ))}
                </Menu>
              </View>

              <View style={{ marginTop: 25 }}>
                <TextInput
                  label="Identificación"  
                  onChangeText={setIdentification}
                  value={identification}          
                  right={<TextInput.Icon icon="information" color={Colors.iconInput} />}
                  keyboardType="phone-pad"
                  mode="outlined"
                />
              </View>

              <View style={{ marginTop: 25 }}>
                <Menu
                  visible={visible2}
                  onDismiss={() => setVisible2(false)}
                  anchor={
                    <TextInput
                      label="Seguro médico"
                      value={MedicalInsuranceData.find(g => g.value === medicalInsuranceUser)?.label || ''}
                      editable={false}
                      right={<TextInput.Icon icon="menu-down" onPress={() => setVisible2(true)} />}
                      mode="outlined"
                    />
                  }
                >
                  {MedicalInsuranceData.map((option) => (
                    <Menu.Item
                      key={option.value}
                      onPress={() => {
                        setMedicalInsuranceUser(option.value);
                        setVisible2(false);                        
                      }}
                      title={option.label}
                    />
                  ))}
                </Menu>
              </View>

              <View style={{ marginTop: 40 }}>
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
});