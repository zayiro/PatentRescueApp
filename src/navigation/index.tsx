import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './screens/Home';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { Profile } from './screens/profile/Profile';
import { Settings } from './screens/Settings';
import { NotFound } from './screens/NotFound';
import Specialties from './screens/process/Specialties';
import Calendar from './screens/process/Calendar';
import AppointmentHour from './screens/process/AppointmentHour';
import Patient from './screens/process/Patient';
import Summary from './screens/process/Summary';
import { Notifications } from './screens/Notifications';
import Payments from './screens/process/Payments';
import { BasicInformation } from './screens/profile/BasicInformation';
import { FamilyMembers } from './screens/profile/FamilyMembers';
import { ProfileSegment } from './screens/profile/ProfileSegment';
import { Address } from './screens/profile/Address';
import { MedicalHistory } from './screens/profile/MedicalHistory';
import { UnderlyingDiseases } from './screens/profile/UnderlyingDiseases';
import { HereditaryDiseases } from './screens/profile/HereditaryDiseases';
import { Allergies } from './screens/profile/Allergies';
import { Medication } from './screens/profile/Medication';
import { MedicalInsurance } from './screens/profile/MedicalInsurance';
import Doctors from './screens/process/Doctors';
import { Icon, IconButton, useTheme } from 'react-native-paper';
import Routes from '@/config/Routes';
import { theme } from '@/config/theme'
import Colors from '@/config/Colors';
import ThankYouPage from './screens/process/ThankYouPage';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Appointments } from './screens/Appointments';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: ({ navigation }) => ({
        title: 'Inicio',
        headerRight: () => (         
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Profile)}>
            <Icon
              source="account"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity> 
        ),
      }),
    },
    Login: {
      screen: Login,
      options: {
        title: 'Login',
      },
    },
    Register: {
      screen: Register,
      options: {
        title: 'Crear cuenta',
      },
    },
    Specialties: {
      screen: Specialties,
      options: {
        title: 'Especialidades',
      },
    },
    Calendar: {
      screen: Calendar,
      options: ({ navigation }) => ({
        title: 'Selecciona una fecha',
        headerRight: () => (          
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    AppointmentHour: {
      screen: AppointmentHour,
      options: ({ navigation }) => ({
        title: 'Selecciona una hora',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Patient: {
      screen: Patient,
      options: ({ navigation }) => ({
        title: 'Datos del paciente',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Summary: {
      screen: Summary,
      options: ({ navigation }) => ({
        title: 'Resumen de la cita',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Profile: {
      screen: Profile,
      options: ({ navigation }) => ({
        title: 'Perfil',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    ProfileSegment: {
      screen: ProfileSegment,
      options: ({ navigation }) => ({
        title: 'Perfil',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Settings: {
      screen: Settings,
      options: {
        title: 'Crear cuenta',
        headerShown: false,
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: 'Crear cuenta',
        headerShown: false,
      },
    },
    Notifications: {
      screen: Notifications,
      options: ({ navigation }) => ({
        title: 'Notificaciones',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    BasicInformation: {
      screen: BasicInformation,
      options: ({ navigation }) => ({
        title: 'Información básica',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Address: {
      screen: Address,
      options: ({ navigation }) => ({
        title: 'Dirección',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    MedicalInsurance: {
      screen: MedicalInsurance,
      options: ({ navigation }) => ({
        title: 'Identificación y seguro médico',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    MedicalHistory: {
      screen: MedicalHistory,
      options: ({ navigation }) => ({
        title: 'Historial médico',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    UnderlyingDiseases: {
      screen: UnderlyingDiseases,
      options: ({ navigation }) => ({
        title: 'Enfermedades activas',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    HereditaryDiseases: {
      screen: HereditaryDiseases,
      options: ({ navigation }) => ({
        title: 'Enfermedades hereditarias',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Allergies: {
      screen: Allergies,
      options: ({ navigation }) => ({
        title: 'Alergias',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Medication: {
      screen: Medication,
      options: ({ navigation }) => ({
        title: 'Medicación actual',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    FamilyMembers: {
      screen: FamilyMembers,
      options: ({ navigation }) => ({
        title: 'Miembros de la familia',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Payments: {
      screen: Payments,
      options: ({ navigation }) => ({
        title: 'Pagos',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Doctors: {
      screen: Doctors,
      options: ({ navigation }) => ({
        title: 'Doctores',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    ThankYouPage: {
      screen: ThankYouPage,
      options: ({ navigation }) => ({
        title: 'Reserva confirmada',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Home)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
    Appointments: {
      screen: Appointments,
      options: ({ navigation }) => ({
        title: 'Citas Programadas',
        headerRight: () => (
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate(Routes.Appointments)}>
            <Icon
              source="home"
              color={Colors.SlateGray}
              size={28}              
            />
          </TouchableOpacity>
        ),
      }),
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
