import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BUSINESS_INFO: 'businessInfo',
  PRODUCTS: 'products',
  SALES: 'sales',
  CATEGORIES: 'categories',
};

// Business Info
export const saveBusinessInfo = async (businessInfo) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BUSINESS_INFO, JSON.stringify(businessInfo));
  } catch (error) {
    console.error('Error saving business info:', error);
  }
};

export const getBusinessInfo = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting business info:', error);
    return null;
  }
};

// Products
export const saveProducts = async (products) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

export const getProducts = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const addProduct = async (product) => {
  try {
    const products = await getProducts();
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    await saveProducts(products);
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData };
      await saveProducts(products);
      return products[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const products = await getProducts();
    const filtered = products.filter(p => p.id !== productId);
    await saveProducts(filtered);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// Sales
export const saveSales = async (sales) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch (error) {
    console.error('Error saving sales:', error);
  }
};

export const getSales = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sales:', error);
    return [];
  }
};

export const addSale = async (sale) => {
  try {
    const sales = await getSales();
    const newSale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    sales.push(newSale);
    await saveSales(sales);
    
    // Update inventory
    for (const item of sale.items) {
      await updateProduct(item.id, { 
        quantity: item.newQuantity 
      });
    }
    
    return newSale;
  } catch (error) {
    console.error('Error adding sale:', error);
    return null;
  }
};

export const updateSalePaymentStatus = async (saleId, isPaid) => {
  try {
    const sales = await getSales();
    const index = sales.findIndex(s => s.id === saleId);
    if (index !== -1) {
      sales[index].isPaid = isPaid;
      sales[index].paidAt = isPaid ? new Date().toISOString() : null;
      await saveSales(sales);
      return sales[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating sale payment status:', error);
    return null;
  }
};

// Categories
export const getCategories = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : ['Food', 'Drinks', 'Apparel', 'Other'];
  } catch (error) {
    console.error('Error getting categories:', error);
    return ['Food', 'Drinks', 'Apparel', 'Other'];
  }
};

export const saveCategories = async (categories) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};
