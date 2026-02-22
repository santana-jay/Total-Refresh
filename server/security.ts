import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const securityMiddleware = (app: express.Application) => {
  // Enable CORS
  app.use(cors());

  // Set security headers
  app.use(helmet());

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  });
  app.use(limiter);
};

export default securityMiddleware;