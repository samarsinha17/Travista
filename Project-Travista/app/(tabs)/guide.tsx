import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Send, Bot, User, MapPin, Clock } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function GuideScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content:
        "Hi! I'm your personal AI travel guide. I can help you with anything during your trip - from finding the best local restaurants to navigating public transport. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickSuggestions = [
    '🍽️ Best restaurants nearby',
    '🚌 How to get to Red Fort',
    '💰 Budget-friendly activities',
    '🌅 Best time to visit monuments',
  ];

  const handleSend = () => {
    if (inputText.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: inputText.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: getAIResponse(inputText.trim()),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('restaurant') || input.includes('food') || input.includes('eat')) {
      return "Based on your location and budget preferences, here are the top 3 restaurants nearby:\n\n🥘 Spice Garden (0.3 km)\n• Authentic North Indian cuisine\n• Budget: ₹500-800 per person\n• Open until 11 PM\n\n🍝 Café Milano (0.5 km)\n• Italian & Continental\n• Budget: ₹300-600 per person\n• Great for quick meals\n\n🌮 Street Food Corner (0.2 km)\n• Local street food\n• Budget: ₹100-200 per person\n• Must-try: Pav Bhaji & Dosa";
    }
    
    if (input.includes('transport') || input.includes('metro') || input.includes('bus')) {
      return "Here's how to reach Red Fort from your location:\n\n🚇 Metro Route (Recommended):\n• Walk 5 min to Connaught Place Metro\n• Take Yellow Line to Chandni Chowk\n• 15 min ride, ₹25 fare\n• 10 min walk to Red Fort\n\n🚌 Bus Route:\n• Bus stop 200m away\n• Route 181 or 405\n• 25 min journey, ₹15 fare\n\n🚗 Auto/Cab:\n• 20 min ride\n• Auto: ₹120-150\n• Cab: ₹180-220";
    }

    return "I'd be happy to help with that! Could you provide more specific details about what you're looking for? For example, are you interested in:\n\n• Nearby attractions and their timings\n• Restaurant recommendations within your budget\n• Transportation options\n• Local cultural experiences\n• Safety tips for the area\n\nJust let me know what interests you most!";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Travel Guide</Text>
        <View style={styles.locationBadge}>
          <MapPin size={14} color="#10B981" strokeWidth={2} />
          <Text style={styles.locationText}>Delhi</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer,
            ]}
          >
            <View style={styles.messageHeader}>
              <View style={styles.messageIcon}>
                {message.type === 'user' ? (
                  <User size={16} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <Bot size={16} color="#FFFFFF" strokeWidth={2} />
                )}
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try asking about:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.suggestionRow}>
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => setInputText(suggestion.replace(/[🍽️🚌💰🌅]/g, '').trim())}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything about your trip..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Send
            size={20}
            color={inputText.trim() ? '#FFFFFF' : '#94A3B8'}
            strokeWidth={2}
          />
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
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    maxWidth: '85%',
    gap: 8,
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  messageContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 6,
  },
  messageTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  suggestionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
});