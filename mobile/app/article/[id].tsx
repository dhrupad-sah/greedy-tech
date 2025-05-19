import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useArticle } from '../../hooks/useArticles';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Format date to readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Get random pastel color for category badge
const getCategoryColor = (category: string) => {
  const colors = [
    '#FFD1DC', // pastel pink
    '#A2D2FF', // pastel blue
    '#CAFFBF', // pastel green
    '#FFC6FF', // pastel purple
    '#FFDEAD', // pastel orange
    '#FFFFB7', // pastel yellow
  ];
  
  // Simple hash function to get consistent color for same category
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { article, loading, error } = useArticle(id);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Article not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryColor = getCategoryColor(article.category);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButtonIcon}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Article Content */}
          <View style={styles.contentContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
            </View>
            
            <Text style={styles.title}>{article.title}</Text>
            
            <View style={styles.metaInfo}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <Text style={styles.dateText}>{formatDate(article.createdAt)}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.content}>{article.content}</Text>
            
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Related Topics</Text>
              <View style={styles.relatedButtonsContainer}>
                <TouchableOpacity
                  style={styles.relatedButton}
                  onPress={() => router.push(`/category/${article.category}`)}
                >
                  <Text style={styles.relatedButtonText}>More in {article.category}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#555" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.relatedButton}
                  onPress={() => router.push('/')}
                >
                  <Text style={styles.relatedButtonText}>Back to Feed</Text>
                  <Ionicons name="home" size={16} color="#555" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    lineHeight: 38,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
    width: '100%',
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    color: '#444',
    marginBottom: 30,
  },
  relatedSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  relatedButtonsContainer: {
    gap: 12,
  },
  relatedButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
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
  },
}); 