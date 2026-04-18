// hooks/useDoctorsFilter.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

const API_URL = 'https://esdecali.com/truedoctor/api/doctors.php';

interface Doctor {
  id: number;
  name: string;
  specialties: number[];
  address?: Array<{ id: number; name: string; location: string }>;
  photo: string;
  rating: number;
  availableSlots: number;
  consultationTypes: number[];
  services?: string[];
}

export const useDoctorsFilter = (consultationType: number, specialtyId: number, search: string) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // 🔄 Cargar doctores inicial
  const loadDoctors = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        specialtyId,
        consultationType,
        page,
        limit: 10,
        ...(search && { doctorName: search }),
      };
      
      const response = await axios.get(API_URL, { 
        params, 
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
          // 'Authorization': `Bearer ${token}`, // Si usas auth
        },
        timeout: 10000 
      });

      const data = response.data;
      
      if (data.success) {
        if (page === 1) {
          setDoctors(data.doctors);
        } else {
          setDoctors(prev => [...prev, ...data.doctors]);
        }
        
        setTotalPaginas(data.total_pages || 1);
      }
    } catch (err) {
      setLoading(false);
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message 
        ? err.response.data.message 
        : 'Error de conexión';
      Alert.alert('Error', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [specialtyId]);

  // Inicial
  useEffect(() => {
    if (!specialtyId || !consultationType) return;

    loadDoctors(1);
  }, [specialtyId, consultationType]);

  return {
    doctors,
    loading,
    puedeCargarMas: pagina < totalPaginas,
    error,
    refreshing,
  };
};