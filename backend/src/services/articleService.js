const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// This will be initialized with actual credentials in production
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

exports.getAllArticles = async () => {
  // This is a placeholder for when we integrate with Supabase
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  }
  
  throw new Error('Database connection not configured');
};

exports.getArticleById = async (id) => {
  // This is a placeholder for when we integrate with Supabase
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
  
  throw new Error('Database connection not configured');
};

exports.getArticlesByCategory = async (category) => {
  // This is a placeholder for when we integrate with Supabase
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  }
  
  throw new Error('Database connection not configured');
};

// This will be used for LLM integration in the future
exports.generateArticle = async (topic) => {
  // Placeholder for LLM integration
  // Will connect to OpenAI or other LLM API to generate content
  throw new Error('LLM integration not implemented yet');
}; 