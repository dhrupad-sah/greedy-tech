import React from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useArticlesByCategory } from '../../hooks/useArticles';
import ArticleCard from '../../components/ArticleCard';
import { Ionicons } from '@expo/vector-icons';

// Get category color function
const getCategoryColor = (category: string) => {
  const colors = [
    '#FFD1DC', // pastel pink
    '#A2D2FF', // pastel blue
    '#CAFFBF', // pastel green
    '#FFC6FF', // pastel purple
    '#FFDEAD', // pastel orange
    '#FFFFB7', // pastel yellow
    '#E0FFFF', // light cyan
    '#D8BFD8', // thistle
  ];
  
  // Simple hash function to get consistent color for same category
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { articles, loading, error } = useArticlesByCategory(category);
  
  // Format the category name for display
  const formatCategoryName = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const handleGoBack = () => {
    router.back();
  };

  const categoryColor = getCategoryColor(category);

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
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonIcon}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{formatCategoryName(category)}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        {articles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={styles.noArticlesText}>No articles found in this category</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/explore')}>
              <Text style={styles.exploreButtonText}>Explore Other Categories</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.resultsText}>{articles.length} articles found</Text>
            <FlatList
              data={articles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ArticleCard article={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noArticlesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exploreButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  exploreButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 