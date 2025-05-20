import axios from 'axios';
import { API_URL } from '../constants/Environment';

// Define the article type
export interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  category: string;
  sourceName: string | null;
  originalUrl: string | null;
  pubDate: string | null;
  consumed: boolean;
  createdAt: string;
}

// Function to fetch all articles
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/articles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// Function to fetch a single article by ID
export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    return null;
  }
};

// Function to fetch articles by category
export const fetchArticlesByCategory = async (category: string): Promise<Article[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/articles/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching articles in category ${category}:`, error);
    return [];
  }
};

// Function to fetch unconsumed articles
export const fetchUnconsumedArticles = async (): Promise<Article[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/articles/status/unconsumed`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unconsumed articles:', error);
    return [];
  }
};

// Function to get all unique categories from articles
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const articles = await fetchArticles();
    const categories = [...new Set(articles.map(article => article.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}; 