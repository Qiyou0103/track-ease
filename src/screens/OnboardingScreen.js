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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveBusinessInfo } from '../utils/storage';

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [receiptMessage, setReceiptMessage] = useState('Thank you for your purchase!');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');

  const handleNext = () => {
    if (step === 1) {
      if (!mobileNumber) {
        Alert.alert('Error', 'Please enter your mobile number');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!businessName || !businessType) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const businessInfo = {
      mobileNumber,
      businessName,
      businessType,
      receiptMessage,
      lowStockThreshold: parseInt(lowStockThreshold) || 10,
      createdAt: new Date().toISOString(),
    };

    await saveBusinessInfo(businessInfo);
    await AsyncStorage.setItem('hasLaunched', 'true');
    navigation.replace('Main');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
          <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
          <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
          <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
        </View>

        {/* Step 1: Mobile Number */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Welcome to TrackEase! 🎉</Text>
            <Text style={styles.subtitle}>Let's get you started</Text>
            
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 0123456789"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>
        )}

        {/* Step 2: Business Info */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Tell us about your business</Text>
            
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Kedai Kopi Ah Meng"
              value={businessName}
              onChangeText={setBusinessName}
            />

            <Text style={styles.label}>Business Type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Food & Beverage, Retail, Services"
              value={businessType}
              onChangeText={setBusinessType}
            />
          </View>
        )}

        {/* Step 3: Customization */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Customize your settings</Text>
            
            <Text style={styles.label}>Receipt Thank You Message</Text>
            <TextInput
              style={styles.input}
              placeholder="Thank you for your purchase!"
              value={receiptMessage}
              onChangeText={setReceiptMessage}
              multiline
            />

            <Text style={styles.label}>Low Stock Alert Threshold</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              value={lowStockThreshold}
              onChangeText={setLowStockThreshold}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>
              You'll be alerted when stock falls below this number
            </Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.buttonSecondaryText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleNext}
          >
            <Text style={styles.buttonPrimaryText}>
              {step === 3 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  progressLineActive: {
    backgroundColor: '#4CAF50',
  },
  stepContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});
