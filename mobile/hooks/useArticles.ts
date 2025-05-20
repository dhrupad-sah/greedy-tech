import { useState, useEffect } from 'react';
import { fetchArticles, fetchArticleById, fetchArticlesByCategory, fetchCategories, Article } from '../api/articles';

// Hook for fetching all articles
export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  return { articles, loading, error, setArticles, setLoading, setError };
};

// Hook for fetching a single article by ID
export const useArticle = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticle = async () => {
      try {
        setLoading(true);
        const data = await fetchArticleById(id);
        setArticle(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getArticle();
    }
  }, [id]);

  return { article, loading, error };
};

// Hook for fetching articles by category
export const useArticlesByCategory = (category: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticlesByCategory = async () => {
      try {
        setLoading(true);
        const data = await fetchArticlesByCategory(category);
        setArticles(data);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch articles in category: ${category}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      getArticlesByCategory();
    }
  }, [category]);

  return { articles, loading, error };
};

// Hook for fetching all available categories
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return { categories, loading, error };
}; 