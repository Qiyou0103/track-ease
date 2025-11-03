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
import { addProduct, getCategories } from '../utils/storage';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Food');
  const [image, setImage] = useState(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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

  const handleSave = async () => {
    if (!name || !price || !quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const product = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      image,
    };

    const newProduct = await addProduct(product);

    if (newProduct) {
      Alert.alert('Success', 'Product added successfully', [
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

        {/* Opening Quantity */}
        <Text style={styles.label}>
          Opening Stock <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="number-pad"
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add Product</Text>
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
