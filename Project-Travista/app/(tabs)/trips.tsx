import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Plus, Calendar, MapPin, Users, DollarSign } from 'lucide-react-native';

export default function TripsScreen() {
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'drafts'>('current');

  const currentTrips = [
    {
      id: 1,
      title: 'Goa Beach Getaway',
      destination: 'Goa, India',
      dates: 'Dec 15-18, 2024',
      travelers: 2,
      budget: '₹25,000',
      status: 'confirmed',
      progress: 0.7,
    },
  ];

  const pastTrips = [
    {
      id: 2,
      title: 'Kerala Backwaters',
      destination: 'Alleppey, Kerala',
      dates: 'Nov 8-12, 2024',
      travelers: 4,
      budget: '₹45,000',
      status: 'completed',
      rating: 4.8,
    },
  ];

  const draftTrips = [
    {
      id: 3,
      title: 'Rajasthan Heritage Tour',
      destination: 'Jaipur, Rajasthan',
      dates: 'Planning...',
      travelers: 2,
      budget: '₹30,000',
      status: 'draft',
      completion: 0.3,
    },
  ];

  const getCurrentTrips = () => {
    switch (activeTab) {
      case 'current':
        return currentTrips;
      case 'past':
        return pastTrips;
      case 'drafts':
        return draftTrips;
      default:
        return currentTrips;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        {(['current', 'past', 'drafts'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {getCurrentTrips().map((trip) => (
          <TouchableOpacity key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <View style={[styles.statusBadge, getStatusStyle(trip.status)]}>
                <Text style={[styles.statusText, getStatusTextStyle(trip.status)]}>
                  {trip.status}
                </Text>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#64748B" strokeWidth={2} />
                <Text style={styles.detailText}>{trip.destination}</Text>
              </View>

              <View style={styles.detailRow}>
                <Calendar size={16} color="#64748B" strokeWidth={2} />
                <Text style={styles.detailText}>{trip.dates}</Text>
              </View>

              <View style={styles.detailRow}>
                <Users size={16} color="#64748B" strokeWidth={2} />
                <Text style={styles.detailText}>{trip.travelers} travelers</Text>
              </View>

              <View style={styles.detailRow}>
                <DollarSign size={16} color="#64748B" strokeWidth={2} />
                <Text style={styles.detailText}>Budget: {trip.budget}</Text>
              </View>
            </View>

            {trip.progress && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${trip.progress * 100}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(trip.progress * 100)}% planned
                </Text>
              </View>
            )}

            {trip.rating && (
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FB923C" fill="#FB923C" strokeWidth={0} />
                <Text style={styles.ratingText}>{trip.rating}/5.0</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {getCurrentTrips().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>
              Start planning your next adventure with our AI guide
            </Text>
            <TouchableOpacity style={styles.startPlanningButton}>
              <Text style={styles.startPlanningText}>Start Planning</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'confirmed':
      return { backgroundColor: '#DCFCE7' };
    case 'completed':
      return { backgroundColor: '#E0F2FE' };
    case 'draft':
      return { backgroundColor: '#FEF3C7' };
    default:
      return { backgroundColor: '#F1F5F9' };
  }
}

function getStatusTextStyle(status: string) {
  switch (status) {
    case 'confirmed':
      return { color: '#10B981' };
    case 'completed':
      return { color: '#0EA5E9' };
    case 'draft':
      return { color: '#FB923C' };
    default:
      return { color: '#64748B' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#0EA5E9',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#0EA5E9',
  },
  content: {
    flex: 1,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tripDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 16,
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#FB923C',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startPlanningButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startPlanningText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});