import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function Splash({ onFinish }: Props) {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        SplashScreen.hideAsync();
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>    
      <StatusBar hidden />
      <Image
        source={require('@/assets/splash-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Image
        source={require('@/assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
  },
  logo: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignSelf: 'center',
    top: '40%',
  },
});