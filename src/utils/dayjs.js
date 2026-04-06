// utils/dayjs.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es'; // Español

// 🔹 Extender plugins
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale('es'); // Español global

export default dayjs;