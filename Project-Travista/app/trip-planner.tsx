import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { CalendarDays, Users, DollarSign, MapPin, ChevronLeft, Sparkles, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';

interface ItineraryVariant {
  id: string;
  name: string;
  totalCost: number;
  highlights: string[];
  pace: string;
}

export default function TripPlannerScreen() {
  const [step, setStep] = useState<'input' | 'planning' | 'results'>('input');
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 'mid',
    interests: [] as string[],
  });

  const [generatingPlan, setGeneratingPlan] = useState(false);

  const itineraryVariants: ItineraryVariant[] = [
    {
      id: 'budget',
      name: 'Budget Explorer',
      totalCost: 18500,
      highlights: ['Local experiences', 'Budget accommodations', 'Street food tours'],
      pace: 'Relaxed',
    },
    {
      id: 'balanced',
      name: 'Perfect Balance',
      totalCost: 32000,
      highlights: ['Mix of premium & local', 'Comfortable stays', 'Must-see attractions'],
      pace: 'Moderate',
    },
    {
      id: 'luxury',
      name: 'Luxury Escape',
      totalCost: 55000,
      highlights: ['5-star experiences', 'Private tours', 'Fine dining'],
      pace: 'Curated',
    },
  ];

  const handleGeneratePlan = () => {
    setGeneratingPlan(true);
    setStep('planning');
    
    // Simulate AI planning process
    setTimeout(() => {
      setGeneratingPlan(false);
      setStep('results');
    }, 3000);
  };

  const renderInputStep = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputTitle}>Let's plan your perfect trip</Text>
      
      {/* Destination */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Where do you want to go?</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Search destinations..."
          value={tripData.destination}
          onChangeText={(text) => setTripData(prev => ({ ...prev, destination: text }))}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Dates */}
      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Start Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <CalendarDays size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.dateText}>Select date</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>End Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <CalendarDays size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.dateText}>Select date</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Travelers */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Number of travelers</Text>
        <View style={styles.travelerSelector}>
          <TouchableOpacity
            style={styles.travelerButton}
            onPress={() => setTripData(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
          >
            <Text style={styles.travelerButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.travelerCount}>
            <Users size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.travelerText}>{tripData.travelers}</Text>
          </View>
          <TouchableOpacity
            style={styles.travelerButton}
            onPress={() => setTripData(prev => ({ ...prev, travelers: prev.travelers + 1 }))}
          >
            <Text style={styles.travelerButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Budget Range */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Budget preference</Text>
        <View style={styles.budgetOptions}>
          {[
            { value: 'budget', label: 'Budget', range: '₹10-25K' },
            { value: 'mid', label: 'Comfort', range: '₹25-50K' },
            { value: 'luxury', label: 'Luxury', range: '₹50K+' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.budgetOption,
                tripData.budget === option.value && styles.selectedBudget,
              ]}
              onPress={() => setTripData(prev => ({ ...prev, budget: option.value }))}
            >
              <Text style={[
                styles.budgetLabel,
                tripData.budget === option.value && styles.selectedBudgetText,
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.budgetRange,
                tripData.budget === option.value && styles.selectedBudgetRange,
              ]}>
                {option.range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, !tripData.destination && styles.generateButtonDisabled]}
        onPress={handleGeneratePlan}
        disabled={!tripData.destination || generatingPlan}
      >
        <Sparkles size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.generateText}>Generate AI Itinerary</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlanningStep = () => (
    <View style={styles.planningContainer}>
      <View style={styles.aiAnimation}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.aiEmoji}>🤖</Text>
      </View>
      
      <Text style={styles.planningTitle}>Creating your perfect trip...</Text>
      <Text style={styles.planningSubtitle}>
        Our AI is analyzing {tripData.destination} and crafting 3 unique itineraries based on your preferences
      </Text>

      <View style={styles.planningSteps}>
        {[
          'Analyzing destination data',
          'Checking weather & seasons',
          'Finding best accommodations',
          'Creating day-by-day plans',
          'Optimizing routes & timing',
        ].map((step, index) => (
          <View key={index} style={styles.planningStep}>
            <CheckCircle size={16} color="#10B981" strokeWidth={2} />
            <Text style={styles.planningStepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderResultsStep = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Your AI-Generated Itineraries</Text>
      <Text style={styles.resultsSubtitle}>
        Choose the plan that matches your style - you can customize it later
      </Text>

      {itineraryVariants.map((variant) => (
        <TouchableOpacity key={variant.id} style={styles.variantCard}>
          <View style={styles.variantHeader}>
            <Text style={styles.variantName}>{variant.name}</Text>
            <Text style={styles.variantCost}>₹{variant.totalCost.toLocaleString()}</Text>
          </View>
          
          <View style={styles.variantDetails}>
            <View style={styles.paceContainer}>
              <Clock size={14} color="#64748B" strokeWidth={2} />
              <Text style={styles.paceText}>{variant.pace} pace</Text>
            </View>
            
            <View style={styles.highlightsContainer}>
              {variant.highlights.map((highlight, index) => (
                <Text key={index} style={styles.highlight}>• {highlight}</Text>
              ))}
            </View>
          </View>

          <View style={styles.variantFooter}>
            <Text style={styles.variantDuration}>5 days, 4 nights</Text>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectText}>Select Plan</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1E293B" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Planner</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'input' && renderInputStep()}
        {step === 'planning' && renderPlanningStep()}
        {step === 'results' && renderResultsStep()}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    padding: 20,
  },
  inputTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  travelerSelector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  travelerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  travelerButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748B',
  },
  travelerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  travelerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  budgetOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectedBudget: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  selectedBudgetText: {
    color: '#0EA5E9',
  },
  budgetRange: {
    fontSize: 12,
    color: '#64748B',
  },
  selectedBudgetRange: {
    color: '#0284C7',
  },
  generateButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 32,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planningContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  aiAnimation: {
    alignItems: 'center',
    marginBottom: 32,
  },
  aiEmoji: {
    fontSize: 48,
    marginTop: 16,
  },
  planningTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  planningSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  planningSteps: {
    width: '100%',
    gap: 12,
  },
  planningStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  planningStepText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  variantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  variantName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  variantCost: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  variantDetails: {
    marginBottom: 16,
  },
  paceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  paceText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  highlightsContainer: {
    gap: 4,
  },
  highlight: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  variantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variantDuration: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  selectButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});