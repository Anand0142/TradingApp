import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import TradeIcon from '../assets/TradeIcon';
import DepositIcon from '../assets/DepositIcon';
import WithdrawIcon from '../assets/WithdrawIcon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Deposit from './Deposit';
import DepositStatus from './depositStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import RemixIcon from 'react-native-remix-icon';




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
export default function Home(props) {
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [accountTab, setAccountTab] = useState('real');
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [activeTab, setActiveTab] = useState('open'); // 'open', 'pending', 'closed'

  const [accounts, setAccounts] = useState([
    {
      id: 1,
      type: 'STANDARD',
      number: '269446202',
      balance: 10.00,
      isDemo: false,
      name: '',
      customId: ''
    },
    {
      id: 2,
      type: 'DEMO',
      number: '269446203',
      balance: 10.00,
      isDemo: true,
      name: '',
      customId: ''
    },
  ]);
  
  const [selectedAccount, setSelectedAccount] = useState(undefined); 
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});

  const handleNavigation = (screen, params = {}) => {
    console.log('Navigating to:', screen, 'with params:', params);
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const handleDeposit = (updatedAccounts, updatedSelected) => {
    setAccounts(updatedAccounts);
    setSelectedAccount(updatedSelected);
  };
  
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const savedAccounts = await AsyncStorage.getItem('accountsData');
        const savedSelectedId = await AsyncStorage.getItem('selectedAccountId'); 
  
        if (savedAccounts) {
          const parsed = JSON.parse(savedAccounts);
          setAccounts(parsed);
  
          let selectedAccountToSet = null;
  
          if (savedSelectedId) {
            selectedAccountToSet = parsed.find(acc => acc.id === Number(savedSelectedId));
          }
  
          if (!selectedAccountToSet) {
            // fallback to STANDARD or first account
            selectedAccountToSet = parsed.find(acc => acc.type === 'STANDARD') || parsed[0];
          }
  
          setSelectedAccount(selectedAccountToSet);
          console.log(" SelectedAccount set to:", selectedAccountToSet);
        } else {
          // No saved data; use default accounts
          await AsyncStorage.setItem('accountsData', JSON.stringify(accounts));
          setSelectedAccount(accounts[0]);
          console.log(" No accounts saved yet. Using default account:", accounts[0]);
        }
      } catch (err) {
        console.error('Error loading accounts:', err);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadAccounts();
  }, []);
   
  // Render Deposit Status Screen
  if (currentScreen === 'depositStatus') {
    console.log('Rendering DepositStatus with amount:', screenParams.amount);
    return (
      <DepositStatus 
        amount={screenParams.amount || 0} 
        onNavigate={handleNavigation} 
      />
    );
  }
  
  // Render Deposit Screen
  if (currentScreen === 'deposit') {
    if (!selectedAccount) {
      console.log('No selected account, cannot render Deposit');
      return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>No account selected. Please select an account first.</Text>
          <TouchableOpacity 
            style={{ marginTop: 20, padding: 10, backgroundColor: '#FFD700', borderRadius: 5 }}
            onPress={() => setCurrentScreen('home')}
          >
            <Text>Back to Home</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    console.log('Rendering Deposit with account:', selectedAccount);
    return (
      <Deposit
        key={`deposit-${selectedAccount.id}`}
        onNavigate={handleNavigation}
        selectedAccount={selectedAccount}
        onDeposit={handleDeposit}
      />
    );
  }
  
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }  
  
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
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowAccountDialog(true)}>
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
                <Text style={styles.accountNumber}>{selectedAccount.name?.trim() || selectedAccount.name}
                </Text>
                <Text style={styles.accountNumber}>#{selectedAccount.customId?.trim() || selectedAccount.number}</Text>
              </Text>
              <View style={styles.accountTags}>
                <View style={styles.tagMT5}>
                  <Text style={styles.tagText}>MT5</Text>
                </View>
                <View style={styles.tagStandard}>
                  <Text style={styles.tagText}>Standard</Text>
                </View>
                <View style={styles.tagDemo}>
                  <Text style={styles.tagText}>Real
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.chevronCircle}
              onPress={() => setShowAccountSwitcher(true)}
            >
              <MaterialCommunityIcons name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceText}>{parseFloat(selectedAccount.balance).toFixed(2)} INR</Text>
        <Modal
          visible={showAccountSwitcher}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAccountSwitcher(false)}>
  <TouchableWithoutFeedback onPress={() => setShowAccountSwitcher(false)}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>

  <View style={[styles.accountSwitcherContainer]}>
    {/* Header */}
    <View style={styles.switcherHeader}>
      <Text style={styles.switcherTitle}>Accounts</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowAccountSwitcher(false)}
      >
        <Text style={[styles.closeButtonText, { fontSize: 32 }]}>×</Text>
      </TouchableOpacity>
    </View>

    {/* Tab Switcher */}
    <View style={{ backgroundColor: '#fff', paddingTop: 8, marginBottom: 6 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        {['real', 'demo', 'archived'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
            onPress={() => setAccountTab(tab)}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: accountTab === tab ? 'bold' : 'normal',
                color: accountTab === tab ? '#000' : '#888',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Indicator */}
      <View style={{ flexDirection: 'row', height: 2, marginHorizontal: 18 }}>
        {['real', 'demo', 'archived'].map((tab) => (
          <View
            key={tab}
            style={{
              flex: 1,
              backgroundColor: accountTab === tab ? '#000' : '#eee',
              height: 2,
              borderRadius: 1,
            }}
          />
        ))}
      </View>
    </View>

    {/* Content Area */}
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
  {accountTab === 'real' ? (
    <>
      {accounts
        .filter((acc) => !acc.isDemo)
        .map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            isSelected={selectedAccount?.id === account.id}
            onSelect={async () => {
              try {
                await AsyncStorage.setItem('selectedAccountId', account.id.toString()); // ✅ Save as string
                const saved = await AsyncStorage.getItem('accountsData');
                if (saved) {
                  const parsed = JSON.parse(saved);
                  const updatedAccount = parsed.find(acc => acc.id === account.id);
                  setSelectedAccount(updatedAccount);
                } else {
                  setSelectedAccount(account);
                }
              } catch (e) {
                console.error("Failed to select account", e);
                setSelectedAccount(account);
              }
              setShowAccountSwitcher(false);
            }}                                 
          />
        ))}
    </>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#888', textAlign: 'center' }}>
        No accounts in this section.
      </Text>
    </View>
  )}
</View>
  </View>
</Modal>
        <View style={styles.accountActions}>
          <TouchableOpacity style={styles.actionButtonTrade} onPress={() => props.onNavigate && props.onNavigate('trade')}>
            <View style={styles.tradeIconContainer}>
              <TradeIcon size={29} color="black" />
            </View>
            <Text style={styles.tradeText}>Trade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              if (!selectedAccount) {
                Alert.alert('No Account', 'Please select an account first');
                return;
              }
              handleNavigation('deposit');
            }}
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
  <TouchableOpacity 
    style={[styles.tabButton, activeTab === 'open' && styles.tabButtonActive]}
    onPress={() => setActiveTab('open')}
  >
    <Text style={[styles.tabText, activeTab === 'open' && styles.tabTextActive]}>Open</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={[styles.tabButton, activeTab === 'pending' && styles.tabButtonActive]}
    onPress={() => setActiveTab('pending')}
  >
    <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Pending</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={[styles.tabButton, activeTab === 'closed' && styles.tabButtonActive]}
    onPress={() => setActiveTab('closed')}
  >
    <Text style={[styles.tabText, activeTab === 'closed' && styles.tabTextActive]}>Closed</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.refreshButton}>
  <RemixIcon name="arrow-up-down-line" size={20} color="#777" />
  </TouchableOpacity>
