import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Platform,
  View
} from 'react-native';
import {
  Button,
  Text,
} from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import ScheduledAppointments from '@/components/ScheduledAppointments';
import { useNavigation } from '@react-navigation/native';
import Routes from '@/config/Routes';

export function CollaboratorDetail() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [userId, setUserId] = useState<string>('');

  const handleCalendar = useCallback(() => {
    navigation.navigate(Routes.Calendar);
  }, [])

  useEffect(() => {
      if (user?.uid) {
      setUserId(user.uid)
      }
  }, [user]);

  return (
    <>
      <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View>
          <Text>Collaborator Detail</Text>
        </View>
        <View>
          <Button icon="logout" mode="contained" onPress={handleCalendar} style={styles.button}>
            <Text style={{ fontSize: 20, color: '#fff', paddingVertical: 10 }}>Agendar</Text>
          </Button>
        </View>
        <ScheduledAppointments patientId={userId} />
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
    backgroundColor: '#FFF',
  },
  button: {
    marginVertical: 10,
  },  
});