import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Protected routes (need authentication)
const PROTECTED_ROUTES = [
  'profile',
];

// Auth screens (should redirect to home if already authenticated)
const AUTH_ROUTES = [
  'auth/login',
];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const segment = segments.join('/');
    
    // If the user is authenticated and trying to access auth screens,
    // redirect to home
    if (isAuthenticated && AUTH_ROUTES.some(route => segment.includes(route))) {
      router.replace('/');
      return;
    }
    
    // If user is not authenticated and trying to access protected routes,
    // redirect to login
    if (!isAuthenticated && PROTECTED_ROUTES.some(route => segment.includes(route))) {
      router.replace('/auth/login');
      return;
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthGuard; 