</View>

          <View style={styles.bottomLine} />
        </View>
    <View style={styles.container1}>
      {/* Status text based on active tab */}
      <Text style={styles.statusText1}>
        {activeTab === 'open' && 'No open positions'}
        {activeTab === 'pending' && 'No open positions'}
        {activeTab === 'closed' && 'No open positions'}
      </Text>

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
            <MaterialCommunityIcons name="magnify" size={18} color="#333" />
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
            <Text style={styles.switcherTitle}>Accounts</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAccountSwitcher(false)}
            >
              <Text style={[styles.closeButtonText, {fontSize: 32}]}>×</Text>
            </TouchableOpacity>
          </View>
          {/* Tab Switcher */}
          <View style={{backgroundColor: '#fff', paddingTop: 8, marginBottom: 6}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', position: 'relative', paddingHorizontal: 16}}>
              <TouchableOpacity
                style={{flex: 1, alignItems: 'center', paddingVertical: 10}}
                onPress={() => setAccountTab('real')}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: accountTab === 'real' ? 'bold' : 'normal',
                  color: accountTab === 'real' ? '#000' : '#888'
                }}>Real</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1, alignItems: 'center', paddingVertical: 10}}
                onPress={() => setAccountTab('demo')}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: accountTab === 'demo' ? 'bold' : 'normal',
                  color: accountTab === 'demo' ? '#000' : '#888'
                }}>Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1, alignItems: 'center', paddingVertical: 10}}
                onPress={() => setAccountTab('archived')}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: accountTab === 'archived' ? 'bold' : 'normal',
                  color: accountTab === 'archived' ? '#000' : '#888'
                }}>Archived</Text>
              </TouchableOpacity>
            </View>
            {/* Tab indicator */}
            <View style={{flexDirection: 'row', height: 2, marginHorizontal: 18}}>
              <View style={{
                flex: 1,
                backgroundColor: accountTab === 'real' ? '#000' : '#eee',
                height: 2,
                borderRadius: 1,
                transition: 'all 0.2s'
              }} />
              <View style={{
                flex: 1,
                backgroundColor: accountTab === 'demo' ? '#000' : '#eee',
                height: 2,
                borderRadius: 1,
                transition: 'all 0.2s'
              }} />
              <View style={{
                flex: 1,
                backgroundColor: accountTab === 'archived' ? '#000' : '#eee',
                height: 2,
                borderRadius: 1,
                transition: 'all 0.2s'
              }} />
            </View>
          </View>
          {/* Account List */}
          <ScrollView style={styles.accountsList}>
  {accounts
    .filter((acc) => {
      if (accountTab === 'real') return true; // Show all accounts
      return false; // Show nothing for demo/archived
    })
    .map((account) => (
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

      {/* Add Account Dialog */}
      <Modal
        visible={showAccountDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAccountDialog(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 12,
            width: '80%',
            alignItems: 'center',
            position: 'relative'
          }}>
            <TouchableOpacity 
              onPress={() => setShowAccountDialog(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                padding: 6,
                zIndex: 1
              }}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginTop: 10 }}>Add Account Details</Text>
            <TextInput
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 10,
                marginBottom: 12
              }}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 10,
                marginBottom: 12
              }}
              placeholder="ID"
              value={newId}
              onChangeText={setNewId}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#FFD700',
                padding: 10,
                borderRadius: 6,
                width: '100%',
                alignItems: 'center',
                marginTop: 8
              }}
              onPress={async () => {
                if (!newName.trim() || !newId.trim()) {
                  Alert.alert('Error', 'Please enter both name and ID');
                  return;
                }

                try {
                  // Update the selected account in the list
                  const updatedAccounts = accounts.map(acc =>
                    acc.id === selectedAccount.id
                      ? { 
                          ...acc, 
                          name: newName.trim(), 
                          customId: newId.trim(),
                          // Preserve other account properties
                          balance: acc.balance,
                          number: acc.number,
                          type: acc.type,
                          isDemo: acc.isDemo
                        }
                      : acc
                  );
              
                  // Save updated accounts to AsyncStorage
                  await AsyncStorage.setItem('accountsData', JSON.stringify(updatedAccounts));
              
                  // Update state with the modified account
                  const updatedAccount = {
                    ...selectedAccount,
                    name: newName.trim(),
                    customId: newId.trim()
                  };
                  
                  setAccounts(updatedAccounts);
                  setSelectedAccount(updatedAccount);
              
                  // Close dialog and clear inputs
                  setShowAccountDialog(false);
                  setNewName('');
                  setNewId('');
                } catch (err) {
                  console.error('Failed to update account:', err);
                  Alert.alert('Error', 'Failed to save account details');
                }
              }}              
            >
              <Text style={{ fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
          </View>
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
    height: 400, // Increased height
    paddingBottom: 20,
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
    fontSize: 25,
    fontWeight: 'bold',
    marginRight: 20,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    marginleft: 25,
  },
  accountsList: {
    paddingHorizontal: 16,
  },
  accountOption: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    minHeight: 64,
  },
  selectedAccountOption: {
    backgroundColor: 'white',
  },
  accountOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 5,
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
},

