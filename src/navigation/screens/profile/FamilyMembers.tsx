import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  View,
  Alert,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  Button,
  RadioButton,
  TextInput,
  Text,
  Menu, 
  List,
  IconButton,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/config/Colors';
import { getUserData, updateDocumentCollection, updateProfileUser } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { IMAGE } from '@/assets';
import { NameCollection } from '@/enums/NameCollection';
import { UserDataType } from '@/type/UserDataType';
import Routes from '@/config/Routes';
import LoadingSpinner from '@/components/LoadingSpinner';

export function FamilyMembers() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<any>();

  const onUserData = useCallback( async(userId: string) => {
    try {
      setLoading(true);

      const result: any = await getUserData(userId)
      if (result) {
        setFirstName(result.firstName || '');
        setPhotoURL(result.photoURL || '')
      }      
    } catch (error) {
      Alert.alert("Error: datos no cargados");
      return false
    } finally {
      setLoading(false);
    }
  }, []);  
    
  useEffect(() => {
    if (user?.uid) {
      onUserData(user.uid)
    }
  }, [user, onUserData]);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {loading ? (            
            <>
              <View>
                <LoadingSpinner message="Cargando..." />
              </View>
            </>
          )
        :
          (
            <>
              <View style={[styles.avatar, { marginBottom: 10 }]}>
                <Image
                  source={
                    photoURL
                    ? { uri: photoURL }
                    : IMAGE.avatar
                  }
                  resizeMode="cover"
                  style={styles.img}
                />
              </View>
   
            </>
          )}  
      </KeyboardAvoidingView>    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
    backgroundColor: Colors.White
  },
  textContainer: {
    flex: 1,                    // 🔹 OCUPA RESTO ESPACIO
    justifyContent: 'center',
  },
  list: {
    backgroundColor: Colors.White,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    color: Colors.SlateGray,
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center',
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "#eee",
  },
});