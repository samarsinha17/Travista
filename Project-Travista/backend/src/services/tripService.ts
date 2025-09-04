import { db } from '../config/database';
import { logger } from '../utils/logger';

interface CreateTripData {
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  partySize: number;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
}

class TripService {
  async createTrip(data: CreateTripData) {
    try {
      const trip = await db.trips.create({
        data: {
          userId: data.userId,
          title: data.title,
          destinationName: data.destination,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          partySize: data.partySize,
          budgetMin: data.budget.min,
          budgetMax: data.budget.max,
          currency: data.budget.currency,
          status: 'draft'
        }
      });

      logger.info('Trip created', { tripId: trip.id, userId: data.userId });
      return trip;
    } catch (error) {
      logger.error('Failed to create trip', { error, userId: data.userId });
      throw new Error('Failed to create trip');
    }
  }

  async getTripById(tripId: string, userId: string) {
    try {
      const trip = await db.trips.findFirst({
        where: {
          id: tripId,
          userId: userId
        },
        include: {
          itinerary: {
            include: {
              days: {
                include: {
                  items: {
                    include: {
                      poi: true
                    }
                  }
                },
                orderBy: {
                  dayNumber: 'asc'
                }
              }
            }
          },
          bookings: true
        }
      });

      return trip;
    } catch (error) {
      logger.error('Failed to get trip', { error, tripId, userId });
      throw new Error('Failed to fetch trip');
    }
  }

  async getUserTrips(userId: string, filters: any = {}) {
    try {
      const trips = await db.trips.findMany({
        where: {
          userId,
          ...filters
        },
        include: {
          itinerary: true,
          bookings: {
            select: {
              id: true,
              type: true,
              status: true,
              amount: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return trips;
    } catch (error) {
      logger.error('Failed to get user trips', { error, userId });
      throw new Error('Failed to fetch trips');
    }
  }

  async updateTripStatus(tripId: string, userId: string, status: string) {
    try {
      const trip = await db.trips.updateMany({
        where: {
          id: tripId,
          userId: userId
        },
        data: {
          status,
          updatedAt: new Date()
        }
      });

      logger.info('Trip status updated', { tripId, userId, status });
      return trip;
    } catch (error) {
      logger.error('Failed to update trip status', { error, tripId, userId });
      throw new Error('Failed to update trip');
    }
  }

  async deleteTrip(tripId: string, userId: string) {
    try {
      // Check if trip has any confirmed bookings
      const trip = await this.getTripById(tripId, userId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const confirmedBookings = trip.bookings?.filter(b => b.status === 'confirmed');
      if (confirmedBookings && confirmedBookings.length > 0) {
        throw new Error('Cannot delete trip with confirmed bookings');
      }

      await db.trips.delete({
        where: {
          id: tripId,
          userId: userId
        }
      });

      logger.info('Trip deleted', { tripId, userId });
      return true;
    } catch (error) {
      logger.error('Failed to delete trip', { error, tripId, userId });
      throw error;
    }
  }
}

// Mock database operations for MVP
const db = {
  trips: {
    create: async (options: any) => {
      return {
        id: 'mock-trip-id',
        ...options.data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    },
    findFirst: async (options: any) => {
      return null; // Mock implementation
    },
    findMany: async (options: any) => {
      return []; // Mock implementation
    },
    updateMany: async (options: any) => {
      return { count: 1 };
    },
    delete: async (options: any) => {
      return { count: 1 };
    }
  }
};

export const tripService = new TripService();