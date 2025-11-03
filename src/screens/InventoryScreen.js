import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getProducts, getBusinessInfo } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function InventoryScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [businessInfo, setBusinessInfo] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const loadedProducts = await getProducts();
    const info = await getBusinessInfo();
    setBusinessInfo(info);
    setProducts(loadedProducts);
    setFilteredProducts(loadedProducts);
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const getLowStockProducts = () => {
    const threshold = businessInfo?.lowStockThreshold || 10;
    return products.filter(p => p.quantity <= threshold && p.quantity > 0);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => p.quantity === 0);
  };

  const getTotalValue = () => {
    return products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { deleteProduct } = require('../utils/storage');
            await deleteProduct(product.id);
            loadData();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.lowStockValue]}>
            {getLowStockProducts().length}
          </Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, styles.outOfStockValue]}>
            {getOutOfStockProducts().length}
          </Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>

      {/* Total Value */}
      <View style={styles.totalValueContainer}>
        <Text style={styles.totalValueLabel}>Total Inventory Value</Text>
        <Text style={styles.totalValue}>RM {getTotalValue().toFixed(2)}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Products List */}
      <ScrollView style={styles.productsList}>
        {filteredProducts.map(product => {
          const threshold = businessInfo?.lowStockThreshold || 10;
          const isLowStock = product.quantity <= threshold && product.quantity > 0;
          const isOutOfStock = product.quantity === 0;

          return (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                  {isOutOfStock && (
                    <View style={[styles.badge, styles.badgeDanger]}>
                      <Text style={styles.badgeText}>Out of Stock</Text>
                    </View>
                  )}
                  {isLowStock && (
                    <View style={[styles.badge, styles.badgeWarning]}>
                      <Text style={styles.badgeText}>Low Stock</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.productCategory}>{product.category}</Text>
                <View style={styles.productDetails}>
                  <Text style={styles.productPrice}>RM {product.price.toFixed(2)}</Text>
                  <Text
                    style={[
                      styles.productStock,
                      isOutOfStock && styles.productStockDanger,
                      isLowStock && styles.productStockWarning,
                    ]}
                  >
                    Stock: {product.quantity}
                  </Text>
                </View>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('EditProduct', { product })}
                >
                  <MaterialCommunityIcons name="pencil" size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteProduct(product)}
                >
                  <MaterialCommunityIcons name="delete" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant-closed" size={64} color="#CCC" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No products found' : 'No products yet'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.addProductButton}
                onPress={() => navigation.navigate('AddProduct')}
              >
                <Text style={styles.addProductButtonText}>Add Your First Product</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  lowStockValue: {
    color: '#FF9800',
  },
  outOfStockValue: {
    color: '#F44336',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  totalValueContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  totalValueLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  productsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeWarning: {
    backgroundColor: '#FFF3E0',
  },
  badgeDanger: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  productStock: {
    fontSize: 14,
    color: '#666',
  },
  productStockWarning: {
    color: '#FF9800',
    fontWeight: '600',
  },
  productStockDanger: {
    color: '#F44336',
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  addProductButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addProductButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
