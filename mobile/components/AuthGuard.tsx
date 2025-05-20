import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Protected routes (need authentication)
const PROTECTED_ROUTES = [
  'profile',
  '(tabs)', // Main feed and tabs
  'article',
  'category',
  'explore'
];

// Auth screens (accessible without authentication)
const AUTH_ROUTES = [
  'auth/login'
];

// Public routes (accessible without authentication)
const PUBLIC_ROUTES = [
  // Add any public routes here that don't need authentication
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

    // Get the current path
    const currentPath = segments.join('/');
    
    // Check if the current path is an auth path (like login)
    const isAuthRoute = AUTH_ROUTES.some(route => currentPath.includes(route));
    
    if (isAuthenticated && isAuthRoute) {
      // If user is authenticated and trying to access auth screens (like login),
      // redirect to home/feed
      router.replace('/');
      return;
    }
    
    if (!isAuthenticated && !isAuthRoute) {
      // If user is not authenticated and trying to access any non-auth route,
      // redirect to login
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