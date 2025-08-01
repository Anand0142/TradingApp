import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DepositStatus = ({ onNavigate, onDepositSuccess, amount = '123.00' }) => {
  // Ensure the amount is shown as two decimals
  const formattedAmount = parseFloat(amount || '0').toFixed(2);
  
  // Handle continue button press
  const handleContinue = () => {
    // Call the success callback with the deposit amount
    if (onDepositSuccess) {
      onDepositSuccess(amount);
    }
    // Navigate to home
    onNavigate && onNavigate('home');
  };

  return (
    <View style={styles.container}>
      {/* Header like Deposit Page */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate && onNavigate('Deposit')}>
          <MaterialCommunityIcons name="close" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit Status</Text>
      </View>

      {/* Message */}
      <View style={styles.content}>
        <Text style={styles.subTitle}>Deposit is in Your Account!</Text>
        <Text style={styles.message}>
          Your deposit is accepted. You can start trading now.
        </Text>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={styles.statusValueContainer}>
              <View style={styles.greenDot} />
              <Text style={styles.acceptedText}>Accepted</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Transaction amount</Text>
            <Text style={styles.amountText}>{formattedAmount} USD</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DepositStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F9F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  content: {
    alignItems: 'center',
    marginTop: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#000',
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    color: '#444',
    marginBottom: 40,
    fontWeight: '500',
  },
  statusCard: {
    backgroundColor: '#FFFEFE',
    borderRadius: 5,
    padding: 15,
    width: '100%',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: '#777',
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C781',
    marginRight: 6,
  },
  acceptedText: {
    fontSize: 14,
    color: '#00C781',
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  continueBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  }
});
