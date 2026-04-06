// utils/dateUtils.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';

// 🔹 Plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

export const TIMEZONES = {
  COLOMBIA_BOGOTA: 'America/Bogota',
} as const;

export type TimeZone = typeof TIMEZONES[keyof typeof TIMEZONES];

export const formatDateTime = (
  date: string | Date,
  timezone: TimeZone = TIMEZONES.COLOMBIA_BOGOTA,
  format: string = 'DD/MM/YYYY HH:mm'
): string => {
  return dayjs(date).tz(timezone).locale('es').format(format);
};

export const formatDate = (
  date: string | Date,
  timezone: TimeZone = TIMEZONES.COLOMBIA_BOGOTA,
  format: string = 'dddd, D [de] MMMM [de] YYYY'
): string => {
  return dayjs(date).tz(timezone).locale('es').format(format);
};