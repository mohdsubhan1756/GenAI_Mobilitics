import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"    // filename
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer" size={28} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Prescriptions',
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tremor"
        options={{
          title: 'Tremor',
          tabBarIcon: ({ color }) => (
            <Ionicons name="pulse" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prescription"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cloud-upload" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={28} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
