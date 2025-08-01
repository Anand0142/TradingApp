import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import TradeIcon from '../assets/TradeIcon';
import DepositIcon from '../assets/DepositIcon';
import WithdrawIcon from '../assets/WithdrawIcon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';

const COLORS = {
  primaryBackground: '#F0F2F6',
  cardBackground: '#FFFFFF',
  elementBackground: '#E8EDF0',
  borderColor: '#DCDCDC',
  textBlack: '#000000',
  text: 'orange',
  textGray: '#808080',
  accentGreen: '#4CAF50',
  accentYellow: '#FFE535',
  bottomNavIcon: '#808080',
  bottomNavActiveIcon: '#000000',
  redDot: '#FF0000',
};
const AccountCard = ({ account, isSelected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.accountOption, isSelected && styles.selectedAccountOption]}
    onPress={onSelect}
  >
    <View style={styles.accountOptionHeader}>
      <Text style={styles.accountOptionTitle}>
        {account.type} <Text style={styles.accountOptionNumber}>#{account.number}</Text>
      </Text>
      <View style={styles.accountTags}>
        <View style={styles.tagMT5}>
          <Text style={styles.tagText}>MT5</Text>
        </View>
        <View style={account.isDemo ? styles.tagDemo : styles.tagStandard}>
          <Text style={styles.tagText}>{account.isDemo ? 'Demo' : 'Real'}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.accountOptionBalance}>{account.balance} INR</Text>
  </TouchableOpacity>
);

export default function Home(props) {
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({
    id: 1,
    type: 'STANDARD',
    number: '269446202',
    balance: '500.00',
    isDemo: false
  });

  const accounts = [
    {
      id: 1,
      type: 'STANDARD',
      number: '269446202',
      balance: '500.00',
      isDemo: false
    },
    {
      id: 2,
      type: 'DEMO',
      number: '269446203',
      balance: '10,000.00',
      isDemo: true
    },
    // Add more accounts as needed
  ];
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Accounts</Text>
        <View style={styles.headerIconsContainer}>
          <View style={styles.topIcons}>
            <TouchableOpacity style={[styles.iconButton,{fontWeight: 'bold'}]}>
              <Icon name="alarm" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, {marginLeft: 15},{fontWeight: 'bold'}]}>
              <Icon name="bell-outline" size={24} color="black" />
              <View style={styles.notificationDot}></View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Card */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountDetails}>
              <Text>
                <Text style={styles.accountNumber}>STANDARD </Text>
                <Text style={styles.numberText}> # 269446202</Text>
              </Text>
              <View style={styles.accountTags}>
                <View style={styles.tagMT5}>
                  <Text style={styles.tagText}>MT5</Text>
                </View>
                <View style={styles.tagStandard}>
                  <Text style={styles.tagText}>Standard</Text>
                </View>
                <View style={styles.tagDemo}>
                  <Text style={styles.tagText}>Real</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.chevronCircle}
              onPress={() => setShowAccountSwitcher(true)}
            >
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceText}>{selectedAccount.balance} INR</Text>

        <View style={styles.accountActions}>
          <TouchableOpacity style={styles.actionButtonTrade} onPress={() => props.onNavigate && props.onNavigate('trade')}>
            <View style={styles.tradeIconContainer}>
              <TradeIcon size={29} color="black" />
            </View>
            <Text style={styles.tradeText}>Trade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => props.onNavigate && props.onNavigate('deposit')}
           >
            <View style={styles.actionIconContainer}>
              <DepositIcon size={29} color="black" />
            </View>
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <WithdrawIcon size={29} color="black" />
            </View>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Icon name="dots-vertical" size={26} color="black" />
            </View>
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
  <View style={styles.tabsRow}>
    <TouchableOpacity style={styles.tabButtonActive}>
      <Text style={styles.tabTextActive}>Open</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton}>
      <Text style={styles.tabText}>Pending</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabButton}>
      <Text style={styles.tabText}>Closed</Text>
    </TouchableOpacity>
            <TouchableOpacity style={styles.refreshButton}>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrowright}>↑</Text>
                <Text style={styles.arrow}>↓</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomLine} />
        </View>
    <View style={styles.container1}>
      {/* No open positions */}
      <Text style={styles.statusText1}>No open positions</Text>

      {/* Trade box */}
      <View style={styles.tradeBox1}>
        <View style={{ position: 'relative', width: 30, height: 30 }}>
            <Image 
              source={require('../assets/eng.png')} 
              style={{
              width: 24,
              height: 24,
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: 12, 
              zIndex: 1
              }}
              resizeMode="cover"
            />
            <Image 
              source={require('../assets/usd.png')} 
              style={{
              width: 24,
              height: 24,
              position: 'absolute',
              bottom: 0,
              right: 0,
              borderRadius: 12, 
              zIndex: 2
              }}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.tradeText1}>XAU/USD - Trade</Text>
        </View>
          {/* Explore more */}
          <View style={styles.explore1}>
            <MaterialCommunityIcons name="search" size={18} color="#333" />
           <Text style={styles.exploreText1}>Explore more instruments</Text>
          </View>
    </View>
    </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => onNavigate && onNavigate('home')}>
            <Icon name="view-dashboard-outline" size={24} color="black" />
            <Text style={styles.footerTextActive}>Accounts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => props.onNavigate && props.onNavigate('trade')}>
          <View style={{marginBottom: 4}}>
            <TradeIcon size={24} color="#888" />
          </View>
          <Text style={styles.footerText}>Trade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
        <Icon name="web" size={24} color="#888888" />
        <Text style={styles.footerText}>Insights</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => props.onNavigate && props.onNavigate('graph')}>
        <View style={{marginBottom: 4}}>
          <MaterialIcons name="signal-cellular-alt" size={24} color="#888" />
        </View>
        <Text style={styles.footerText}>Performance</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <Icon name="account-circle-outline" size={24} color="#888888" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      </View>

      <StatusBar style="light" />

      {/* Account Switcher Modal */}
      <Modal
        visible={showAccountSwitcher}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccountSwitcher(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAccountSwitcher(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={styles.accountSwitcherContainer}>
          <View style={styles.switcherHeader}>
            <Text style={styles.switcherTitle}>Select Account</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAccountSwitcher(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.accountsList}>
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedAccount.id === account.id}
                onSelect={() => {
                  setSelectedAccount(account);
                  setShowAccountSwitcher(false);
                }}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Account Switcher Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  accountSwitcherContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 30,
  },
  switcherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  switcherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  accountsList: {
    paddingHorizontal: 15,
  },
  accountOption: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedAccountOption: {
    borderColor: 'orange',
    backgroundColor: '#FFF8E1',
  },
  accountOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  accountOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  accountOptionNumber: {
    color: '#666',
  },
  accountOptionBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#F4F4F4',
    paddingTop: 3,
    marginBottom: 15,
    marginTop: 8,
  },
  headerText: {
    color: COLORS.textBlack,
    fontSize: 35,
    fontWeight: 'bold',
    paddingTop: 63,
    marginLeft:20,
  },
  headerIconsContainer: {
    alignItems: 'flex-end',
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  arrow: {
    fontSize: 14,       
    lineHeight: 16,     
    color: '#B0B0B0', 
    fontWeight: '900',
    marginHorizontal: 1,
  },
  arrowright: {
    fontSize: 14,       
    lineHeight: 16,     
    color: '#B0B0B0', 
    fontWeight: '900',
  },
  
  topIcons: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 12,
  },
  iconButton: {
    width: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginRight:22,
    paddingVertical: 4,
  },
  numberText: {
    fontSize: 14,
    color: '#A9ABAC',      
    fontWeight: '500',    
  },
  notificationDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECECED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:20,
  },
  headerButtonText: {
    color: '#393C3C',
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 7,
  },
  accountCard: { 
    backgroundColor: '#fff',
   borderRadius: 15,
   padding: 15, // Reduced from 20
   marginBottom: 15, // Reduced from 20
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.05,
   shadowRadius: 2,
   elevation: 2,
   marginHorizontal: 15,
   },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountDetails: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  accountNumber: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    marginBottom: 10,
  },
  accountTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10, 
  },
  tagMT5: {
    backgroundColor: '#ECECED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagStandard: {
    backgroundColor: '#ECECED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagDemo: {
    backgroundColor: '#ECECED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagText: {
    color: 'black',
    fontSize: 14,
  },
  chevronCircle: {
    backgroundColor: '#ECECED',
    width: 42,
    height: 42,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginRight:4,
  },
  chevron: {
    color: '#393C3C',
    fontSize: 26,
    marginBottom: 14,
  },
  balanceText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginVertical: 5,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginRight: 6,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  actionButtonTrade: {
    alignItems: 'center',
    width: '22%',
  },
  tradeIconContainer: {
    backgroundColor: '#FFD700',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginRight:2,
  },
  tradeIcon: {
    fontSize: 22,
    color: 'black',
  },
  tradeText: {
    color: '#555657',
    fontSize: 15,
    fontWeight: '400',
    marginRight:8,
  },
  actionIconContainer: {
    backgroundColor: '#ECECED',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 0,
    borderColor: 'white',
  },
  actionIcon: {
    fontSize: 22,
    color: 'white',
  },
  actionText: {
    color: '#555657',
    fontSize: 14,
    fontWeight: '400',
  },
  tabs: {
  marginTop: 20,
  backgroundColor: '#f5f5f5', // Optional
},

tabsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 15,

  // ❌ REMOVE these if still present
  // borderBottomWidth: 1,
  // borderBottomColor: '#333',
},

tabButton: {
  paddingVertical: 12,
  paddingHorizontal: 5,
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
  marginRight: 15,
},

tabButtonActive: {
  paddingVertical: 12,
  paddingHorizontal: 15,
  borderBottomWidth: 2,
  borderBottomColor: 'black', // ✅ This is expected
},
  refreshButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomLine: {
  height: 2,
  backgroundColor: '#EAEAEA',     // ✅ For testing visibility
  marginHorizontal: 15,
  marginTop: -1,               // Optional alignment tweak
},

  emptyStateContainer: {
    padding: 15,
    marginTop: 20,
  },
  placeholderBar: {
    height: 20,
    backgroundColor: '#222',
    borderRadius: 4,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 0.2,
    borderTopColor: '#BFC0BF',
  },
  footerButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  footerButtonActive: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  footerIcon: {
    color: '#888',
    fontSize: 20,
    marginBottom: 6,
  },
  footerText: {
    color: '#888',
    fontSize: 12,
  },
  footerTextActive: {
    color: 'black',
    fontSize: 12,
  },
  container1: {
    padding: 16,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    marginTop: 15,
  },
  statusText1: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
    fontWeight: '500',
  },
  tradeBox1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 17,
    width: 405,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer1: {
    flexDirection: 'row',
    position: 'relative',
    marginRight: 8,
  },
  icon1: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  overlapIcon1: {
    position: 'absolute',
    left: 12,
    top: 0,
    zIndex: 1,
  },
  tradeText1: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  explore1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText1: {
    marginLeft: 4,
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
});
