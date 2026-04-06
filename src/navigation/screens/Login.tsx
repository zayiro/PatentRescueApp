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
  Platform
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

export function Login() {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { authenticate, checkBiometrics, requestBiometricSetup } = useBiometricAuth();
  const { user, loginAuth } = useAuth();

  const follow = useCallback( async() => {
    const check = await checkBiometrics();
    console.log(check);
    if (check.available && check.enrolled) {
      requestBiometricSetup()
    }
  }, [])
  // 🔹 Biometría auto al cargar
  useEffect(() => {
    if (!user) {
      follow();
    }
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
        navigation.navigate(Routes.Home);
      } else {
        Alert.alert("Error", resp.errorMessage)        
        return false;
      }
    } catch (error) {
      Alert.alert("Error:", String(error));
    } finally {
      setLoading(false);
    }        
  }, [email, password]);
  
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
