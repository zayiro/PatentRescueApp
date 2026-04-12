import axios from 'axios';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';

interface DoctorFilters {
  consultationType: number;
  specialtyId: number;
  search?: string;
}

interface Doctor {
  id: number;
  name: string;
  specialties: number[];
  address?: Array<{ id: number; name: string; location: string }>;
  photo: string;
  rating: number;
  availableSlots: number;
  consultationTypes: number[];
}

const doctors: Doctor[] = [
  {
      id: 1,
      name: 'Dra. Ana López',
      specialties: [1, 2],
      address: [
        { id: 1, name: 'Clínica Central', location: 'Calle 123 # 45-67' },
        { id: 2, name: 'Consultorio Privado', location: 'Avenida 89 # 12-34' },
        { id: 3, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },   
        { id: 4, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },   
        { id: 5, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },   
        { id: 6, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },   
        { id: 7, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },   
        { id: 8, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },        
      ],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.9,
      availableSlots: 5,
      consultationTypes: [1, 2],
  },
  {
      id: 2,
      name: 'Dr. Carlos Ruiz',
      specialties: [1, 2],
      address: [
        { id: 1, name: 'Clínica Central', location: 'Calle 123 # 45-67' },
        { id: 2, name: 'Consultorio Privado', location: 'Avenida 89 # 12-34' },
        { id: 3, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },        
      ],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.7,
      availableSlots: 3,
      consultationTypes: [1, 2],
  },
  {
      id: 3,
      name: 'Dr. isabel molina',
      specialties: [1, 2],
      address: [
        { id: 1, name: 'Clínica Central', location: 'Calle 123 # 45-67' },
        { id: 2, name: 'Consultorio Privado', location: 'Avenida 89 # 12-34' },
        { id: 3, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },        
      ],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.7,
      availableSlots: 3,
      consultationTypes: [1, 2],
  },
  {
      id: 4,
      name: 'Dr. jhoan castro',
      specialties: [1, 2],
      address: [
        { id: 1, name: 'Clínica Central', location: 'Calle 123 # 45-67' },
        { id: 2, name: 'Consultorio Privado', location: 'Avenida 89 # 12-34' },
        { id: 3, name: 'Clinica inbanaco', location: 'Carrera 7E # 70-134' },        
      ],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.7,
      availableSlots: 3,
      consultationTypes: [1, 2],
  },
];

export const useDoctorsFilter = (
  consultationType: DoctorFilters['consultationType'],
  specialtyId: DoctorFilters['specialtyId'],
  search: DoctorFilters['search']
) => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const API_URL = 'https://tu-api.com/api/doctores.php';

  const cargarDoctores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?specialtyId=${specialtyId}`);
      
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Error doctores:', error);
      Alert.alert('Error', 'No se pudieron cargar los doctores');
    } finally {
      setLoading(false);
    }
  }, [specialtyId]);
  
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const result1 = doctor.specialties.includes(specialtyId);
      if (!result1) return false;

      const result2 =  doctor.consultationTypes.includes(consultationType);
      if (!result2) return false;

      return true;
    });
  }, [consultationType, specialtyId]);

  return {
    doctors: filteredDoctors,
    total: filteredDoctors.length,
    loading: false,
  };
};