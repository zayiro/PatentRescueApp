// hooks/useBiometricAuth.ts
import Routes from '@/config/Routes';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useBiometricAuth = () => {
  const navigation = useNavigation();
  
  const checkBiometrics = async () => {
    try {
      // 🔹 Verificar hardware
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return { available: false, reason: 'Sin sensor' };
      }

      // 🔹 Verificar configurada
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (enrolled) {
        return { available: true, enrolled: true };
      }

      // 🔹 NO configurada → PREGUNTAR
      return { available: true, enrolled: false };
    } catch (error) {
      return { available: false, reason: String(error) };
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
              navigation.navigate(Routes.Home);
            }
          },
        },
      ]
    );
  };

  const authenticate = async () => {
    const status = await checkBiometrics();
    
    if (!status.available) {
      Alert.alert('Biometría', status.reason || 'No disponible');
      return { success: false };
    }

    if (!status.enrolled) {
      await requestBiometricSetup();
      return { success: false, setupRequested: true };
    }

    // 🔹 Autenticar
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verificar identidad',
      fallbackLabel: 'PIN',
    });

    return { success: result.success };
  };

  return { authenticate, checkBiometrics, requestBiometricSetup };
};