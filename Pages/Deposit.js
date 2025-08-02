import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Deposit = ({ onNavigate, onDeposit }) => {
  const [amount, setAmount] = useState('');

  const handleContinue = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter at least 1 rupee to proceed.');
    } else {
      try {
        const existing = await AsyncStorage.getItem('userBalance');
        const current = parseFloat(existing) || 0;
        const updated = current + numericAmount;
        await AsyncStorage.setItem('userBalance', updated.toString());
  
        onNavigate && onNavigate('depositStatus', { amount: numericAmount });
      } catch (err) {
        console.error('Failed to update balance:', err);
      }
    }
  };  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate && onNavigate('home')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Enter deposit amount</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
          <Text style={styles.currency}>INR</Text>
        </View>
        <Text style={styles.limitText}>
          0.00 – 10,000,000,000.00 INR
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
    width: '100%',
    justifyContent: 'space-between'
  },
  amountInput: {
    fontSize: 28,
    color: '#000',
    flex: 1
  },
  currency: {
    fontSize: 18,
    color: '#000',
  },
  limitText: {
    fontSize: 12,
    color: '#888',
    marginTop: 10
  },
  continueBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 20,
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  }
});
