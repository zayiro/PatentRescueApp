import React, { useCallback, useState } from 'react';
import { Assets as NavigationAssets } from '@react-navigation/elements';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/config/theme';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { Navigation } from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

Asset.loadAsync([
  ...NavigationAssets,
  require('@/assets/newspaper.png'),
  require('@/assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {

    
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <Navigation            
          linking={{
            enabled: 'auto',
            prefixes: [prefix],
          }}
          onReady={() => {
            SplashScreen.hideAsync();
          }}
        />
      </SafeAreaProvider>
    </PaperProvider>  
  );
}
