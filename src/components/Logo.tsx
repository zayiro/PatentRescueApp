import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Logo = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center', }}>
    <Image source={require('../assets/logo-blanco.png')} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  image: {
    width: 269,
    height: 215,
  },
});

export default memo(Logo);
