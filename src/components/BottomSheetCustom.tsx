import Colors from '@/config/Colors';
import React, { ReactNode, useEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Animated } from 'react-native';
import { Portal, Modal, Button, Card, Text } from 'react-native-paper';

const { height: screenHeight } = Dimensions.get('window');

interface BottomSheetCustomProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  height: number;
}

const BottomSheetCustom = ({
  visible,
  onClose,
  title,
  children,
  height
}: BottomSheetCustomProps) => {
  const slideValue = React.useRef(new Animated.Value(screenHeight)).current;

    const heightCustom = height * 0.6

  useEffect(() => {
    if (visible) {
      // Subir DESDE abajo
      Animated.spring(slideValue, {
        toValue: screenHeight - heightCustom,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Bajar A abajo
      Animated.timing(slideValue, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height]);

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose}
      >
        {/* Fondo oscuro */}
        <Pressable 
          style={styles.overlay} 
          onPress={onClose}
        />

        {/* Sheet animado */}
        <Animated.View 
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideValue }],
              height: height,
            },
          ]}
        >
          <View style={styles.handle} />
          <Card style={styles.card}>
            <Card.Content style={styles.content}>
              {title && <Text style={styles.title}>{title}</Text>}
              {children}
            </Card.Content>
          </Card>
        </Animated.View>
      </Modal>
    </Portal>
  );
};

export default BottomSheetCustom;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.White,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: Colors.White,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    margin: 0,
  },
  content: {
    flex: 1,
    padding: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    paddingTop: 12,
  },
});