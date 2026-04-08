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
import { getUserData, updateDocumentCollection, updateProfileUser } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { NameCollection } from '@/enums/NameCollection';
import { UserDataType } from '@/type/UserDataType';
import Genders from '@/config/Gender';
import PhoneInput from '@/components/PhoneInput';
import LoadingSpinner from '@/components/LoadingSpinner';

export function BasicInformation() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneCode, setPhoneCode] = useState('+57');
  const [phone, setPhone] = useState<string>('');
  const [fullPhoneNumber, setFullPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [photoURL, setPhotoURL] = useState<any>();
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<string>('M');
  const [visible, setVisible] = useState(false);

  const handleProfile = useCallback( async () => {  
    if (!firstName.length) {
      Alert.alert("Error", "Los nombres son obligatorios.")
      
      return false;
    }

    if (!lastName.length) {
      Alert.alert("Error", "Los apellidos son obligatorios.")
      
      return false;
    }

    if (!phone.length) {
      Alert.alert("Error", "El número de celular es obligatorio.")
      
      return false;
    }
   
    if (!gender || gender.trim() === '') {
      return 'Género requerido';
    }

    if (!birthDate.length) {
      Alert.alert("Error", "La fecha de nacimiento es obligatoria.")
      
      return false;
    }

    setLoading(true)

    let userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneCode: phoneCode.trim(), 
      phone: phone.trim(),
      gender: gender,
      birthday: birthDate.trim(),      
    } as UserDataType;

    console.log("llega");
      
    const updateUser = await updateDocumentCollection(NameCollection.Users, user?.uid, userData)
            
    if (updateUser.isSuccess) {      
      let update = {
          displayName: firstName.trim() + " " + lastName.trim(),
          photoURL: photoURL ?? ""
      }
      
      updateProfileUser(update)

      setLoading(false)
      Alert.alert("Éxito", "Perfil actualizado correctamente.")
    } else {
      setLoading(false)
      Alert.alert("Error", "Hubo un error al actualizar el perfil.")
    }
  }, [firstName, lastName, phoneCode, phone, gender, birthDate, user]);

  const onUserData = useCallback( async(userId: string) => {
    try {
      setLoading(true);

      const result: any = await getUserData(userId)
      if (result) {
        let phoneCode = result.phoneCode ?? '+57'
        let number = result.phone ?? ''
        
        setFirstName(result.firstName || '');
        setLastName(result.lastName || '');     
        setPhoneCode(phoneCode)   
        setPhone(number);              
        setFullPhoneNumber(phoneCode + '-' + number);        
        setGender(result.gender || 'M')
        setBirthDate(result.birthday || '');
        setPhotoURL(result.photoURL || '');
        setGender(result.gender || '')
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
                <Text style={{ marginBottom: 30 }}>Tu nombre y apellidos se comparten siempre con tu especialista al reservar tus citas</Text>
                <TextInput
                  label="Nombres"        
                  onChangeText={setFirstName}
                  value={firstName}
                  right={<TextInput.Icon icon="account" color={Colors.iconInput} />}
                  mode="outlined"
                />
              </View>

              <View style={{ marginTop: 25 }}>
                <TextInput
                  label="Apellidos"
                  onChangeText={setLastName}
                  value={lastName}                        
                  right={<TextInput.Icon icon="account" color={Colors.iconInput} />}
                  mode="outlined"
                />
              </View>
              
              <View style={{ marginTop: 25 }}>
                <Menu
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <TextInput
                      label="Género"
                      value={Genders.find(g => g.value === gender)?.label || ''}
                      editable={false}
                      right={<TextInput.Icon icon="menu-down" onPress={() => setVisible(true)} />}
                      mode="outlined"
                    />
                  }
                >
                  {Genders.map((option) => (
                    <Menu.Item
                      key={option.value}
                      onPress={() => {
                        setGender(option.value);
                        setVisible(false);                        
                      }}
                      title={option.label}
                    />
                  ))}
                </Menu>
              </View>

              <View style={{ marginTop: 25 }}>
                <TextInput
                  label="Fecha de nacimiento"     
                  onChangeText={setBirthDate}
                  value={birthDate} 
                  returnKeyType="done"      
                  right={<TextInput.Icon icon="calendar" color={Colors.iconInput} />}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  mode="outlined"
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <PhoneInput
                  value={fullPhoneNumber}
                  onChange={(code, number) => {
                    setPhone(number);
                    setPhoneCode(code)
                  }}
                />
              </View>

              <View style={{ marginTop: 20 }}>
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
    paddingVertical: 40,
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