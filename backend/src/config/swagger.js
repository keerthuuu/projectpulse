import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProjectPulse REST API Documentation',
      version: '1.0.0',
      description: 'Interactive OpenAPI specification for ProjectPulse Project Monitoring & AI Deadline Prediction API.',
      contact: {
        name: 'ProjectPulse Engineering Team',
        url: 'https://projectpulse-ai.netlify.app'
      }
    },
    servers: [
      {
        url: 'https://projectpulse-6yd2.onrender.com/api',
        description: 'Render Production Server'
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server'
      },
      {
        url: '/api',
        description: 'Current Host'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'team_leader', 'developer'] }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['planning', 'active', 'paused', 'completed'] },
            health_score: { type: 'number' },
            deadline: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            project_id: { type: 'string', format: 'uuid' },
            assigned_to: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done'] },
            progress: { type: 'integer', minimum: 0, maximum: 100 },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health Check',
          tags: ['Health'],
          responses: {
            200: {
              description: 'API is running successfully'
            }
          }
        }
      },
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    name: { type: 'string' },
                    role: { type: 'string', default: 'developer' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Validation error' }
          }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Login with email and password',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Logged in successfully, returns JWT token' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/auth/me': {
        get: {
          summary: 'Get current user profile',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Current user details' },
            401: { description: 'Unauthorized' }
          }
        }
      },
      '/auth/logout': {
        post: {
          summary: 'Logout user',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Logged out successfully' }
          }
        }
      },
      '/projects': {
        get: {
          summary: 'Get all projects',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'List of projects' }
          }
        },
        post: {
          summary: 'Create a new project',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string' },
                    deadline: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Project created' }
          }
        }
      },
      '/projects/{id}': {
        get: {
          summary: 'Get project by ID',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Project details' },
            404: { description: 'Project not found' }
          }
        },
        put: {
          summary: 'Update project',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Project updated' }
          }
        },
        delete: {
          summary: 'Delete project',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Project deleted' }
          }
        }
      },
      '/projects/{id}/members': {
        get: {
          summary: 'Get project members',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'List of project members' } }
        },
        post: {
          summary: 'Add project member',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId'],
                  properties: {
                    userId: { type: 'string' },
                    role: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Member added' } }
        }
      },
      '/projects/{id}/members/{userId}': {
        delete: {
          summary: 'Remove project member',
          tags: ['Projects'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Member removed' } }
        }
      },
      '/tasks': {
        get: {
          summary: 'Get tasks',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of tasks' } }
        },
        post: {
          summary: 'Create task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'projectId'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    projectId: { type: 'string' },
                    assignedTo: { type: 'string' },
                    priority: { type: 'string' },
                    dueDate: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Task created' } }
        }
      },
      '/tasks/project/{projectId}': {
        get: {
          summary: 'Get tasks by project ID',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'List of project tasks' } }
        }
      },
      '/tasks/{id}/progress': {
        patch: {
          summary: 'Update task progress',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['progress'],
                  properties: {
                    progress: { type: 'integer', minimum: 0, maximum: 100 }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Task progress updated' } }
        }
      },
      '/tasks/{id}/status': {
        patch: {
          summary: 'Update task status',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done'] }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Task status updated' } }
        }
      },
      '/dashboard': {
        get: {
          summary: 'Get dashboard summary metrics',
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Dashboard metrics' } }
        }
      },
      '/prediction/project/{id}': {
        get: {
          summary: 'Get AI deadline prediction for a project',
          tags: ['AI Prediction'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'AI deadline prediction details' } }
        }
      },
      '/prediction/what-if': {
        post: {
          summary: 'Run AI What-If Scenario Simulation',
          tags: ['AI Prediction'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    projectId: { type: 'string' },
                    scenario: { type: 'object' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Simulation results' } }
        }
      },
      '/github/activity': {
        get: {
          summary: 'Get GitHub commit and PR activity',
          tags: ['GitHub'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'GitHub activity list' } }
        }
      },
      '/github/sync': {
        post: {
          summary: 'Trigger manual GitHub sync',
          tags: ['GitHub'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'GitHub synced' } }
        }
      },
      '/notifications': {
        get: {
          summary: 'Get notifications',
          tags: ['Notifications'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of notifications' } }
        }
      },
      '/notifications/mark-all-read': {
        patch: {
          summary: 'Mark all notifications as read',
          tags: ['Notifications'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'All notifications marked as read' } }
        }
      },
      '/notifications/{id}/read': {
        patch: {
          summary: 'Mark notification as read',
          tags: ['Notifications'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Notification marked read' } }
        }
      },
      '/comments/task/{taskId}': {
        get: {
          summary: 'Get task comments',
          tags: ['Comments'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'List of comments' } }
        },
        post: {
          summary: 'Add comment to task',
          tags: ['Comments'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'taskId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['content'],
                  properties: {
                    content: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Comment created' } }
        }
      },
      '/comments/{id}': {
        delete: {
          summary: 'Delete comment',
          tags: ['Comments'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Comment deleted' } }
        }
      },
      '/reports/project/{id}': {
        get: {
          summary: 'Get project report metrics',
          tags: ['Reports'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Project report details' } }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
