import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { emailValidator } from '@/utils/utils';
import Routes from '@/config/Routes';
import Colors from '@/config/Colors';

export function Configuration() {
  const navigation = useNavigation();
  const [email, setEmail] = useState({ value: '', error: '' });

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
          <Text>Configuracion</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: Colors.White,
  },
});
