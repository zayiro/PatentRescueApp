import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import ScheduledAppointments from '@/components/ScheduledAppointments';

export function Appointments() {
  const { user } = useAuth();

  const [userId, setUserId] = useState<string>('');

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
});