import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  View,
  Alert,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  Button,
  RadioButton,
  TextInput,
  Text,
  Menu 
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/config/Colors';
import { getUserData, updateDocumentCollection, updateProfileUser } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { IMAGE } from '@/assets';
import { NameCollection } from '@/enums/NameCollection';
import { UserDataType } from '@/type/UserDataType';
import Genders from '@/config/Gender';
import LoadingSpinner from '@/components/LoadingSpinner';

export function Address() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [city, setCity] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleProfile = useCallback( async () => {  
    if (!address.length) {
      Alert.alert("Error", "La dirección es obligatoria.")
      
      return false;
    }

    if (!city.length) {
      Alert.alert("Error", "La ciudad es obligatoria.")
      
      return false;
    }

    setLoading(true)

    let userData = {
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim()
    } as UserDataType;
      
    const updateUser = await updateDocumentCollection(NameCollection.Users, user?.uid, userData)
            
    if (updateUser.isSuccess) {      
      setLoading(false)
      Alert.alert("Éxito", "Perfil actualizado correctamente.")
    } else {
      setLoading(false)
      Alert.alert("Error", "Hubo un error al actualizar el perfil.")
    }
  }, [address, city, postalCode, user]);

  const onUserData = useCallback( async(userId: string) => {
    try {
      setLoading(true);

      const result: any = await getUserData(userId)
      if (result) {
        setAddress(result.address || '');
        setCity(result.city || '');
        setPostalCode(result.postalCode || '');
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
                <Text style={{ marginBottom: 30 }}>Tu dirección puede ser necesaria para registrarte en la consulta o para hacerte una receta</Text>
                <TextInput
                  label="Ciudad"     
                  onChangeText={setCity}
                  value={city} 
                  returnKeyType="done"      
                  right={<TextInput.Icon icon="domain" color={Colors.iconInput} />}
                  autoCapitalize="none"
                  keyboardType="default"
                  mode="outlined"
                />
              </View>              

              <View style={{ marginTop: 25 }}>                
                <TextInput
                  label="Dirección"     
                  onChangeText={setAddress}
                  value={address} 
                  returnKeyType="done"      
                  right={<TextInput.Icon icon="city" color={Colors.iconInput} />}
                  autoCapitalize="none"
                  keyboardType="default"
                  mode="outlined"
                />
              </View>

              <View style={{ marginTop: 25 }}>
                <TextInput
                  label="Código postal"     
                  onChangeText={setPostalCode}
                  value={postalCode} 
                  returnKeyType="done"      
                  right={<TextInput.Icon icon="crosshairs-gps" color={Colors.iconInput} />}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  mode="outlined"
                />
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