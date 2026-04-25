import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const HorizontalPatientReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const reviews = [
    {
      id: '1',
      patientName: 'María González',
      avatar: 'https://ui-avatars.com/api/?name=María+González&size=64&background=4F46E5',
      rating: 5,
      comment: '¡Excelente atención médica!',
      verified: true,
    },
    {
      id: '2',
      patientName: 'Juan Pérez',
      avatar: 'https://ui-avatars.com/api/?name=Juan+Pérez&size=64&background=10B981',
      rating: 4,
      comment: 'Muy profesional y puntual',
      verified: true,
    },
    {
      id: '3',
      patientName: 'Ana López',
      avatar: 'https://ui-avatars.com/api/?name=Ana+López&size=64&background=EF4444',
      rating: 5,
      comment: 'Me salvó la vida, gracias',
      verified: false,
    },
    {
      id: '4',
      patientName: 'Carlos Ruiz',
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Ruiz&size=64&background=F59E0B',
      rating: 5,
      comment: 'Trato excelente',
      verified: true,
    },
    {
      id: '5',
      patientName: 'Lucía Martínez',
      avatar: 'https://ui-avatars.com/api/?name=Lucía+Martínez&size=64&background=8B5CF6',
      rating: 4,
      comment: 'Muy recomendada',
      verified: true,
    },
  ];

  const onScroll = (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (screenWidth * 0.85));
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text
          key={i}
          style={[
            styles.star,
            { color: i < rating ? '#FFD700' : '#E5E7EB' },
          ]}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  const renderReviewCard = ({ item }: {item:any}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
        </View>
      </View>
      
      <Text style={styles.comment} numberOfLines={2}>
        "{item.comment}"
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opiniones de Pacientes</Text>
      
      {/* FlatList Horizontal */}
      <FlatList
        ref={flatListRef}
        data={reviews}
        renderItem={renderReviewCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={screenWidth * 0.85}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: screenWidth * 0.85,
          offset: screenWidth * 0.85 * index,
          index,
        })}
        contentContainerStyle={styles.listContainer}
      />

      {/* Paginación */}
      <View style={styles.pagination}>
        {reviews.map((_, index) => (
          <TouchableOpacity key={index}>
            <View
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
    paddingLeft: 0
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 24,
  },
  listContainer: {
    paddingRight: screenWidth * 0.15,
  },
  card: {
    width: screenWidth * 0.85,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 10
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  comment: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
    transform: [{ scale: 1.3 }],
  },
});

export default HorizontalPatientReviews;