import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, StatusBar, Image, Linking, Share } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useArticle } from '../../hooks/useArticles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Default fallback image
const DEFAULT_IMAGE = 'https://placehold.co/600x400?text=No+Image';

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Navigate back to the previous screen
  const handleBack = () => {
    router.back();
  };

  // Share article
  const handleShare = async () => {
    if (!article) return;
    
    try {
      await Share.share({
        message: `Check out this article: ${article.title}`,
        url: article.originalUrl || undefined
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Open original article URL
  const openOriginalArticle = () => {
    if (article?.originalUrl) {
      Linking.openURL(article.originalUrl);
    }
  };

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
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryColor = getCategoryColor(article.category);
  const displayDate = article.pubDate || article.createdAt;
  
  // Ensure we have a valid image URL
  const imageUrl = article.thumbnail && article.thumbnail.trim().length > 0
    ? article.thumbnail
    : DEFAULT_IMAGE;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Article Thumbnail */}
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
            
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent']}
              style={styles.thumbnailGradient}
            />
            
            {/* Header with back button and share */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButtonIcon}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Article Content */}
          <View style={styles.contentContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
            </View>
            
            <Text style={styles.title}>{article.title}</Text>
            
            <View style={styles.metaInfo}>
              {article.sourceName && (
                <View style={styles.sourceContainer}>
                  <Ionicons name="globe-outline" size={16} color="#888" />
                  <Text style={styles.sourceText}>{article.sourceName}</Text>
                </View>
              )}
              
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <Text style={styles.dateText}>{formatDate(displayDate)}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.content}>{article.content}</Text>
            
            {article.originalUrl && (
              <TouchableOpacity
                style={styles.originalLinkButton}
                onPress={openOriginalArticle}
                activeOpacity={0.7}
              >
                <Ionicons name="open-outline" size={18} color="#FFF" />
                <Text style={styles.originalLinkText}>Read Original Article</Text>
              </TouchableOpacity>
            )}
            
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    zIndex: 10,
    paddingTop: 45, // Move the buttons lower on the screen
    height: 100,
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  thumbnailContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    backgroundColor: '#f2f2f2',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
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
  thumbnailGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120, // Increased height to cover the lowered header
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    lineHeight: 36,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  originalLinkButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 30,
  },
  originalLinkText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
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