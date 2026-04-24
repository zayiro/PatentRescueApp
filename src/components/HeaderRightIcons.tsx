import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // O el paquete de iconos que prefieras
import Routes from '@/config/Routes';
import { useNavigation } from '@react-navigation/native';

const HeaderRightIcons = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.headerRightContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Notifications)}>
            <Ionicons name="notifications" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Menu)}>
            <Ionicons name="menu" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row', // Iconos en línea horizontal
    marginRight: 10,      // Espaciado del borde derecho
  },
  icon: {
    marginHorizontal: 8,  // Espacio entre los iconos
  },
});

export default HeaderRightIcons;