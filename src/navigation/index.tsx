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
import { IconButton, useTheme } from 'react-native-paper';
import Routes from '@/config/Routes';
import { theme } from '@/config/theme'
import Colors from '@/config/Colors';
import ThankYouPage from './screens/process/ThankYouPage';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: ({ navigation }) => ({
        title: 'Inicio',
        headerRight: () => (
          <IconButton
            icon="account"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Profile)}
          />
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
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    AppointmentHour: {
      screen: AppointmentHour,
      options: ({ navigation }) => ({
        title: 'Selecciona una hora',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Patient: {
      screen: Patient,
      options: ({ navigation }) => ({
        title: 'Datos del paciente',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Summary: {
      screen: Summary,
      options: ({ navigation }) => ({
        title: 'Resumen de la cita',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Profile: {
      screen: Profile,
      options: ({ navigation }) => ({
        title: 'Perfil',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    ProfileSegment: {
      screen: ProfileSegment,
      options: ({ navigation }) => ({
        title: 'Perfil',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
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
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    BasicInformation: {
      screen: BasicInformation,
      options: ({ navigation }) => ({
        title: 'Información básica',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Address: {
      screen: Address,
      options: ({ navigation }) => ({
        title: 'Dirección',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    MedicalInsurance: {
      screen: MedicalInsurance,
      options: ({ navigation }) => ({
        title: 'Identificación y seguro médico',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    MedicalHistory: {
      screen: MedicalHistory,
      options: ({ navigation }) => ({
        title: 'Historial médico',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    UnderlyingDiseases: {
      screen: UnderlyingDiseases,
      options: ({ navigation }) => ({
        title: 'Enfermedades activas',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    HereditaryDiseases: {
      screen: HereditaryDiseases,
      options: ({ navigation }) => ({
        title: 'Enfermedades hereditarias',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Allergies: {
      screen: Allergies,
      options: ({ navigation }) => ({
        title: 'Alergias',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Medication: {
      screen: Medication,
      options: ({ navigation }) => ({
        title: 'Medicación actual',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    FamilyMembers: {
      screen: FamilyMembers,
      options: ({ navigation }) => ({
        title: 'Miembros de la familia',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Payments: {
      screen: Payments,
      options: ({ navigation }) => ({
        title: 'Pagos',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    Doctors: {
      screen: Doctors,
      options: ({ navigation }) => ({
        title: 'Doctores',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
        ),
      }),
    },
    ThankYouPage: {
      screen: ThankYouPage,
      options: ({ navigation }) => ({
        title: 'Reserva confirmada',
        headerRight: () => (
          <IconButton
            icon="home"
            iconColor={Colors.SlateGray}
            size={28}
            onPress={() => navigation.navigate(Routes.Home)}
          />
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
