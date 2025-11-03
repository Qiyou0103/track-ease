import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBusinessInfo, getSales, getProducts } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen({ navigation }) {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [todayStats, setTodayStats] = useState({
    sales: 0,
    transactions: 0,
    topProducts: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    const info = await getBusinessInfo();
    setBusinessInfo(info);

    const sales = await getSales();
    const products = await getProducts();

    // Calculate today's stats
    const today = new Date().toDateString();
    const todaySales = sales.filter(
      sale => new Date(sale.createdAt).toDateString() === today
    );

    const totalSales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const transactionCount = todaySales.length;

    // Calculate top products
    const productCounts = {};
    todaySales.forEach(sale => {
      sale.items.forEach(item => {
        if (productCounts[item.name]) {
          productCounts[item.name] += item.quantity;
        } else {
          productCounts[item.name] = item.quantity;
        }
      });
    });

    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setTodayStats({
      sales: totalSales,
      transactions: transactionCount,
      topProducts,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Selamat Datang! 👋</Text>
          <Text style={styles.businessName}>
            {businessInfo?.businessName || 'Your Business'}
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="cash" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>RM {todayStats.sales.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Today's Sales</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="cart-check" size={32} color="#2196F3" />
          <Text style={styles.statValue}>{todayStats.transactions}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
      </View>

      {/* Top Selling Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Today</Text>
        {todayStats.topProducts.length > 0 ? (
          todayStats.topProducts.map((product, index) => (
            <View key={index} style={styles.topProductItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.topProductInfo}>
                <Text style={styles.topProductName}>{product.name}</Text>
                <Text style={styles.topProductCount}>{product.count} sold</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chart-box-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No sales today yet</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Sales')}
          >
            <MaterialCommunityIcons name="cart-plus" size={32} color="#4CAF50" />
            <Text style={styles.actionText}>New Sale</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <MaterialCommunityIcons name="package-variant-plus" size={32} color="#FF9800" />
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('OutstandingPayments')}
          >
            <MaterialCommunityIcons name="credit-card-clock" size={32} color="#F44336" />
            <Text style={styles.actionText}>Payments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Inventory')}
          >
            <MaterialCommunityIcons name="package-variant" size={32} color="#9C27B0" />
            <Text style={styles.actionText}>Inventory</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  topProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  topProductCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
});
