// components/SimpleCalendar.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface Props {
  onDateSelect: (date: string) => void;
}

export default function SimpleCalendar({ onDateSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    onDateSelect(day.dateString);
  };

  LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
      ],
      monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      dayNames: ['D','L','M','X','J','V','S'],
      dayNamesShort: ['D','L','M','X','J','V','S'],
      today: "Hoy"
  };

  LocaleConfig.defaultLocale = 'es'

  return (
    <View style={styles.container}>
      <Calendar
        current={'2026-03-31'}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { 
            selected: true, 
            selectedColor: '#007AFF' 
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: 'white',
          todayTextColor: '#10B981',
        }}
        minDate={dayjs().format('YYYY-MM-DD')}
      />
      
      {selectedDate && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedDate}>
            {dayjs(selectedDate).format('dddd, D [de] MMMM')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  selectedInfo: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    height: 30,
  },
});