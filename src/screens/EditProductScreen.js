import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateProduct } from '../utils/storage';

export default function EditProductScreen({ route, navigation }) {
  const { product } = route.params;
  
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [category, setCategory] = useState(product.category);
  const [image, setImage] = useState(product.image);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [adjustmentMode, setAdjustmentMode] = useState(false);
  const [adjustment, setAdjustment] = useState('');

  const categories = ['Food', 'Drinks', 'Apparel', 'Other'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdjustStock = (type) => {
    if (!adjustment || parseInt(adjustment) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const adjustmentValue = parseInt(adjustment);
    const currentQty = parseInt(quantity);

    if (type === 'add') {
      setQuantity((currentQty + adjustmentValue).toString());
    } else {
      const newQty = Math.max(0, currentQty - adjustmentValue);
      setQuantity(newQty.toString());
    }

    setAdjustment('');
    setAdjustmentMode(false);
  };

  const handleSave = async () => {
    if (!name || !price || quantity === '') {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedProduct = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      image,
    };

    const result = await updateProduct(product.id, updatedProduct);

    if (result) {
      Alert.alert('Success', 'Product updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <img src={image} style={styles.image} alt="Product" />
          ) : (
            <>
              <MaterialCommunityIcons name="camera-plus" size={48} color="#999" />
              <Text style={styles.imagePickerText}>Add Photo (Optional)</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Product Name */}
        <Text style={styles.label}>
          Product Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Nasi Lemak Biasa"
          value={name}
          onChangeText={setName}
        />

        {/* Category */}
        <Text style={styles.label}>
          Category <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text style={styles.pickerButtonText}>{category}</Text>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>

        {showCategoryPicker && (
          <View style={styles.pickerOptions}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={styles.pickerOption}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    category === cat && styles.pickerOptionTextActive,
                  ]}
                >
                  {cat}
                </Text>
                {category === cat && (
                  <MaterialCommunityIcons name="check" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Price */}
        <Text style={styles.label}>
          Price (RM) <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        {/* Stock Management */}
        <View style={styles.stockSection}>
          <View style={styles.stockHeader}>
            <Text style={styles.label}>Current Stock</Text>
            <TouchableOpacity
              onPress={() => setAdjustmentMode(!adjustmentMode)}
            >
              <Text style={styles.adjustLink}>
                {adjustmentMode ? 'Cancel' : 'Adjust Stock'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.stockDisplay}>
            <Text style={styles.stockValue}>{quantity}</Text>
            <Text style={styles.stockUnit}>units</Text>
          </View>

          {adjustmentMode && (
            <View style={styles.adjustmentPanel}>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                value={adjustment}
                onChangeText={setAdjustment}
                keyboardType="number-pad"
              />
              <View style={styles.adjustmentButtons}>
                <TouchableOpacity
                  style={[styles.adjustButton, styles.adjustButtonAdd]}
                  onPress={() => handleAdjustStock('add')}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
                  <Text style={styles.adjustButtonText}>Add Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.adjustButton, styles.adjustButtonRemove]}
                  onPress={() => handleAdjustStock('remove')}
                >
                  <MaterialCommunityIcons name="minus" size={20} color="#FFF" />
                  <Text style={styles.adjustButtonText}>Remove Stock</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  imagePicker: {
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptions: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  stockSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adjustLink: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  stockDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  stockValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  stockUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  adjustmentPanel: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  adjustmentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  adjustButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  adjustButtonAdd: {
    backgroundColor: '#4CAF50',
  },
  adjustButtonRemove: {
    backgroundColor: '#FF9800',
  },
  adjustButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
