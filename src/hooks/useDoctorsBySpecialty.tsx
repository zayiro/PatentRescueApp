// hooks/useDoctorsBySpecialty.ts
import { useState, useEffect } from 'react';

interface DoctorFilters {
  specialtyId?: string;
  search?: string;
  rating?: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  specialtyName: string;
  photo: string;
  rating: number;
  availableSlots: number;
  price: number;
}

export const useDoctorsBySpecialty = (filters: DoctorFilters) => {
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const doctors: Doctor[] = [
    {
        id: 'doc1',
        name: 'Dra. Ana López',
        specialtyId: 'general',
        specialtyName: 'Medicina General',
        photo: 'https://example.com/ana.jpg',
        rating: 4.9,
        availableSlots: 5,
        price: 35000,
    },
    {
        id: 'doc2',
        name: 'Dr. Carlos Ruiz',
        specialtyId: 'cardio',
        specialtyName: 'Cardiología',
        photo: 'https://example.com/carlos.jpg',
        rating: 4.7,
        availableSlots: 3,
        price: 50000,
    },
];

  useEffect(() => {
    setLoading(true);
               
    setFilteredDoctors(doctors);
    setLoading(false);
  }, []);

  return { filteredDoctors, loading };
};