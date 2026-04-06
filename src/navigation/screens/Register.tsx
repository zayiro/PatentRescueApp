import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  StatusBar,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Button,
  TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/config/Colors';
import Routes from '@/config/Routes';
import { checkEmailExists, createDocument, createNewUser } from '@/service/firestore';
import { NameCollection } from '@/enums/NameCollection';
import { UserDataType } from '@/type/UserDataType';
import { MedicationType } from '@/type/MedicationType';
import { MedicalHistoryType } from '@/type/MedicalHistoryType';

export function Register() {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = useCallback( async () => {
    setLoading(true);

    let date = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    let creationDate = year + '-' + ((month < 10) ? '0' + month : month) + '-' + ((date < 10) ? '0' + date : date)

    if (!firstName.length || !lastName.length) {
      Alert.alert("Error", "Los nombres y apellidos son obligatorios.")
      
      return false;
    }

    if (!email.length) {
      Alert.alert("Error", "El correo electrónico es obligatorio.")
      
      return false;
    }

    if (!password) {
      Alert.alert("Error", "La contraseña es obligatoria.")
      return false;
    } else if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.")
      return false;
    }
    
    if (!confirmPassword) {
      Alert.alert("Error", "Confirma tu contraseña.")
      return false;
    } else if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.")
      return false;
    }
    
    const userEmail = email.toLowerCase().trim();    
    const emailExists = await checkEmailExists(userEmail);  

    if (emailExists) {
      Alert.alert("Crear usuario", "El correo electrónico ya está registrado. Por favor, utiliza otro correo.")
      return false;
    }

    let userData = {
      userId: "",
      firstName: firstName.trim(), 
      lastName: lastName.trim(),        
      email: userEmail,        
      phone: phone.trim(),
      photoURL: "avatar.png",
      creationDate,
      countryCode: 'CO'     
    } as UserDataType;

    try {      
      const result = await createNewUser(email, password);
      if (result.isSuccess) {
        let userId = result.userId.toString();
        userData.userId = userId;
        
        //datos del usuario
        createDocument(NameCollection.Users, userId, userData); 

        let medicalHistoryData = {
          userId,  
        } as  MedicalHistoryType
        //Historia clinica del usuario
        createDocument(NameCollection.MedicalHistory, userId, medicalHistoryData); 

        let medicationData = {
          userId,  
        } as  MedicationType
        //Medicacion del usuario
        createDocument(NameCollection.Medication, userId, medicationData); 

        setFirstName('')
        setLastName('')
        setPhone('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        
        Alert.alert("Registro exitoso", "Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.");
        navigation.navigate(Routes.Login);
      } else {
        setLoading(false);
        Alert.alert("Error", result.errorMessage);
        return false;
      } 
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", String(error));
      
      return false
    }

    setLoading(false);
  }, [firstName, lastName, phone, email, password, confirmPassword]);
  
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
          <View style={{ marginTop: 30 }}>
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
            <TextInput
              label="Celular"  
              onChangeText={setPhone}
              value={phone}          
              right={<TextInput.Icon icon="phone" color={Colors.iconInput} />}
              keyboardType="phone-pad"
              mode="outlined"
            />
          </View>

          <View style={{ marginTop: 25 }}>
            <TextInput
              label="Correo electrónico"     
              onChangeText={setEmail}
              value={email} 
              returnKeyType="done"      
              right={<TextInput.Icon icon="email" color={Colors.iconInput} />}
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
              mode="outlined"
            />
          </View>

          <View style={{ marginTop: 25 }}>
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              right={<TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                color={Colors.iconInput}
                onPress={() => setShowPassword(!showPassword)}
                forceTextInputFocus={false}
              />}
              mode="outlined"
            />
          </View>

          <View style={{ marginTop: 25 }}>
            <TextInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              right={<TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                color={Colors.iconInput}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                forceTextInputFocus={false}
              />}
              mode="outlined"
            />
          </View>

          <View style={{ marginTop: 25 }}>
            <Button icon="account" mode="contained" onPress={handleRegister} loading={loading} disabled={loading} style={[styles.button]}>
              <Text style={{ fontSize: 20, color: '#fff', paddingVertical: 10 }}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
            </Button>
          </View>

          <View style={{ marginTop: 30 }}>
            <Text>Ya tengo una cuenta </Text>
            <TouchableOpacity onPress={() => navigation.navigate(Routes.Login)}>
              <Text style={{ color: Colors.link }}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
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
});