const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/validate/*.ts']; // Update with the path to your route files

const swaggerConfig = require('./swagger-config');

swaggerAutogen(outputFile, endpointsFiles, swaggerConfig);