import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import env from './config/env.js';
import swaggerSpec from './config/swagger.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import { errorMiddleware, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

// Configure CORS
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://projectpluse12.netlify.app',
  'https://projectpulse12.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Demo-Role']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Interactive Swagger OpenAPI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base root and API root information endpoint
const getApiIndex = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'ProjectPulse REST API is running successfully',
    version: '1.0.0',
    documentation: `http://localhost:${env.PORT || 5000}/api-docs`,
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me'
      },
      projects: '/api/projects',
      tasks: '/api/tasks',
      predictions: '/api/prediction',
      notifications: '/api/notifications',
      github: '/api/github',
      dashboard: '/api/dashboard',
      comments: '/api/comments',
      reports: '/api/reports'
    }
  });
};

app.get('/', getApiIndex);
app.get('/api', getApiIndex);

// Register REST API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error & 404 Handlers
app.use(notFoundHandler);
app.use(errorMiddleware);

export default app;
