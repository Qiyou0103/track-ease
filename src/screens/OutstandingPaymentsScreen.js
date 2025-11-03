import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getSales, updateSalePaymentStatus } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function OutstandingPaymentsScreen({ navigation }) {
  const [outstandingSales, setOutstandingSales] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadOutstandingPayments();
    }, [])
  );

  const loadOutstandingPayments = async () => {
    const sales = await getSales();
    const outstanding = sales.filter(sale => !sale.isPaid);
    setOutstandingSales(outstanding);
  };

  const handleMarkAsPaid = async (sale) => {
    Alert.alert(
      'Confirm Payment',
      `Mark this sale of RM ${sale.total.toFixed(2)} as paid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Paid',
          onPress: async () => {
            await updateSalePaymentStatus(sale.id, true);
            loadOutstandingPayments();
          },
        },
      ]
    );
  };

  const getTotalOutstanding = () => {
    return outstandingSales.reduce((sum, sale) => sum + sale.total, 0);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Outstanding Payments</Text>
          <Text style={styles.headerSubtitle}>
            {outstandingSales.length} pending payment{outstandingSales.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Total Outstanding */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Outstanding</Text>
        <Text style={styles.totalAmount}>RM {getTotalOutstanding().toFixed(2)}</Text>
      </View>

      {/* Outstanding Sales List */}
      <ScrollView style={styles.salesList}>
        {outstandingSales.map(sale => (
          <View key={sale.id} style={styles.saleCard}>
            <View style={styles.saleHeader}>
              <Text style={styles.saleDate}>
                {new Date(sale.createdAt).toLocaleDateString('en-MY', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Pending</Text>
              </View>
            </View>

            <View style={styles.saleItems}>
              {sale.items.map((item, index) => (
                <Text key={index} style={styles.saleItem}>
                  {item.quantity}x {item.name}
                </Text>
              ))}
            </View>

            <View style={styles.saleFooter}>
              <View>
                <Text style={styles.saleTotal}>RM {sale.total.toFixed(2)}</Text>
                <Text style={styles.saleMethod}>{sale.paymentMethod}</Text>
              </View>
              <TouchableOpacity
                style={styles.markPaidButton}
                onPress={() => handleMarkAsPaid(sale)}
              >
                <MaterialCommunityIcons name="check-circle" size={20} color="#FFF" />
                <Text style={styles.markPaidButtonText}>Mark as Paid</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {outstandingSales.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="check-all" size={64} color="#4CAF50" />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyText}>No outstanding payments</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF9800',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 4,
  },
  totalCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 4,
  },
  salesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  saleCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    elevation: 2,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saleDate: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
  },
  saleItems: {
    marginBottom: 12,
  },
  saleItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  saleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  saleTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  saleMethod: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  markPaidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  markPaidButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
