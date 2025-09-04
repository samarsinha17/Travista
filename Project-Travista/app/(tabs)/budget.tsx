import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plane,
  Bed,
  UtensilsCrossed,
  Camera,
  Car,
} from 'lucide-react-native';

export default function BudgetScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const budgetData = {
    totalSpent: 75000,
    totalBudget: 120000,
    savingsRate: 0.375,
    monthlyTrend: 0.12,
  };

  const categories = [
    {
      name: 'Flights',
      icon: Plane,
      spent: 28000,
      budget: 35000,
      color: '#0EA5E9',
    },
    {
      name: 'Hotels',
      icon: Bed,
      spent: 22000,
      budget: 30000,
      color: '#8B5CF6',
    },
    {
      name: 'Food',
      icon: UtensilsCrossed,
      spent: 15000,
      budget: 25000,
      color: '#FB923C',
    },
    {
      name: 'Activities',
      icon: Camera,
      spent: 8000,
      budget: 20000,
      color: '#10B981',
    },
    {
      name: 'Transport',
      icon: Car,
      spent: 2000,
      budget: 10000,
      color: '#EF4444',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'Flight to Goa',
      amount: -12500,
      date: 'Dec 10',
      category: 'Flights',
    },
    {
      id: 2,
      description: 'Hotel Booking',
      amount: -8500,
      date: 'Dec 8',
      category: 'Hotels',
    },
    {
      id: 3,
      description: 'Cashback Reward',
      amount: 750,
      date: 'Dec 5',
      category: 'Rewards',
    },
  ];

  const progressPercentage = (budgetData.totalSpent / budgetData.totalBudget) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Budget Tracker</Text>
          <TouchableOpacity style={styles.addExpenseButton}>
            <Text style={styles.addExpenseText}>+ Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Budget Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Total Budget</Text>
            <View style={styles.trendContainer}>
              <TrendingUp size={16} color="#10B981" strokeWidth={2} />
              <Text style={styles.trendText}>+{Math.round(budgetData.monthlyTrend * 100)}%</Text>
            </View>
          </View>

          <Text style={styles.spentAmount}>₹{budgetData.totalSpent.toLocaleString()}</Text>
          <Text style={styles.budgetAmount}>of ₹{budgetData.totalBudget.toLocaleString()}</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progressPercentage)}% used</Text>
          </View>

          <Text style={styles.savingsText}>
            You're saving {Math.round(budgetData.savingsRate * 100)}% compared to last month
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodTab, selectedPeriod === period && styles.activePeriodTab]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodTabText,
                  selectedPeriod === period && styles.activePeriodTabText,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {categories.map((category) => {
            const IconComponent = category.icon;
            const percentage = (category.spent / category.budget) * 100;

            return (
              <TouchableOpacity key={category.name} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIconContainer}>
                    <IconComponent size={20} color={category.color} strokeWidth={2} />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>
                    ₹{category.spent.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.categoryProgress}>
                  <View style={styles.categoryProgressBar}>
                    <View
                      style={[
                        styles.categoryProgressFill,
                        { width: `${Math.min(percentage, 100)}%`, backgroundColor: category.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryBudget}>
                    of ₹{category.budget.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text
                  style={[
                    styles.transactionAmountText,
                    transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount,
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}₹
                  {Math.abs(transaction.amount).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
  addExpenseButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addExpenseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  spentAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activePeriodTabText: {
    color: '#0EA5E9',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  categoryProgress: {
    gap: 6,
  },
  categoryProgressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryBudget: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#64748B',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  positiveAmount: {
    color: '#10B981',
  },
  negativeAmount: {
    color: '#EF4444',
  },
});