// hooks/useAppointmentStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const APPOINTMENT_KEY = '@appointment:draft';

interface AppointmentData {
  appointmentType: string;
  specialty: any;
  doctorId: string;
  selectedDate: string;
  selectedTime: string;  
  patientData: {
    name: string;
    userId: string;
    description: string;
  };
  status: 'draft' | 'confirmed' | 'completed';
  createdAt: string;
}

export const useAppointmentStorage = () => {
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar desde AsyncStorage
  const loadAppointment = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(APPOINTMENT_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setAppointment(parsed);
      }
    } catch (error) {
      console.error('Error loading appointment:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Guardar en AsyncStorage
  const saveAppointment = useCallback(async (data: Partial<AppointmentData>) => {
    try {
      const newData = {
        ...appointment,
        ...data,
        createdAt: new Date().toISOString(),
        status: data.status || 'draft',
      };
      
      setAppointment(newData as AppointmentData);
      await AsyncStorage.setItem(APPOINTMENT_KEY, JSON.stringify(newData));
      //console.log('✅ Appointment guardado:', newData);
    } catch (error) {
      //console.error('Error saving appointment:', error);
    }
  }, [appointment]);

  // 🔹 Limpiar draft
  const clearAppointment = useCallback(async () => {
    setAppointment(null);
    await AsyncStorage.removeItem(APPOINTMENT_KEY);
  }, []);

  // 🔹 Cargar al montar
  useEffect(() => {
    loadAppointment();
  }, [loadAppointment]);

  return {
    appointment,
    loading,
    saveAppointment,
    clearAppointment,
    loadAppointment,
  };
};