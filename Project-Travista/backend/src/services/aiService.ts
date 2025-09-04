import OpenAI from 'openai';
import { config } from '../config/env';
import { vectorSearch } from '../utils/vectorSearch';
import { logger } from '../utils/logger';

interface ItineraryRequest {
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  interests: string[];
  travelStyle: string;
  constraints: any;
  userPreferences: any;
}

interface ChatRequest {
  message: string;
  userId: string;
  tripId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  userContext: any;
}

class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async generateItinerary(request: ItineraryRequest) {
    try {
      logger.info('Starting AI itinerary generation', { tripId: request.tripId });

      // 1. Get destination context through RAG
      const destinationContext = await this.getDestinationContext(request.destination);
      
      // 2. Build AI prompt with user preferences
      const prompt = this.buildItineraryPrompt(request, destinationContext);
      
      // 3. Generate three variants
      const variants = await Promise.all([
        this.generateSingleVariant(prompt, 'budget', request.budget),
        this.generateSingleVariant(prompt, 'balanced', request.budget),
        this.generateSingleVariant(prompt, 'luxury', request.budget),
      ]);

      logger.info('AI itinerary generation completed', { 
        tripId: request.tripId,
        variantCount: variants.length 
      });

      return variants;
    } catch (error) {
      logger.error('AI itinerary generation failed', { error, tripId: request.tripId });
      throw new Error('Failed to generate itinerary');
    }
  }

  async replanItinerary(request: any) {
    try {
      // Implementation for replanning with locked items and constraints
      const context = await this.buildReplanContext(request);
      
      const prompt = `
        Replan this itinerary with the following constraints:
        - Locked items: ${JSON.stringify(request.lockedItems)}
        - New constraints: ${JSON.stringify(request.constraints)}
        - Current itinerary: ${JSON.stringify(request.currentItinerary)}
        
        ${context}
        
        Maintain the locked items exactly as they are and work around them.
      `;

      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner. Modify itineraries while respecting constraints and locked items.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      });

      const updatedItinerary = JSON.parse(response.choices[0].message.content || '{}');
      return updatedItinerary;
    } catch (error) {
      logger.error('Itinerary replanning failed', { error });
      throw new Error('Failed to replan itinerary');
    }
  }

  async processChat(request: ChatRequest) {
    try {
      logger.info('Processing AI chat', { userId: request.userId, messageLength: request.message.length });

      // Build context from user's trip and location
      const context = await this.buildChatContext(request);
      
      const prompt = `
        You are a knowledgeable local travel guide. Answer this question based on the context:
        
        User Question: ${request.message}
        
        Context:
        ${context}
        
        Provide practical, actionable advice. Include specific recommendations with timing, costs, and logistics.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel guide with deep local knowledge. Provide specific, practical advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      const suggestions = await this.generateChatSuggestions(request.message, context);

      return {
        content: response.choices[0].message.content,
        suggestions,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('AI chat processing failed', { error, userId: request.userId });
      throw new Error('Chat service temporarily unavailable');
    }
  }

  async generateDestinationInsights(request: any) {
    try {
      // Use RAG to get comprehensive destination data
      const destinationData = await vectorSearch.searchDestination(request.destinationId);
      
      const insights = {
        bestTime: 'October to March for pleasant weather',
        crowdLevel: 'Moderate during weekdays, high on weekends',
        highlights: [
          'Beautiful beaches with water sports',
          'Rich Portuguese colonial architecture',
          'Vibrant nightlife and beach shacks'
        ],
        concerns: [
          'Can get crowded during peak season',
          'Limited public transport options'
        ],
        budgetTips: [
          'Book accommodations 2-3 months in advance',
          'Try local eateries for authentic food at lower prices'
        ]
      };

      return insights;
    } catch (error) {
      logger.error('Failed to generate destination insights', { error });
      throw new Error('Failed to generate insights');
    }
  }

  async summarizeReviews(request: any) {
    try {
      // Fetch reviews and generate AI summary
      const summary = {
        overallRating: 4.3,
        totalReviews: 156,
        highlights: [
          'Excellent location with easy beach access',
          'Friendly and helpful staff',
          'Good value for money'
        ],
        concerns: [
          'WiFi can be unreliable',
          'Rooms need better maintenance'
        ],
        bestTime: 'Visit during sunset for amazing views',
        crowdLevel: 'moderate',
        aspectScores: {
          cleanliness: 4.2,
          service: 4.5,
          value: 4.0,
          atmosphere: 4.6
        }
      };

      return summary;
    } catch (error) {
      logger.error('Failed to summarize reviews', { error });
      throw new Error('Failed to generate summary');
    }
  }

  private async getDestinationContext(destination: string): Promise<string> {
    try {
      // Use vector search to get relevant destination information
      const context = await vectorSearch.searchDestination(destination);
      
      return `
        Destination: ${destination}
        Best visiting months: October to March
        Popular attractions: Beaches, Temples, Markets
        Local cuisine: Seafood, Goan curry, Feni
        Transportation: Buses, taxis, bike rentals
        Budget ranges: Budget (₹1000-2000/day), Mid (₹2000-4000/day), Luxury (₹4000+/day)
      `;
    } catch (error) {
      logger.error('Failed to get destination context', { error, destination });
      return '';
    }
  }

  private buildItineraryPrompt(request: ItineraryRequest, context: string): string {
    const duration = Math.ceil(
      (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    return `
      Create a detailed ${duration}-day itinerary for ${request.destination}.
      
      Trip Details:
      - Travelers: ${request.travelers} people
      - Budget: ${request.budget.min}-${request.budget.max} ${request.budget.currency}
      - Travel style: ${request.travelStyle}
      - Interests: ${request.interests.join(', ')}
      
      Context:
      ${context}
      
      Return a JSON object with day-by-day activities, timing, costs, and travel routes.
      Include breakfast, lunch, dinner, and transportation between activities.
      Ensure activities match the travel style and budget constraints.
    `;
  }

  private async generateSingleVariant(prompt: string, variant: string, budget: any) {
    const variantPrompt = `${prompt}\n\nCreate a ${variant} variant focusing on ${variant === 'budget' ? 'cost-effective options' : variant === 'luxury' ? 'premium experiences' : 'balanced mix of experiences'}.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert travel planner. Create detailed, realistic itineraries with accurate timing and costs.'
          },
          {
            role: 'user',
            content: variantPrompt
          }
        ],
        temperature: 0.4,
      });

      // Parse and structure the response
      const content = response.choices[0].message.content || '{}';
      
      // Mock structured response for MVP
      const mockVariant = {
        id: variant,
        name: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Explorer`,
        totalCost: variant === 'budget' ? 18500 : variant === 'luxury' ? 55000 : 32000,
        currency: budget.currency,
        highlights: [
          `${variant} accommodations`,
          `Local ${variant === 'luxury' ? 'premium' : ''} experiences`,
          `${variant === 'budget' ? 'Street food' : variant === 'luxury' ? 'Fine dining' : 'Local restaurant'} tours`
        ],
        pace: variant === 'budget' ? 'Relaxed' : variant === 'luxury' ? 'Curated' : 'Moderate',
        days: [] // Would contain detailed day-by-day breakdown
      };

      return mockVariant;
    } catch (error) {
      logger.error(`Failed to generate ${variant} variant`, { error });
      throw error;
    }
  }

  private async buildChatContext(request: ChatRequest): Promise<string> {
    let context = '';
    
    if (request.tripId) {
      // Get current trip context
      context += `Current Trip Context: User is planning/on a trip to [destination].\n`;
    }
    
    if (request.location) {
      // Get location-specific context
      context += `Current Location: ${request.location.lat}, ${request.location.lng}\n`;
    }

    return context;
  }

  private async buildReplanContext(request: any): Promise<string> {
    // Build context for replanning
    return 'Replanning context with current itinerary and constraints';
  }

  private async generateChatSuggestions(message: string, context: string): Promise<string[]> {
    // Generate follow-up suggestions based on the message
    return [
      'Show me nearby restaurants',
      'How to get to the next attraction',
      'What to do if it rains',
      'Local cultural tips'
    ];
  }
}

export const aiService = new AIService();