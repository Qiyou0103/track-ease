import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addSale } from '../utils/storage';
import * as Sharing from 'expo-sharing';

export default function CheckoutScreen({ route, navigation }) {
  const { cart, onComplete } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');

  const paymentMethods = [
    { id: 'Cash', name: 'Cash', icon: 'cash' },
    { id: 'DuitNow', name: 'DuitNow QR', icon: 'qrcode' },
    { id: 'BankTransfer', name: 'Bank Transfer', icon: 'bank-transfer' },
    { id: 'PayLater', name: 'Pay Later', icon: 'credit-card-clock' },
  ];

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCompleteSale = async () => {
    const sale = {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        newQuantity: item.quantity - item.quantity, // Will be updated in storage
      })),
      total: getTotal(),
      paymentMethod: selectedPaymentMethod,
      isPaid: selectedPaymentMethod !== 'PayLater',
      date: new Date().toISOString(),
    };

    // Update cart items with new quantities
    sale.items = sale.items.map(item => {
      const product = cart.find(p => p.id === item.id);
      return {
        ...item,
        newQuantity: product.quantity - item.quantity,
      };
    });

    const newSale = await addSale(sale);

    if (newSale) {
      Alert.alert(
        'Sale Completed!',
        'The sale has been recorded successfully.',
        [
          {
            text: 'Share Receipt',
            onPress: () => shareReceipt(newSale),
          },
          {
            text: 'Done',
            onPress: () => {
              onComplete();
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  const shareReceipt = async (sale) => {
    const receiptText = generateReceiptText(sale);
    
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // In a real app, you'd create a file and share it
        // For now, we'll just show the receipt text
        Alert.alert('Receipt', receiptText);
      }
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  const generateReceiptText = (sale) => {
    let receipt = '=== RECEIPT ===\n\n';
    sale.items.forEach(item => {
      receipt += `${item.name}\n`;
      receipt += `${item.quantity} x RM ${item.price.toFixed(2)} = RM ${(item.quantity * item.price).toFixed(2)}\n\n`;
    });
    receipt += `Total: RM ${sale.total.toFixed(2)}\n`;
    receipt += `Payment: ${sale.paymentMethod}\n`;
    receipt += `Date: ${new Date(sale.date).toLocaleString()}\n\n`;
    receipt += 'Thank you for your purchase!\n';
    return receipt;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemDetails}>
                  {item.quantity} x RM {item.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.orderItemTotal}>
                RM {(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.paymentMethodActive
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodInfo}>
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={selectedPaymentMethod === method.id ? '#4CAF50' : '#666'}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === method.id && styles.paymentMethodTextActive
                  ]}
                >
                  {method.name}
                </Text>
              </View>
              {selectedPaymentMethod === method.id && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Total and Complete Button */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>RM {getTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteSale}
        >
          <Text style={styles.completeButtonText}>Complete Sale</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderItemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EEE',
    marginBottom: 12,
  },
  paymentMethodActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  paymentMethodTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
