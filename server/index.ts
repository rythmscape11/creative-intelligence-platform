import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import { json } from 'body-parser';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
import { authRoutes } from './api/auth';
import { strategyRoutes } from './api/strategies';
import { exportRoutes } from './api/export';
import { fileRoutes } from './api/files';
import { blogRoutes } from './api/blog';
import { seoRoutes } from './api/seo';
import { adminRoutes } from './api/admin';
import { healthRoutes } from './api/health';
import { errorHandler } from './middleware/errorHandler';
// import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
// import { initializeJobs } from './jobs';

const app = express();
const httpServer = createServer(app);

async function startServer() {
  // Initialize background jobs (disabled for now)
  // await initializeJobs();

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.NEXTAUTH_URL!]
      : ['http://localhost:3000'],
    credentials: true,
  }));

  // Rate limiting (disabled for now)
  // app.use(rateLimiter);

  // Body parsing
  app.use(json({ limit: '10mb' }));

  // Health check
  app.use('/api/health', healthRoutes);

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/strategies', strategyRoutes);
  app.use('/api/export', exportRoutes);
  app.use('/api/files', fileRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/seo', seoRoutes);
  app.use('/api/admin', adminRoutes);

  // GraphQL server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
  });

  await server.start();

  app.use(
    '/api/graphql',
    expressMiddleware(server, {
      context: createContext,
    })
  );

  // Error handling
  app.use(errorHandler);

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server ready at http://localhost:${PORT}`);
    logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}/api/graphql`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
