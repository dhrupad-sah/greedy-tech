import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Article } from '../api/articles';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type ArticleCardProps = {
  article: Article;
  fullScreen?: boolean;
};

// Default fallback image
const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=No+Image';

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const handlePress = () => {
    router.push(`/article/${article.id}`);
  };

  // Use pubDate if available, fallback to createdAt
  const displayDate = article.pubDate || article.createdAt;
  
  // Ensure we have a valid image URL
  const imageUrl = article.thumbnail && article.thumbnail.trim().length > 0
    ? article.thumbnail
    : DEFAULT_IMAGE;

  if (fullScreen) {
    // Get color for category badge
    const categoryColor = getCategoryColor(article.category);
    
    return (
      <View style={styles.fullScreenContainer}>
        {/* Thumbnail image with gradient overlay */}
        <View style={styles.fullScreenThumbnailContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.fullScreenThumbnail}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              console.log('Image failed to load:', imageUrl);
              setImageError(true);
              setImageLoading(false);
            }}
          />
          
          {imageLoading && (
            <View style={styles.imageLoader}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
          
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']}
            style={styles.thumbnailGradient}
          />
        </View>
        
        <View style={styles.fullScreenContent}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
          </View>
          
          <Text style={styles.fullScreenTitle}>{article.title}</Text>
          
          <ScrollView style={styles.scrollView}>
            <Text style={styles.fullScreenExcerpt}>
              {article.content.length > 200 
                ? article.content.substring(0, 200) + '...' 
                : article.content}
            </Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.sourceContainer}>
                {article.sourceName && (
                  <>
                    <Ionicons name="globe-outline" size={16} color="#888" />
                    <Text style={styles.sourceText}>{article.sourceName}</Text>
                  </>
                )}
              </View>
              
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <Text style={styles.dateText}>{formatDate(displayDate)}</Text>
              </View>
            </View>
          </ScrollView>
          
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
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.thumbnail} 
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            console.log('Image failed to load:', imageUrl);
            setImageError(true);
            setImageLoading(false);
          }}
        />
        
        {imageLoading && (
          <View style={styles.imageLoader}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.category}>{article.category.toUpperCase()}</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.content} numberOfLines={3}>
          {article.content}
        </Text>
        <View style={styles.cardMeta}>
          {article.sourceName && (
            <Text style={styles.source}>{article.sourceName}</Text>
          )}
          <Text style={styles.date}>{formatDate(displayDate)}</Text>
        </View>
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
  thumbnailContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#f2f2f2',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(242, 242, 242, 0.5)',
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
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  
  // Full-screen article styles
  fullScreenContainer: {
    width: width,
    height: height - 60,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  fullScreenThumbnailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '40%',
    backgroundColor: '#f2f2f2',
  },
  fullScreenThumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '15%',
  },
  fullScreenContent: {
    backgroundColor: '#fff',
    height: '65%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 30,
    paddingTop: 24,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    marginBottom: 60, // Space for the button
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
    lineHeight: 36,
  },
  fullScreenExcerpt: {
    fontSize: 18,
    color: '#444',
    lineHeight: 28,
    marginBottom: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
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
    paddingVertical: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    bottom: 80,

  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default ArticleCard; 