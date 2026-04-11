import Colors from '@/config/Colors';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

interface StarRatingProps {
  rating?: number;
  size?: number;
}

export default function StarRating({
  rating = 0,
  size = 12,
}: StarRatingProps) {
    return(
        <View style={styles.starsContainer}>
            {Array(5)
            .fill(0)
            .map((_, index) => {
                const starFilled = index < rating;
                return (
                    <IconButton
                        key={index}
                        icon={starFilled ? 'star' : 'star-outline'}
                        size={size}
                        iconColor={starFilled ? Colors.Violet : Colors.Gray400}
                        style={[styles.noGapStar]}
                    />
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: 'row',   
    width: 100    
  },
  star: {
    
  },
  noGapStar: {
    padding: 0,                      // 🔹 Sin padding
    margin: 0,                       // 🔹 Sin margen
    width: 20,                     // 🔹 Ancho fijo
    height: 20,                    // 🔹 Altura fijo    
  },
  filledStar: {
    backgroundColor: 'transparent',
  },
  ratingChips: {
    flexDirection: 'row',
  },
  ratingChip: {
    height: 15,
    marginRight: 1,
  },
  ratingChipFilled: {
    backgroundColor: Colors.Teal,
  },
  chipText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  ratingProgress: {
    alignItems: 'center',
  },
  ratingBar: {
    width: 100,
    height: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
});