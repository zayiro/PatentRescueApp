import { useState, useEffect, useMemo } from 'react';

interface DoctorFilters {
  consultationType: number;
  specialtyId: number;
  search?: string;
}

interface Doctor {
  id: number;
  name: string;
  specialties: number[];
  photo: string;
  rating: number;
  availableSlots: number;
  price: number;
  consultationTypes: number[];
}

const doctors: Doctor[] = [
  {
      id: 1,
      name: 'Dra. Ana López',
      specialties: [1, 2],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.9,
      availableSlots: 5,
      price: 35000,
      consultationTypes: [1, 2],
  },
  {
      id: 2,
      name: 'Dr. Carlos Ruiz',
      specialties : [1, 2],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.7,
      availableSlots: 3,
      price: 50000,
      consultationTypes: [1, 2],
  },
  {
      id: 3,
      name: 'Dr. isabel molina',
      specialties: [1, 2],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.7,
      availableSlots: 3,
      price: 50000,
      consultationTypes: [1, 2],
  },
  {
      id: 4,
      name: 'Dr. jhoan castro',
      specialties: [1, 2],
      photo: 'https://i.pravatar.cc/300',
      rating: 4.7,
      availableSlots: 3,
      price: 50000,
      consultationTypes: [1, 2],
  },
];

export const useDoctorsFilter = (
  consultationType: DoctorFilters['consultationType'],
  specialtyId: DoctorFilters['specialtyId'],
  search: DoctorFilters['search']
) => {
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