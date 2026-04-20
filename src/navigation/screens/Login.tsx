import React, { useCallback, useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  Switch
} from 'react-native';
import {
  Button,
  TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';
import Colors from '@/config/Colors';
import { useBiometricAuth } from '@/hooks/useBiometricAuth'
import { useAuth } from '@/hooks/useAuth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConfiguration } from '@/service/firestore';

export function Login() {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { authenticate, checkBiometrics, requestBiometricSetup } = useBiometricAuth();
  const { user, loginAuth } = useAuth();

  const onConfigApp = useCallback( async() => {        
    const cached = await AsyncStorage.getItem('configurationApp');
    if (cached) {
      const { timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp < 10 * 60 * 1000) { // 5 minutos        
        
      } 

      const response = await getConfiguration();

      await AsyncStorage.setItem('configurationApp', JSON.stringify({
        data: response,
        timestamp: Date.now(),
      }));
    }
    

    

    navigation.navigate(Routes.Home);
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', (e) => {
       getCredentials()
    });

    return () => unsubscribe();
  }, [navigation]);

  const toggleRememberMe = () => {
    setRememberMe(previousState => !previousState);
    if (rememberMe) {
      clearCredentials()      
    }
  }

  const saveCredentials = async (email: any, password: any) => {
     try {
      await AsyncStorage.setItem('userData', JSON.stringify({ email, password }));
    } catch (error) {}
  };

  const getCredentials = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (userData) {
        setEmail(userData.email)
        setPassword(userData.password)
        setRememberMe(true)
      } else {
        setRememberMe(false)
      }
    } catch (error) {}
  };

  const clearCredentials = async () => {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {}
  };

  const follow = useCallback( async() => {
    const check = await checkBiometrics();
   
    if (check.available && check.enrolled) {
      requestBiometricSetup()
    }
  }, [])
  // 🔹 Biometría auto al cargar
  useEffect(() => {
    getCredentials()
    /*if (!user) {
      follow();
    }*/
  }, [user]);

  const checkBiometricLogin = async () => {
    const result = await authenticate();
    if (result.success) {
      Alert.alert('¡Bienvenido!', 'Sesión restaurada');
      
    } else if (result.setupRequested) {
      // Usuario pidió configurar
    }
  };
  
  const handleLogin = useCallback( async () => {
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
    
    try {
      setLoading(true);

      const resp: any = await loginAuth(email, password);
      if (resp.isSuccess) {
        if (rememberMe)
          saveCredentials(email, password)

        onConfigApp()        
      } else {
        Alert.alert("Error", resp.errorMessage)        
        return false;
      }
    } catch (error) {
      Alert.alert("Error:", String(error));
    } finally {
      setLoading(false);
    }        
  }, [email, password, rememberMe]);
  
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
          <Logo />

          <View style={{ marginTop: 30, marginBottom: 15 }}>
            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}          
              right={<TextInput.Icon icon="email" />}
              keyboardType="email-address"
              mode="outlined"
            />
          </View>

          <View>
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              right={<TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                forceTextInputFocus={false}
              />}
              mode="outlined"
            />
          </View>

          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.ForgotPassword)}
            >
              <Text style={{ color: Colors.link }}>Olvido su contraseña?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text>
              Recordarme
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={rememberMe ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor={Colors.GreenLight}
              onValueChange={toggleRememberMe}
              value={rememberMe}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Button icon="account" mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={[styles.button]}>
              <Text style={{ fontSize: 20, color: '#fff', paddingVertical: 10 }}>{loading ? 'Validando...' : 'Iniciar sesión'}</Text>
            </Button>
          </View>

          <Button
            mode="outlined"
            icon="fingerprint"
            onPress={checkBiometricLogin}
            loading={loading}
            style={styles.biometricBtn}
          >
            Huella/Pin
          </Button>

          <View style={{ marginTop: 30 }}>
            <Text>No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(Routes.Register)}>
              <Text style={{ color: Colors.link }}>Registrarte</Text>
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
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: Colors.White,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    paddingVertical: 10,
    shadowColor: '#000',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12, // 📱 Android
  }, 
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 15,
    marginBottom: 24,
  },
  biometricBtn: {
    marginTop: 30
  }
});

function loginAuth(email: string, password: string): any {
  throw new Error('Function not implemented.');
}
