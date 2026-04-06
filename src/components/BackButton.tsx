import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';

type Props = {
  goBack: () => void;
};

const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const BackButton = ({ goBack }: Props) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <Text>back</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + STATUSBAR_HEIGHT,
    left: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);