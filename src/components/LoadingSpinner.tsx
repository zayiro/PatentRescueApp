import Colors from '@/config/Colors';
import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface LoadingProps {
  message?: string;
  progress?: number;
  size?: number;
  showProgress?: boolean;
}

export default function LoadingSpinner({
  message = 'Cargando...',
  progress = 0,
  size = 48,
  showProgress = true,
}: LoadingProps) {
  const theme = useTheme();
  
  const steps = 100000;
  for (let i = 0; i < steps; i++) {
    progress = (i + 1) / steps;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
            
      <Text style={[styles.message, { color: theme.colors.onSurface }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.White,
    marginTop: 50
  },
  progressBar: {
    width: 200,
    height: 6,
    marginVertical: 20,
    borderRadius: 3,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});