import React, { useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Text, View, Dimensions, ViewToken, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useArticles } from '../../hooks/useArticles';
import ArticleCard from '../../components/ArticleCard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

// Get screen dimensions
const { height, width } = Dimensions.get('window');

export default function FeedScreen() {
  const { articles, loading, error } = useArticles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isAuthenticated } = useAuth();

  // Handle viewable items change
  const onViewableItemsChanged = React.useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  // Navigate to categories
  const navigateToCategories = () => {
    router.push('/explore');
  };

  // Navigate to profile or login
  const navigateToProfile = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/auth/login');
    }
  };

  // FlatList view config
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0066cc" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Greedy Tech</Text>
      </View>
      
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.fullScreenArticle}>
            <ArticleCard article={item} fullScreen />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        snapToInterval={height - 60} // account for header
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {articles.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot, 
              index === currentIndex ? styles.progressDotActive : null
            ]} 
          />
        ))}
      </View>

      {/* Floating Categories Button */}
      <TouchableOpacity 
        style={styles.categoriesButton}
        onPress={navigateToCategories}
        activeOpacity={0.8}
      >
        <Ionicons name="grid" size={24} color="#555" />
      </TouchableOpacity>

      {/* Floating Profile Button */}
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={navigateToProfile}
        activeOpacity={0.8}
      >
        <Ionicons name="person-circle-outline" size={24} color="#555" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#dd3333',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fullScreenArticle: {
    height: height - 60, // account for header
    width: '100%',
  },
  categoriesButton: {
    position: 'absolute',
    right: 20,
    top: 70,
    backgroundColor: '#f2f2f2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileButton: {
    position: 'absolute',
    right: 20,
    top: 130, // positioned below the categories button
    backgroundColor: '#f2f2f2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  progressContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
    flexDirection: 'row',
    zIndex: 100,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginRight: 6,
  },
  progressDotActive: {
    backgroundColor: '#0066cc',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
