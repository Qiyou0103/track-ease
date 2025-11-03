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
import { getBusinessInfo, saveBusinessInfo, getCategories, saveCategories } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

  useEffect(() => {
    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    const info = await getBusinessInfo();
    setBusinessInfo(info);
    setEditedInfo(info || {});
  };

  const handleSave = async () => {
    await saveBusinessInfo(editedInfo);
    setBusinessInfo(editedInfo);
    setIsEditing(false);
    Alert.alert('Success', 'Settings updated successfully');
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset Application',
      'Are you sure you want to reset the app? This will delete all data including products, sales, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert(
              'App Reset',
              'The app has been reset. Please restart the app.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  if (!businessInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <MaterialCommunityIcons
            name={isEditing ? 'check' : 'pencil'}
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      {/* Business Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Business Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.settingInput}
              value={editedInfo.businessName}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, businessName: text })
              }
            />
          ) : (
            <Text style={styles.settingValue}>{businessInfo.businessName}</Text>
          )}
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Business Type</Text>
          {isEditing ? (
            <TextInput
              style={styles.settingInput}
              value={editedInfo.businessType}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, businessType: text })
              }
            />
          ) : (
            <Text style={styles.settingValue}>{businessInfo.businessType}</Text>
          )}
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Mobile Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.settingInput}
              value={editedInfo.mobileNumber}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, mobileNumber: text })
              }
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.settingValue}>{businessInfo.mobileNumber}</Text>
          )}
        </View>
      </View>

      {/* Receipt Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receipt Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Thank You Message</Text>
          {isEditing ? (
            <TextInput
              style={[styles.settingInput, styles.settingInputMultiline]}
              value={editedInfo.receiptMessage}
              onChangeText={(text) =>
                setEditedInfo({ ...editedInfo, receiptMessage: text })
              }
              multiline
            />
          ) : (
            <Text style={styles.settingValue}>{businessInfo.receiptMessage}</Text>
          )}
        </View>
      </View>

      {/* Inventory Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Low Stock Alert Threshold</Text>
          {isEditing ? (
            <TextInput
              style={styles.settingInput}
              value={editedInfo.lowStockThreshold?.toString()}
              onChangeText={(text) =>
                setEditedInfo({
                  ...editedInfo,
                  lowStockThreshold: parseInt(text) || 0,
                })
              }
              keyboardType="number-pad"
            />
          ) : (
            <Text style={styles.settingValue}>
              {businessInfo.lowStockThreshold} units
            </Text>
          )}
        </View>
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="information" size={24} color="#666" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar" size={24} color="#666" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {new Date(businessInfo.createdAt).toLocaleDateString('en-MY', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={handleResetApp}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
          <View style={styles.dangerButtonText}>
            <Text style={styles.dangerButtonTitle}>Reset Application</Text>
            <Text style={styles.dangerButtonSubtitle}>
              Delete all data and start fresh
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  settingValue: {
    fontSize: 16,
    color: '#333',
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  settingInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  dangerTitle: {
    color: '#F44336',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  dangerButtonText: {
    marginLeft: 16,
    flex: 1,
  },
  dangerButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  dangerButtonSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
