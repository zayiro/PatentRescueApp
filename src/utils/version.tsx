// utils/version.ts
import Constants from 'expo-constants';

export const appVersion = Constants.expoConfig?.version || '1.0.0';
export const appName = Constants.expoConfig?.name || 'Dr. IA';