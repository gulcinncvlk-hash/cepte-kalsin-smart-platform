import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GamificationScreen from '../screens/GamificationScreen';
import AskidaUrunScreen from '../screens/AskidaUrunScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.ink4,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: 'rgba(0,0,0,0.06)',
          paddingBottom: 24,
          paddingTop: 6,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '800',
          letterSpacing: 0.3,
        },
        tabBarIcon: () => {
          const icons: Record<string, string> = {
            Home: '🏠',
            Map: '🗺️',
            Askida: '🤝',
            Gamification: '🏆',
            Favorites: '❤️',
            Notifications: '🔔',
            Profile: '👤',
          };
          return <Text style={{ fontSize: 18 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Ana Sayfa' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Harita' }} />
      <Tab.Screen name="Askida" component={AskidaUrunScreen} options={{ tabBarLabel: 'Askıda' }} />
      <Tab.Screen name="Gamification" component={GamificationScreen} options={{ tabBarLabel: 'Rozetler' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: 'Favoriler' }} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarLabel: 'Bildirimler', tabBarBadge: 3 }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}