// components/TimeSlotsFlatList.tsx
import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface Props {
  onSelect: (time: string) => void;
  selectedTime?: string;
}

export default function TimeSlotsFlatList({ onSelect, selectedTime }: Props) {
  // 🔹 Horarios cada 30min (9:00-18:00)
  const slots = Array.from({ length: 18 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={slots}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.slot,
              item === selectedTime && styles.slotSelected,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text style={[
              styles.slotText,
              item === selectedTime && styles.slotTextSelected,
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  list: {
    gap: 12,
  },
  slot: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    minWidth: 70,
    alignItems: 'center',
  },
  slotSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  slotText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  slotTextSelected: {
    color: 'white',
  },
});