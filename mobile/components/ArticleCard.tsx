import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Article } from '../api/articles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type ArticleCardProps = {
  article: Article;
  fullScreen?: boolean;
};

// Format date to readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
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

const ArticleCard: React.FC<ArticleCardProps> = ({ article, fullScreen = false }) => {
  const handlePress = () => {
    router.push(`/article/${article.id}`);
  };

  if (fullScreen) {
    // Get color for category badge
    const categoryColor = getCategoryColor(article.category);
    
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.fullScreenContent}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
          </View>
          
          <Text style={styles.fullScreenTitle}>{article.title}</Text>
          
          <Text style={styles.fullScreenExcerpt}>
            {article.content.length > 250 
              ? article.content.substring(0, 250) + '...' 
              : article.content}
          </Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.dateText}>{formatDate(article.createdAt)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.readMoreButton}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Text style={styles.readMoreText}>Read Full Article</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: article.thumbnail }} 
        style={styles.thumbnail} 
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.category}>{article.category.toUpperCase()}</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.content} numberOfLines={3}>
          {article.content}
        </Text>
        <Text style={styles.date}>{formatDate(article.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Regular article card styles
  container: {
    width: width,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 20,
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 15,
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  
  // Full-screen article styles
  fullScreenContainer: {
    width: width,
    height: height,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 30,
  },
  fullScreenContent: {
    flex: 1,
    justifyContent: 'center',
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
  fullScreenTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    lineHeight: 38,
  },
  fullScreenExcerpt: {
    fontSize: 18,
    color: '#444',
    lineHeight: 28,
    marginBottom: 30,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
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
  readMoreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default ArticleCard; 