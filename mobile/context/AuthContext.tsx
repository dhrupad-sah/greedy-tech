import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../constants/Environment';

// Define user type
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOTP: (email: string) => Promise<{ success: boolean; message: string; devOtp?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  sendOTP: async () => ({ success: false, message: 'Not implemented' }),
  verifyOTP: async () => false,
  logout: async () => {},
});

// Storage key
const USER_STORAGE_KEY = 'user_data';

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user data on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (userString) {
          const userData = JSON.parse(userString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Send OTP to email
  const sendOTP = async (email: string): Promise<{ success: boolean; message: string; devOtp?: string }> => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, { email });
      
      if (response.data.success) {
        // Check if we're in development mode with OTP in response
        if (response.data.devOtp) {
          console.log(`Development OTP: ${response.data.devOtp}`);
          
          return { 
            success: true, 
            message: 'For development: Use this OTP to login', 
            devOtp: response.data.devOtp 
          };
        }
        
        return { 
          success: true, 
          message: 'OTP sent to your email' 
        };
      }
      
      return { 
        success: false, 
        message: response.data.error || 'Failed to send OTP' 
      };
    } catch (error) {
      console.error('Failed to send OTP', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.error || 'Server error' 
        };
      }
      
      return { 
        success: false, 
        message: 'Network error' 
      };
    }
  };

  // Verify OTP
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { 
        email, 
        otp 
      });
      
      if (response.data.success && response.data.user) {
        // Save user to storage
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to verify OTP', error);
      return false;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        sendOTP,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 