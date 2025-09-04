import rateLimit from 'express-rate-limit';

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI endpoints rate limiting (more restrictive)
export const rateLimitAI = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 AI requests per minute
  message: {
    error: 'AI rate limit exceeded',
    message: 'Please wait before making another AI request',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limiting
export const rateLimitAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth attempts per 15 minutes
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Booking endpoints rate limiting
export const rateLimitBooking = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 booking requests per minute
  message: {
    error: 'Booking rate limit exceeded',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});