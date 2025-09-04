import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  type: 'welcome' | 'budget' | 'interests' | 'travel-style' | 'complete';
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    interests: [] as string[],
    travelStyle: '',
  });

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Welcome to TripGenius',
      subtitle: 'Your AI-powered travel companion that creates perfect trips tailored just for you',
      type: 'welcome',
    },
    {
      id: 1,
      title: "What's your travel budget?",
      subtitle: 'Help us suggest trips that fit your spending comfort',
      type: 'budget',
    },
    {
      id: 2,
      title: 'What interests you most?',
      subtitle: 'Select all that apply - we\'ll personalize your recommendations',
      type: 'interests',
    },
    {
      id: 3,
      title: "What's your travel style?",
      subtitle: 'This helps us plan the perfect pace for your trips',
      type: 'travel-style',
    },
    {
      id: 4,
      title: "You're all set! 🎉",
      subtitle: 'Start planning your first AI-powered trip',
      type: 'complete',
    },
  ];

  const budgetOptions = [
    { label: 'Budget-friendly', value: 'budget', range: '₹10,000-25,000' },
    { label: 'Comfortable', value: 'mid', range: '₹25,000-50,000' },
    { label: 'Luxury', value: 'luxury', range: '₹50,000+' },
  ];

  const interestOptions = [
    '🏖️ Beaches & Relaxation',
    '🏔️ Mountains & Adventure',
    '🏛️ History & Culture',
    '🍽️ Food & Culinary',
    '🌃 Nightlife & Entertainment',
    '📸 Photography',
    '🧘 Wellness & Spa',
    '🎨 Art & Museums',
  ];

  const travelStyleOptions = [
    { label: 'Slow & Relaxed', value: 'slow', description: 'Fewer destinations, more time to explore' },
    { label: 'Balanced Explorer', value: 'balanced', description: 'Mix of must-sees and relaxation' },
    { label: 'Adventure Packed', value: 'fast', description: 'Maximum activities and experiences' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to main app
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'welcome':
        return (
          <View style={styles.welcomeContent}>
            <Text style={styles.emoji}>✈️</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="What should we call you?"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholderTextColor="#94A3B8"
            />
          </View>
        );

      case 'budget':
        return (
          <View style={styles.optionsContainer}>
            {budgetOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  formData.budget === option.value && styles.selectedOption,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, budget: option.value }))}
              >
                <Text style={[
                  styles.optionLabel,
                  formData.budget === option.value && styles.selectedOptionText,
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionRange,
                  formData.budget === option.value && styles.selectedOptionSubtext,
                ]}>
                  {option.range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'interests':
        return (
          <View style={styles.interestsGrid}>
            {interestOptions.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestChip,
                  formData.interests.includes(interest) && styles.selectedInterest,
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.interestText,
                  formData.interests.includes(interest) && styles.selectedInterestText,
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'travel-style':
        return (
          <View style={styles.optionsContainer}>
            {travelStyleOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  formData.travelStyle === option.value && styles.selectedOption,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, travelStyle: option.value }))}
              >
                <Text style={[
                  styles.optionLabel,
                  formData.travelStyle === option.value && styles.selectedOptionText,
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  formData.travelStyle === option.value && styles.selectedOptionSubtext,
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'complete':
        return (
          <View style={styles.completeContent}>
            <Text style={styles.completeEmoji}>🎉</Text>
            <Text style={styles.completeText}>
              Perfect! We've created your personalized travel profile.
            </Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your Profile:</Text>
              <Text style={styles.summaryItem}>Budget: {budgetOptions.find(b => b.value === formData.budget)?.label}</Text>
              <Text style={styles.summaryItem}>Interests: {formData.interests.length} selected</Text>
              <Text style={styles.summaryItem}>Style: {travelStyleOptions.find(t => t.value === formData.travelStyle)?.label}</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (steps[currentStep].type) {
      case 'welcome':
        return formData.name.trim().length > 0;
      case 'budget':
        return formData.budget !== '';
      case 'interests':
        return formData.interests.length > 0;
      case 'travel-style':
        return formData.travelStyle !== '';
      case 'complete':
        return true;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.stepCounter}>
          {currentStep + 1} of {steps.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
          
          {renderStepContent()}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={20} color="#64748B" strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.spacer} />
        
        <TouchableOpacity
          style={[styles.nextButton, !isStepComplete() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isStepComplete()}
        >
          <Text style={[
            styles.nextText,
            !isStepComplete() && styles.nextTextDisabled,
          ]}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 2,
  },
  stepCounter: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  welcomeContent: {
    alignItems: 'center',
    gap: 32,
  },
  emoji: {
    fontSize: 64,
  },
  nameInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: '#1E293B',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  selectedOptionText: {
    color: '#0EA5E9',
  },
  optionRange: {
    fontSize: 14,
    color: '#64748B',
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  selectedOptionSubtext: {
    color: '#0284C7',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  interestChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minWidth: 120,
    alignItems: 'center',
  },
  selectedInterest: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  interestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  selectedInterestText: {
    color: '#0EA5E9',
  },
  completeContent: {
    alignItems: 'center',
    gap: 24,
  },
  completeEmoji: {
    fontSize: 64,
  },
  completeText: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 26,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  backText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  nextTextDisabled: {
    color: '#94A3B8',
  },
});