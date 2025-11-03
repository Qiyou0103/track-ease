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
import { getProducts } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SalesScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    const loadedProducts = await getProducts();
    setProducts(loadedProducts);
    setFilteredProducts(loadedProducts);
  };

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const addToCart = (product) => {
    if (product.quantity <= 0) {
      Alert.alert('Out of Stock', 'This product is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        Alert.alert('Insufficient Stock', 'Not enough stock available');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart first');
      return;
    }
    navigation.navigate('Checkout', { cart, onComplete: () => setCart([]) });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Sale</Text>
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

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView style={styles.productsContainer}>
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => {
            const inCart = cart.find(item => item.id === product.id);
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => addToCart(product)}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>RM {product.price.toFixed(2)}</Text>
                  <Text style={styles.productStock}>
                    Stock: {product.quantity}
                  </Text>
                </View>
                {inCart && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{inCart.quantity}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant-closed" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No products found</Text>
            <TouchableOpacity
              style={styles.addProductButton}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Text style={styles.addProductButtonText}>Add Your First Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartSummaryInfo}>
            <Text style={styles.cartCount}>{getCartItemCount()} items</Text>
            <Text style={styles.cartTotal}>RM {getCartTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  productsContainer: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    margin: '1%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF5722',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  cartSummary: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    elevation: 8,
  },
  cartSummaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cartCount: {
    fontSize: 16,
    color: '#666',
  },
  cartTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
