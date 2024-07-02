require('dotenv').config();
module.exports = {
    info: {
      title: 'ONDC API',
      description: 'Schema and Flow validation',
      version: '1.0.0',
    },
    host: 'localhost:${process.env.PORT}', 
    basePath: '/api', 
    schemes: ['http'],
  };