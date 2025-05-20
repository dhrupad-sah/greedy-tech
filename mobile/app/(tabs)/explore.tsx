import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../../hooks/useArticles';

// Define icon mapping for categories
const categoryIcons: Record<string, {icon: string, color: string}> = {
  'technology': { icon: 'hardware-chip', color: '#FFD1DC' },
  'mobile': { icon: 'phone-portrait', color: '#FFD1DC' },
  'tech': { icon: 'hardware-chip', color: '#A2D2FF' },
  'web': { icon: 'globe', color: '#A2D2FF' },
  'ai': { icon: 'brain', color: '#CAFFBF' },
  'artificial intelligence': { icon: 'brain', color: '#CAFFBF' },
  'devops': { icon: 'server', color: '#FFC6FF' },
  'programming': { icon: 'code-slash', color: '#FFDEAD' },
  'data': { icon: 'analytics', color: '#FFFFB7' },
  'cloud': { icon: 'cloud', color: '#E0FFFF' },
  'security': { icon: 'shield', color: '#D8BFD8' },
  'apple': { icon: 'logo-apple', color: '#E0E0E0' },
  'gaming': { icon: 'game-controller', color: '#FFA07A' },
  'devices': { icon: 'desktop', color: '#87CEFA' },
  'apps': { icon: 'apps', color: '#98FB98' },
  'software': { icon: 'code-working', color: '#FFB6C1' },
  'science': { icon: 'flask', color: '#B0E0E6' },
  'gadgets': { icon: 'watch', color: '#F0E68C' },
  'verge': { icon: 'newspaper', color: '#FFD1DC' },
  'wired': { icon: 'wifi', color: '#A2D2FF' },
  // Default for any other category
  'default': { icon: 'library', color: '#CCCCCC' }
};

// Get icon and color for a category
const getCategoryVisuals = (category: string) => {
  const normalizedCategory = category.toLowerCase();
  
  // Check for exact match
  if (categoryIcons[normalizedCategory]) {
    return categoryIcons[normalizedCategory];
  }
  
  // Check for partial match
  for (const key of Object.keys(categoryIcons)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return categoryIcons[key];
    }
  }
  
  // Return default
  return categoryIcons.default;
};

// Format category name for display
const formatCategoryName = (category: string): string => {
  // Capitalize first letter of each word
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function ExploreScreen() {
  const { categories, loading, error } = useCategories();
  
  const handleCategoryPress = (category: string) => {
    router.push(`/category/${encodeURIComponent(category)}`);
  };

  const handleBackToFeed = () => {
    router.push('/');
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
          onPress={() => router.replace('/explore')}
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToFeed}
        >
          <Ionicons name="home-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => {
            const { icon, color } = getCategoryVisuals(category);
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryCard, { backgroundColor: color + '30' }]} // 30 is hex for 19% opacity
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                  <Ionicons name={icon as any} size={28} color="#555" />
                </View>
                <Text style={styles.categoryName}>{formatCategoryName(category)}</Text>
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={16} color="#888" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Reading Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color="#555" style={styles.tipIcon} />
            <Text style={styles.tipText}>Swipe up in the feed to see the next article</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="bookmark-outline" size={24} color="#555" style={styles.tipIcon} />
            <Text style={styles.tipText}>Tap "Read Full Article" to see the complete content</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="open-outline" size={24} color="#555" style={styles.tipIcon} />
            <Text style={styles.tipText}>Original articles from The Verge and Wired are just a tap away</Text>
          </View>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  categoriesGrid: {
    marginBottom: 30,
  },
  categoryCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  arrowContainer: {
    padding: 4,
  },
  tipsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  tipIcon: {
    marginRight: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
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
});
