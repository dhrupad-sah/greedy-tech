const articleService = require('../services/articleService');

// Mock data for initial development
const mockArticles = [
  {
    id: '1',
    title: 'Understanding React Native Architecture',
    content: 'React Native uses a bridge to communicate between JavaScript and native components. This architecture allows for code reuse across platforms while maintaining native performance.',
    thumbnail: 'https://picsum.photos/300/200',
    createdAt: new Date().toISOString(),
    category: 'mobile'
  },
  {
    id: '2',
    title: 'Introduction to TypeScript',
    content: 'TypeScript is a superset of JavaScript that adds static typing to the language. It helps catch errors early in the development process and improves code quality.',
    thumbnail: 'https://picsum.photos/300/200',
    createdAt: new Date().toISOString(),
    category: 'programming'
  },
  {
    id: '3',
    title: 'Containerization with Docker',
    content: 'Docker allows developers to package applications into containers—standardized executable components that combine application source code with the OS libraries and dependencies required to run that code in any environment.',
    thumbnail: 'https://picsum.photos/300/200',
    createdAt: new Date().toISOString(),
    category: 'devops'
  }
];

exports.getAllArticles = async (request, reply) => {
  try {
    // Later this will be replaced with actual database calls
    // const articles = await articleService.getAllArticles();
    const articles = mockArticles;
    return articles;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

exports.getArticleById = async (request, reply) => {
  try {
    const { id } = request.params;
    // Later this will be replaced with actual database calls
    // const article = await articleService.getArticleById(id);
    const article = mockArticles.find(a => a.id === id);
    
    if (!article) {
      return reply.code(404).send({ error: 'Article not found' });
    }
    
    return article;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

exports.getArticlesByCategory = async (request, reply) => {
  try {
    const { category } = request.params;
    // Later this will be replaced with actual database calls
    // const articles = await articleService.getArticlesByCategory(category);
    const articles = mockArticles.filter(a => a.category === category);
    
    return articles;
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}; 