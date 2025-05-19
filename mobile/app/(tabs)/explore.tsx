import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Define categories with icons and colors
const categories = [
  { id: 'mobile', name: 'Mobile Development', icon: 'phone-portrait', color: '#FFD1DC' },
  { id: 'web', name: 'Web Development', icon: 'globe', color: '#A2D2FF' },
  { id: 'ai', name: 'Artificial Intelligence', icon: 'brain', color: '#CAFFBF' },
  { id: 'devops', name: 'DevOps', icon: 'server', color: '#FFC6FF' },
  { id: 'programming', name: 'Programming', icon: 'code-slash', color: '#FFDEAD' },
  { id: 'data', name: 'Data Science', icon: 'analytics', color: '#FFFFB7' },
  { id: 'cloud', name: 'Cloud Computing', icon: 'cloud', color: '#E0FFFF' },
  { id: 'security', name: 'Cybersecurity', icon: 'shield', color: '#D8BFD8' },
];

export default function ExploreScreen() {
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  const handleBackToFeed = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Categories</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackToFeed}
        >
          <Ionicons name="home-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.subheader}>Browse by topic</Text>
        
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color + '30' }]} // 30 is hex for 19% opacity
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={28} color="#555" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={16} color="#888" />
              </View>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 40,
  },
  subheader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
});
