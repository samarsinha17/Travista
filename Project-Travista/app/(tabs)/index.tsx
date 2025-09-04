import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Search, TrendingUp as Trending, Clock, MapPin, Star } from 'lucide-react-native';

export default function DiscoverScreen() {
  const [searchText, setSearchText] = useState('');

  const trendingDestinations = [
    {
      id: 1,
      name: 'Goa',
      country: 'India',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹15,000',
      rating: 4.6,
      season: 'Peak Season',
    },
    {
      id: 2,
      name: 'Kerala',
      country: 'India',
      image: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '₹18,500',
      rating: 4.8,
      season: 'Best Time',
    },
  ];

  const quickSuggestions = [
    'Weekend getaway',
    'Beach vacation',
    'Mountain retreat',
    'Cultural tour',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! 🌅</Text>
          <Text style={styles.subtitle}>Where would you like to explore?</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations, experiences..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Quick Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Ideas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.suggestionRow}>
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity key={index} style={styles.suggestionChip}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Trending Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trending size={20} color="#0EA5E9" strokeWidth={2} />
            <Text style={styles.sectionTitle}>Trending Destinations</Text>
          </View>

          {trendingDestinations.map((destination) => (
            <TouchableOpacity key={destination.id} style={styles.destinationCard}>
              <Image
                source={{ uri: destination.image }}
                style={styles.destinationImage}
              />
              <View style={styles.destinationInfo}>
                <View style={styles.destinationHeader}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FB923C" fill="#FB923C" strokeWidth={0} />
                    <Text style={styles.rating}>{destination.rating}</Text>
                  </View>
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#64748B" strokeWidth={2} />
                  <Text style={styles.country}>{destination.country}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>From {destination.price}</Text>
                  <View style={styles.seasonBadge}>
                    <Clock size={12} color="#10B981" strokeWidth={2} />
                    <Text style={styles.seasonText}>{destination.season}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Planner CTA */}
        <TouchableOpacity style={styles.aiPlannerCTA}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>✨ Plan with AI</Text>
            <Text style={styles.ctaSubtitle}>
              Tell us your preferences and let our AI create the perfect itinerary
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    gap: 12,
  },
  suggestionChip: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  suggestionText: {
    color: '#0EA5E9',
    fontWeight: '600',
    fontSize: 14,
  },
  destinationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  destinationInfo: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FB923C',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  country: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  seasonText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  aiPlannerCTA: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#E0F2FE',
    textAlign: 'center',
    lineHeight: 20,
  },
});