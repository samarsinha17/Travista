import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function Index() {
  useFrameworkReady();

  useEffect(() => {
    // Add a small delay to ensure the router is fully ready
    const timer = setTimeout(() => {
      // Check if user has completed onboarding
      // For MVP, we'll redirect to onboarding
      // In production, check AsyncStorage or user preferences
      const hasCompletedOnboarding = false;
      
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component just handles routing
}
