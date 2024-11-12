const config = {
  BACKEND_URL: process.env.NODE_ENV === 'production' 
    ? 'https://paperverse.co/api'
    : 'http://localhost:8000',
  ENVIRONMENT: process.env.NODE_ENV || 'development'
};

export default config;