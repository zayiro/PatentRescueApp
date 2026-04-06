import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TextInput,
  HelperText,
  Text
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { countryCodes } from '@/config/countryCodes';
import Colors from '@/config/Colors';

interface PhoneInputProps {
  value: string;
  onChange: (code: string, phoneNumber: string) => void;
  error?: string;
}

export default function PhoneInput({
  value,
  onChange,
  error,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (value) {
      const fullNumber = value.split("-");
      
      setCountryCode(fullNumber[0].trim());
      setPhoneNumber(fullNumber[1].trim());
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        {/* 🔹 Código País */}
        <View style={styles.codeContainer}>
          <Picker
            selectedValue={countryCode}
            onValueChange={(code) => {
              setCountryCode(code);
              onChange(code, phoneNumber);
            }}
            style={[styles.flagPicker, styles.pickerAndroid]}
            dropdownIconColor="#007AFF"
          >
            {countryCodes.map((code) => (
              <Picker.Item key={code.value} label={code.label} value={code.value} />
            ))}
          </Picker>
        </View>
                
        <TextInput
          style={styles.phoneInput}
          label="Celular"  
          onChangeText={(number) => {
            setPhoneNumber(number);
            onChange(countryCode, number);
          }}
          value={phoneNumber}          
          right={<TextInput.Icon icon="phone" color={Colors.iconInput} />}
          maxLength={10}
          keyboardType="phone-pad"
          mode="outlined"
        />
      </View>
      
      {error && <HelperText type="error">{error}</HelperText>}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeContainer: {
    flex: 0.69,  // 🔹 35% ancho
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#515255',
    
  },
  flagPicker: {
    height: 54,
  },
  pickerAndroid: {
    // 🔹 Android fix
    color: '#1F2937',
  },
  phoneInput: {
    flex: 1,     // 🔹 Resto ancho
  },
});