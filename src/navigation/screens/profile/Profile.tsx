import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  View,
  Platform,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  Text,
  List,
  IconButton,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Colors from '@/config/Colors';
import { getUserData } from '@/service/firestore';
import { useAuth } from '@/hooks/useAuth';
import { IMAGE } from '@/assets';
import Routes from '@/config/Routes';
import LoadingSpinner from '@/components/LoadingSpinner';
import { theme } from '@/config/theme'

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  routeItem: any;
}

export function Profile() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);  
  const [firstName, setFirstName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<any>();

  const onUserData = useCallback( async(userId: string) => {
      const result: any = await getUserData(userId)
      
      setLoading(true)
      if (result) {
        setFirstName(result.firstName || '');
        setPhotoURL(result.photoURL || '')
      }
      setLoading(false)
    }, []);  
    
    useEffect(() => {
      if (user?.uid) {
        onUserData(user.uid)
      }
    }, [user, onUserData]);

   const items = [
      { id: 'medicalInformation', name: 'Información médica', icon: 'heart', color: theme.colors.primary, routeItem: Routes.ProfileSegment },
      { id: 'familyMembers', name: 'Miembros de la familia', icon: 'account', color: theme.colors.primary, routeItem: Routes.FamilyMembers },
    ];

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={() => navigation.navigate(item.routeItem)}>
      {/* 🔹 Icono Izquierda */}
      <List.Icon color={item.color} icon={item.icon} />
      
      <View style={styles.textContainer}>
        {/* 🔹 Nombre Centro */}
        <List.Item
          title={item.name}
          titleStyle={styles.title}
          description="Toca para abrir"
          descriptionStyle={styles.description}
        />
      </View>
      
      
      {/* 🔹 Flecha Derecha */}
      <IconButton icon="chevron-right" size={20} iconColor={Colors.Gray400} />
    </TouchableOpacity>
  );

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
                <Text style={{ marginVertical: 5 }}>{firstName}</Text>
              </View>

              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <Divider />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
              />    
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
    paddingHorizontal: 15,
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