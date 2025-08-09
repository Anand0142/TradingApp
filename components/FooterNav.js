import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FooterNav = ({ activeTab, onNavigate, onProfile }) => {

  return (
    <View style={styles.container}>
    </View>
  );
};

const styles = StyleSheet.create({
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default FooterNav;
