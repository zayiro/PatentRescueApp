import React, { useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
} from 'react-native';
import { Badge, IconButton } from 'react-native-paper';
import dayjs from 'dayjs';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  time: string;
  read: boolean;
}

export function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Cita confirmada',
            message: 'Tu cita con Dra. Ana - 15/10 14:00',
            type: 'success',
            time: '2 min',
            read: false,
        },
        {
            id: '2',
            title: 'Recordatorio',
            message: 'Cita en 1 hora',
            type: 'warning',
            time: '1h',
            read: false,
        },
        {
            id: '3',
            title: 'Mensaje nuevo',
            message: 'Dra. Ana respondió',
            type: 'info',
            time: '3h',
            read: true,
        },
    ]);

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            success: '#10B981',
            warning: '#F59E0B',
            info: '#3B82F6',
            error: '#EF4444',
        };
        return colors[type] || '#6B7280';
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            success: '✓',
            warning: '⚠',
            info: 'ℹ',
            error: '✕',
        };
        return icons[type] || '•';
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
        prev.map(n => 
            n.id === id ? { ...n, read: true } : n
        )
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[
                styles.notification,
                !item.read && styles.unread,
            ]}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.9}
        >
        {/* 🔹 Icono tipo */}
        <View style={[styles.icon, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.iconText}>{getTypeIcon(item.type)}</Text>
        </View>
        
        {/* 🔹 Contenido */}
        <View style={styles.content}>
            <Text style={[styles.title, !item.read && styles.titleUnread]}>
            {item.title}
            </Text>
            <Text style={styles.message}>{item.message}</Text>
        </View>
        
        {/* 🔹 Time + Actions */}
        <View style={styles.rightSection}>
            <Text style={styles.time}>{item.time}</Text>
            <IconButton
            icon="delete"
            size={18}
            iconColor="#EF4444"
            onPress={(e) => {
                e.stopPropagation();
                deleteNotification(item.id);
            }}
            />
        </View>
        </TouchableOpacity>
    );

  return (
    <>
        <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >           
                            
            {/* 🔹 Lista */}
            <FlatList
                nestedScrollEnabled={true}
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            
        </KeyboardAvoidingView>
    </>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 50,
    backgroundColor: '#FFF',
  },
  badge: {
    backgroundColor: '#EF4444',
  },
  list: {
    flex: 1,
    paddingTop: 10,
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  titleUnread: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  separator: {
    height: 8,
    backgroundColor: '#F9FAFB',
  },
});