tabButton: {
  paddingVertical: 12,
  paddingHorizontal: 15,
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
  marginRight: 15,
},

tabButtonActive: {
  borderBottomColor: 'black', // ✅ This is expected
},
tabText: {
  color: '#777',               // gray text for inactive
  fontWeight: 'normal',
},

tabTextActive: {
  color: 'black',              // black text for active
  fontWeight: '500',
},
  refreshButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomLine: {
  height: 2,
  backgroundColor: '#EAEAEA',     
  marginHorizontal: 15,
  marginTop: -1,              
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

function AccountCard({ account, isSelected, onSelect }) {
  const displayType = account.isDemo ? 'Zero' : 'Standard';

  return (
    <TouchableOpacity
      style={[
        styles.accountOption,
        isSelected && styles.selectedAccountOption,
        { flexDirection: 'column', padding: 12 },
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 5 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#222' }}>
          {account.name?.trim() || displayType}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222' }}>
          {account.balance} INR
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ backgroundColor: '#E0F7FA', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
          <Text style={{ color: '#009688', fontSize: 13 }}>MT5</Text>
        </View>
        <View style={{ backgroundColor: '#E0F7FA', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
          <Text style={{ color: '#009688', fontSize: 13 }}>{displayType}</Text>
        </View>
        <Text style={{ color: '#666', fontSize: 13 }}>
          #{account.customId?.trim() || account.number}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
