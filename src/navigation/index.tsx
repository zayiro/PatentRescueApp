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

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Inicio',
      },
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
      options: {
        title: 'Selecciona una fecha',
      },
    },
    AppointmentHour: {
      screen: AppointmentHour,
      options: {
        title: 'Selecciona una hora',
      },
    },
    Patient: {
      screen: Patient,
      options: {    
        title: 'Datos del paciente',
      },
    },
    Summary: {
      screen: Summary,
      options: {
        title: 'Resumen de la cita',
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: 'Perfil',
      },
    },
    ProfileSegment: {
      screen: ProfileSegment,
      options: {
        title: 'Perfil',
      },
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
      options: {
        title: 'Notificaciones',
        headerShown: true,
      },
    },
    BasicInformation: {
      screen: BasicInformation,
      options: {
        title: 'Información básica',
        headerShown: true,
      },
    },
    Address: {
      screen: Address,
      options: {
        title: 'Dirección',
        headerShown: true,
      },
    },
    MedicalInsurance: {
      screen: MedicalInsurance,
      options: {
        title: 'Identificacíon y seguro médico',
        headerShown: true,
      },
    },
    MedicalHistory: {
      screen: MedicalHistory,
      options: {
        title: 'Historial médico',
        headerShown: true,
      },
    },
    UnderlyingDiseases: {
      screen: UnderlyingDiseases,
      options: {
        title: 'Enfermedades activas',
        headerShown: true,
      },
    },
    HereditaryDiseases: {
      screen: HereditaryDiseases,
      options: {
        title: 'Enfermedades hereditarias',
        headerShown: true,
      },
    },
    Allergies: {
      screen: Allergies,
      options: {
        title: 'Alergias',
        headerShown: true,
      },
    },
    Medication: {
      screen: Medication,
      options: {
        title: 'Medicación activa',
        headerShown: true,
      },
    },
    FamilyMembers: {
      screen: FamilyMembers,
      options: {
        title: 'Miembros de la familia',
        headerShown: true,
      },
    },
    Payments: {
      screen: Payments,
      options: {
        title: 'Pagos',
        headerShown: true,
      },
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
