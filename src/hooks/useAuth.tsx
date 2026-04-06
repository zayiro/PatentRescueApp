// hooks/useAuth.js
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { signInUserWithEmailAndPassword } from '@/service/firestore';
import { Alert } from 'react-native';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //console.log('Auth state changed:', currentUser?.email || false);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAuth = async (email: string, password: string) => {
    
    const result: any = await signInUserWithEmailAndPassword(email, password);
    console.log("loginAuth");
    await SecureStore.setItemAsync('userToken', result.token);
    await SecureStore.setItemAsync('userEmail', email);
    return result;
  };

   const biometricLogin = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    const email = await SecureStore.getItemAsync('userEmail');
    
    if (token && email) {
      // Restaurar sesión
      return { user: { email }, token };
    }
    
    throw new Error('No hay sesión guardada');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const requestBiometricSetup = async () => {
    Alert.alert(
      'Activar Biometría',
      '¿Quieres configurar huella/PIN para login rápido?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Configura biometría para login rápido',
            });
            if (result.success) {
              Alert.alert('✅ Configurado', 'Biometría activada');
            }
          },
        },
      ]
    );
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    loginAuth,
    biometricLogin,    
    requestBiometricSetup,
  };
};