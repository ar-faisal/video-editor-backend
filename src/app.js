const express = require('express');
const videoRoutes = require('./routes/video.routes');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  credentials: true,               // Allow cookies if needed
}));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Video Editing API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use('/api/videos', videoRoutes);

module.exports = app;