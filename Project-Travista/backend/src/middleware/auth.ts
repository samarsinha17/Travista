import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    preferences: any;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      // Mock user data for MVP
      req.user = {
        id: decoded.userId || 'mock-user-id',
        email: decoded.email || 'user@example.com',
        preferences: decoded.preferences || {}
      };
      
      next();
    } catch (jwtError) {
      logger.warn('Invalid JWT token', { error: jwtError });
      
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error', { error });
    
    return res.status(500).json({
      success: false,
      error: 'Authentication service unavailable',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

export const optionalAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        preferences: decoded.preferences || {}
      };
    } catch (error) {
      // Continue without authentication for optional auth routes
      logger.info('Optional auth failed, continuing without user context', { error });
    }
  }
  
  next();
};

export const adminAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  authMiddleware(req, res, () => {
    // Check if user has admin role
    if (!req.user || !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  });
};

function isAdmin(user: any): boolean {
  // Mock admin check for MVP
  return user.email?.includes('admin') || false;
}

// JWT utility functions
export const generateTokens = (userId: string, email: string, preferences: any = {}) => {
  const payload = { userId, email, preferences };
  
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'tripgenius-api',
    audience: 'tripgenius-app'
  });
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'tripgenius-api',
      audience: 'tripgenius-app'
    }
  );
  
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (refreshToken: string) => {
  try {
    return jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};