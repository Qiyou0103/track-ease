import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { getSales } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ReportsScreen({ navigation }) {
  const [sales, setSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('daily'); // daily, weekly, monthly

  useFocusEffect(
    React.useCallback(() => {
      loadSales();
    }, [])
  );

  const loadSales = async () => {
    const loadedSales = await getSales();
    setSales(loadedSales);
  };

  const getFilteredSales = () => {
    if (viewMode === 'daily') {
      return sales.filter(
        sale => new Date(sale.createdAt).toDateString() === new Date(selectedDate).toDateString()
      );
    } else if (viewMode === 'weekly') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= weekStart && saleDate <= weekEnd;
      });
    } else {
      const month = new Date(selectedDate).getMonth();
      const year = new Date(selectedDate).getFullYear();
      
      return sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getMonth() === month && saleDate.getFullYear() === year;
      });
    }
  };

  const calculateStats = () => {
    const filtered = getFilteredSales();
    const totalSales = filtered.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = filtered.length;
    const paidSales = filtered.filter(s => s.isPaid);
    const unpaidSales = filtered.filter(s => !s.isPaid);
    const totalPaid = paidSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalUnpaid = unpaidSales.reduce((sum, sale) => sum + sale.total, 0);

    // Payment method breakdown
    const paymentBreakdown = {};
    filtered.forEach(sale => {
      if (paymentBreakdown[sale.paymentMethod]) {
        paymentBreakdown[sale.paymentMethod] += sale.total;
      } else {
        paymentBreakdown[sale.paymentMethod] = sale.total;
      }
    });

    return {
      totalSales,
      totalTransactions,
      totalPaid,
      totalUnpaid,
      paidCount: paidSales.length,
      unpaidCount: unpaidSales.length,
      paymentBreakdown,
    };
  };

  const stats = calculateStats();

  const markedDates = {};
  sales.forEach(sale => {
    const date = new Date(sale.createdAt).toISOString().split('T')[0];
    markedDates[date] = { marked: true, dotColor: '#4CAF50' };
  });
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: '#4CAF50',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sales Reports</Text>
      </View>

      {/* View Mode Selector */}
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'daily' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('daily')}
        >
          <Text style={[styles.viewModeText, viewMode === 'daily' && styles.viewModeTextActive]}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'weekly' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('weekly')}
        >
          <Text style={[styles.viewModeText, viewMode === 'weekly' && styles.viewModeTextActive]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'monthly' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('monthly')}
        >
          <Text style={[styles.viewModeText, viewMode === 'monthly' && styles.viewModeTextActive]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            todayTextColor: '#4CAF50',
            selectedDayBackgroundColor: '#4CAF50',
            dotColor: '#4CAF50',
            arrowColor: '#4CAF50',
          }}
        />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="cash-multiple" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>RM {stats.totalSales.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Sales</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="cart-check" size={32} color="#2196F3" />
          <Text style={styles.statValue}>{stats.totalTransactions}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="check-circle" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>RM {stats.totalPaid.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Paid ({stats.paidCount})</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="clock-alert" size={32} color="#FF9800" />
          <Text style={styles.statValue}>RM {stats.totalUnpaid.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Pending ({stats.unpaidCount})</Text>
        </View>
      </View>

      {/* Payment Method Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        {Object.entries(stats.paymentBreakdown).map(([method, amount]) => (
          <View key={method} style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodInfo}>
              <MaterialCommunityIcons
                name={
                  method === 'Cash' ? 'cash' :
                  method === 'DuitNow' ? 'qrcode' :
                  method === 'BankTransfer' ? 'bank-transfer' :
                  'credit-card-clock'
                }
                size={24}
                color="#666"
              />
              <Text style={styles.paymentMethodName}>{method}</Text>
            </View>
            <Text style={styles.paymentMethodAmount}>RM {amount.toFixed(2)}</Text>
          </View>
        ))}
        
        {Object.keys(stats.paymentBreakdown).length === 0 && (
          <Text style={styles.emptyText}>No transactions for this period</Text>
        )}
      </View>

      {/* Quick Link to Outstanding Payments */}
      {stats.unpaidCount > 0 && (
        <TouchableOpacity
          style={styles.outstandingBanner}
          onPress={() => navigation.navigate('OutstandingPayments')}
        >
          <View style={styles.outstandingInfo}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#FF9800" />
            <View style={styles.outstandingText}>
              <Text style={styles.outstandingTitle}>
                {stats.unpaidCount} Outstanding Payment{stats.unpaidCount > 1 ? 's' : ''}
              </Text>
              <Text style={styles.outstandingAmount}>RM {stats.totalUnpaid.toFixed(2)}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FF9800" />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  viewModeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  viewModeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  viewModeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  viewModeTextActive: {
    color: '#FFF',
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  paymentMethodAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 16,
  },
  outstandingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  outstandingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  outstandingText: {
    marginLeft: 12,
    flex: 1,
  },
  outstandingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  outstandingAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 2,
  },
});
