import { Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { tripService } from '../services/tripService';
import { logger } from '../utils/logger';

class AIController {
  async generateItinerary(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const {
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        interests = [],
        travelStyle = 'balanced',
        constraints = {}
      } = req.body;

      logger.info('Generating AI itinerary', { userId, destination, startDate, endDate });

      // Create trip record
      const trip = await tripService.createTrip({
        userId,
        title: `Trip to ${destination}`,
        destination,
        startDate,
        endDate,
        partySize: travelers,
        budget,
      });

      // Generate AI itinerary variants
      const variants = await aiService.generateItinerary({
        tripId: trip.id,
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        interests,
        travelStyle,
        constraints,
        userPreferences: req.user.preferences || {}
      });

      logger.info('AI itinerary generated successfully', { 
        tripId: trip.id, 
        variantCount: variants.length 
      });

      res.status(200).json({
        success: true,
        tripId: trip.id,
        variants,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to generate itinerary', { error, userId: req.user.id });
      res.status(500).json({
        success: false,
        error: 'Failed to generate itinerary',
        message: 'Our AI is temporarily unavailable. Please try again in a few minutes.'
      });
    }
  }

  async replanItinerary(req: Request, res: Response) {
    try {
      const { tripId } = req.params;
      const { constraints, lockedItems, modifications } = req.body;
      const userId = req.user.id;

      logger.info('Re-planning itinerary', { tripId, userId });

      // Verify trip ownership
      const trip = await tripService.getTripById(tripId, userId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      const updatedItinerary = await aiService.replanItinerary({
        tripId,
        constraints,
        lockedItems,
        modifications,
        currentItinerary: trip.itinerary
      });

      logger.info('Itinerary re-planned successfully', { tripId });

      res.status(200).json({
        success: true,
        itinerary: updatedItinerary,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to re-plan itinerary', { error, tripId: req.params.tripId });
      res.status(500).json({
        success: false,
        error: 'Failed to update itinerary'
      });
    }
  }

  async chatGuide(req: Request, res: Response) {
    try {
      const { message, tripId, location } = req.body;
      const userId = req.user.id;

      logger.info('AI chat guide query', { userId, tripId, messageLength: message.length });

      const response = await aiService.processChat({
        message,
        userId,
        tripId,
        location,
        userContext: req.user
      });

      res.status(200).json({
        success: true,
        response: response.content,
        suggestions: response.suggestions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('AI chat failed', { error, userId: req.user.id });
      res.status(500).json({
        success: false,
        error: 'AI chat temporarily unavailable'
      });
    }
  }

  async getDestinationInsights(req: Request, res: Response) {
    try {
      const { destinationId } = req.params;
      const { aspects = [], timeframe = 'current' } = req.query;

      logger.info('Getting destination insights', { destinationId, aspects, timeframe });

      const insights = await aiService.generateDestinationInsights({
        destinationId,
        aspects: aspects as string[],
        timeframe: timeframe as string
      });

      res.status(200).json({
        success: true,
        insights,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get destination insights', { error, destinationId: req.params.destinationId });
      res.status(500).json({
        success: false,
        error: 'Failed to generate insights'
      });
    }
  }

  async summarizeReviews(req: Request, res: Response) {
    try {
      const { poiId, aspects = [] } = req.body;

      logger.info('Summarizing reviews', { poiId, aspects });

      const summary = await aiService.summarizeReviews({
        poiId,
        aspects,
        maxReviews: 100
      });

      res.status(200).json({
        success: true,
        summary,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to summarize reviews', { error, poiId: req.body.poiId });
      res.status(500).json({
        success: false,
        error: 'Failed to generate summary'
      });
    }
  }
}

export const aiController = new AIController();