import express from 'express';
import { body, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { aiController } from '../controllers/aiController';
import { rateLimitAI } from '../middleware/rateLimits';

const router = express.Router();

// Generate trip itinerary
router.post(
  '/plan',
  rateLimitAI,
  [
    body('destination').isString().isLength({ min: 2, max: 100 }),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('travelers').isInt({ min: 1, max: 20 }),
    body('budget').isObject(),
    body('interests').optional().isArray(),
    body('travelStyle').optional().isIn(['relaxed', 'balanced', 'packed']),
  ],
  validateRequest,
  aiController.generateItinerary
);

// Re-plan existing trip with constraints
router.patch(
  '/plan/:tripId',
  rateLimitAI,
  [
    body('constraints').optional().isObject(),
    body('lockedItems').optional().isArray(),
    body('modifications').optional().isArray(),
  ],
  validateRequest,
  aiController.replanItinerary
);

// Ask travel questions
router.post(
  '/chat',
  [
    body('message').isString().isLength({ min: 1, max: 1000 }),
    body('tripId').optional().isUUID(),
    body('location').optional().isObject(),
  ],
  validateRequest,
  aiController.chatGuide
);

// Get destination insights
router.get(
  '/insights/:destinationId',
  [
    query('aspects').optional().isArray(),
    query('timeframe').optional().isIn(['current', 'seasonal', 'historical']),
  ],
  validateRequest,
  aiController.getDestinationInsights
);

// Generate review summary
router.post(
  '/summarize/reviews',
  [
    body('poiId').isUUID(),
    body('aspects').optional().isArray(),
  ],
  validateRequest,
  aiController.summarizeReviews
);

export default router;