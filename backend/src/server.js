import app from './app.js';
import env from './config/env.js';
import connectMongoDB from './config/mongo.js';

const PORT = env.PORT || 5000;

// Connect to MongoDB Atlas before starting the server
const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 ProjectPulse REST API Backend Server Running`);
    console.log(`📡 Port: http://localhost:${PORT}`);
    console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
};

startServer();
