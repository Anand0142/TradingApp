import { StatusBar } from 'expo-status-bar';
import { 
  Animated,
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Modal, 
  TouchableWithoutFeedback, 
  TextInput, 
  Dimensions,
  Alert,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../components/firebase';
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
import { 
  moderateScale, 
  verticalScale, 
  responsiveButtonWidth as scale 
} from '../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get window dimensions
const { width } = Dimensions.get('window');

// Colors
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [accountTab, setAccountTab] = useState('real');
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [activeTab, setActiveTab] = useState('open');
  const insets = useSafeAreaInsets();
  const [openOrders, setOpenOrders] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const scrollY = new Animated.Value(0);

// Header will collapse from 150px to 50px

const safeOpenOrders = Array.isArray(openOrders) ? openOrders : [];
  const symbol = safeOpenOrders.length > 0 && safeOpenOrders[0]?.symbol ? safeOpenOrders[0].symbol : 'BTC';
  const symbolOrders = safeOpenOrders.filter(o => o.symbol === symbol);
  const firstOrder = symbolOrders.length > 0 ? symbolOrders[0] : null;
  const livePrice = livePrices[symbol] || (firstOrder ? firstOrder.currentPrice : 0) || (firstOrder ? firstOrder.price : 0) || 0;

  const totalPL = symbolOrders.reduce((sum, order) => {
    const qty = Number(order.quantity);
    const entryPrice = Number(order.price);
    if (order.type === 'SELL') {
      return sum + ((entryPrice - livePrice) * qty);
    } else {
      return sum + ((livePrice - entryPrice) * qty);
    }
  }, 0);


const headerHeight = scrollY.interpolate({
  inputRange: [0, 100],
  outputRange: [150, 50],
  extrapolate: 'clamp'
});

// Header will fade out as you scroll
const headerOpacity = scrollY.interpolate({
  inputRange: [0, 80],
  outputRange: [1, 0],
  extrapolate: 'clamp'
}); 
  
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
  
  const [selectedAccount, setSelectedAccount] = useState(null); 
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasOpenOrders, setHasOpenOrders] = useState(false);

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
  const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Binance trade stream: { p: "price", ... }
    if (data.p) {
      setLivePrices(prev => ({ ...prev, BTC: parseFloat(data.p) }));
    }
  };

  ws.onerror = (error) => {
    console.log('WebSocket error:', error.message);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  return () => {
    ws.close();
  };
}, []);

  useEffect(() => {
  const loadOpenOrders = async () => {
    try {
      const saved = await AsyncStorage.getItem('openOrders');
      if (saved) {
        const parsed = JSON.parse(saved);
        setOpenOrders(Array.isArray(parsed) ? parsed : []);
        setHasOpenOrders(Array.isArray(parsed) && parsed.length > 0);
      } else {
        setOpenOrders([]);
        setHasOpenOrders(false);
      }
    } catch (err) {
      setOpenOrders([]);
      setHasOpenOrders(false);
    }
  };
  loadOpenOrders();
}, [activeTab]);

  
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
   
  // Show loading state until selectedAccount is available
  if (isLoading || !selectedAccount) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading account data...</Text>
      </View>
    );
  }

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
  


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header,{ paddingTop: insets.top }]}>
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

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + verticalScale(20) }}>
        {/* Account Card */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountDetails}>
              <Text>
                <Text style={styles.accountNumber}>
                  {accounts.find(acc => acc.number === selectedAccount.number)?.name?.trim() || ''}
                </Text>
                <Text style={styles.accountNumber}>
                  #{accounts.find(acc => acc.number === selectedAccount.number)?.customId?.trim() || selectedAccount.number}
                </Text>
              </Text>
              <View style={styles.accountTags}>
                <View style={styles.tagMT5}>
                  <Text style={styles.tagText}>MT5</Text>
                </View>
                <View style={selectedAccount.isDemo ? styles.tagDemo : styles.tagStandard}>
                  <Text style={styles.tagText}>
                    {selectedAccount.isDemo ? 'Zero' : 'Standard'}
                  </Text>
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
            accounts={accounts}
            isSelected={selectedAccount?.id === account.id}
            onSelect={async () => {
              try {
                await AsyncStorage.setItem('selectedAccountId', account.id.toString()); // Save as string
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
          <TouchableOpacity 
            style={styles.actionButtonTrade} 
            onPress={() => props.navigation.navigate('Trade', { selectedAccount })}
          >
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
          <View style={[styles.stickyTabs, { top: headerHeight }]}>
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
        </View>
    <View style={styles.container1}>
      {/* Status text based on active tab */}
      <Text style={styles.statusText1}>
        {activeTab === 'open' && !hasOpenOrders && 'No open positions'}
        {activeTab === 'pending' && 'No pending orders'}
        {activeTab === 'closed' && 'No closed positions'}
      </Text>

      {/* Open Section: show orders if present, else default UI */}
      {activeTab === 'open' && (
        hasOpenOrders ? (
          <View style={styles.openSectionCard}>
            <View style={styles.openCardRow}>
      <Image source={require('../assets/btc.png')} style={styles.openCardIcon} />
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.openCardSymbol}>
          {openOrders[0]?.symbol || 'BTC'}
        </Text>
        <View style={styles.openCardCount}>
          <Text style={styles.openCardCountText}>
            {openOrders.filter(o => o.symbol === openOrders[0]?.symbol).length}
          </Text>
        </View>
        <Text style={[
  styles.openCardPL,
  { color: totalPL < 0 ? '#f00' : '#4CAF50' }
]}>
  {isNaN(totalPL) ? '0.00 USD' : (totalPL < 0 ? '' : '+') + totalPL.toFixed(2) + ' USD'}
</Text>
      </View>
    </View>
    <Text style={styles.openCardDesc}>Fully hedged</Text>
          </View>
        ) : (
          <>
            {/* Default UI if no open orders */}
            <View style={styles.tradeBox1}>
              <View style={{ position: 'relative', width: moderateScale(30), height: moderateScale(30) }}>
                <Image 
                  source={require('../assets/eng.png')} 
                  style={{
                    width: moderateScale(24),
                    height: moderateScale(24),
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
                    width: moderateScale(24),
                    height: moderateScale(24),
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
            <View style={styles.explore1}>
              <MaterialCommunityIcons name="magnify" size={18} color="#333" />
              <Text style={styles.exploreText1}>Explore more instruments</Text>
            </View>
          </>
        )
      )}
    </View>
    </ScrollView>

      {/* Footer */}
      <View style={[styles.footer,{ paddingBottom: insets.bottom }]}>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => {
            // Simple navigation without checking current route
            if (props.navigation) {
              props.navigation.navigate('Home');
            }
          }}
        >
          <Icon name="view-dashboard-outline" size={24} color="black" />
          <Text style={styles.footerTextActive}>Accounts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => props.navigation.navigate('Trade')}
        >
          <View style={{marginBottom: 4}}>
            <TradeIcon size={24} color="#888" />
          </View>
          <Text style={styles.footerText}>Trade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
        <Icon name="web" size={24} color="#888888" />
        <Text style={styles.footerText}>Insights</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.footerButton} 
        onPress={() => props.navigation && props.navigation.navigate('Graph')}
      >
        <View style={{marginBottom: 4}}>
          <MaterialIcons name="signal-cellular-alt" size={24} color="#888" />
        </View>
        <Text style={styles.footerText}>Performance</Text>
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => setShowProfileMenu(!showProfileMenu)}
        >
          <Icon name="account-circle-outline" size={24} color="#888888" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
        
        {showProfileMenu && (
          <RNTouchableWithoutFeedback onPress={() => setShowProfileMenu(false)}>
            <View style={styles.profileMenuOverlay}>
              <View style={styles.profileMenu}>
                {/* Close button */}
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowProfileMenu(false)}
                >
                  <Icon name="close" size={20} color="#000000" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.profileMenuItem}
                  onPress={() => {
                    Alert.alert(
                      "Logout",
                      "Are you sure you want to logout?",
                      [
                        {
                          text: "No",
                          style: "cancel",
                          onPress: () => console.log("Logout cancelled")
                        },
                        { 
                          text: "Yes",
                          style: "default",
                          onPress: async () => {
                            try {
                              setIsLoggingOut(true);
                              const user = auth.currentUser;
                              
                              if (user) {
                                // Update user status in Firestore
                                const userRef = doc(db, "users", user.uid);
                                await updateDoc(userRef, {
                                  isLoggedIn: false,
                                  lastLogout: serverTimestamp()
                                });
                                
                                // Sign out from Firebase Auth
                                await signOut(auth);
                                
                                // Navigate to Login screen
                                props.navigation.replace('Login');
                              }
                            } catch (error) {
                              console.error("Logout error:", error);
                              Alert.alert("Logout Error", "Failed to sign out. Please try again.");
                            } finally {
                              setIsLoggingOut(false);
                            }
                          }
                        }
                      ],
                      { cancelable: true }
                    );
                    setShowProfileMenu(false);
                  }}
                >
                  <Icon name="logout" size={20} color="#000000" paddingTop={10} style={styles.profileMenuIcon} />
                  <Text style={[styles.profileMenuText, {color: '#000000'}]}>
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </Text>
                  {isLoggingOut && <ActivityIndicator size="small" color="#000000" style={{marginLeft: 10}} />}
                </TouchableOpacity>
              </View>
            </View>
          </RNTouchableWithoutFeedback>
        )}
      </View>
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
        accounts={accounts}
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
    // Update BOTH Standard and Zero accounts with the same number
    const updatedAccounts = accounts.map(acc => {
      if (acc.number === selectedAccount.number) {
        return {
          ...acc,
          name: newName.trim(),
          customId: newId.trim(),
        };
      }
      return acc;
    });

    await AsyncStorage.setItem('accountsData', JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);

    // Always select the account type the user was editing
    const updatedSelected = updatedAccounts.find(acc => acc.id === selectedAccount.id);
    setSelectedAccount(updatedSelected);

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
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(20),
    height: verticalScale(400),
    paddingBottom: moderateScale(20),
  },
  switcherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  switcherTitle: {
    fontSize: moderateScale(25),
    fontWeight: 'bold',
    marginRight: moderateScale(20),
  },
  closeButton: {
    padding: moderateScale(5),
  },
  closeButtonText: {
    fontSize: moderateScale(24),
    color: '#666',
    marginLeft: moderateScale(25),
  },
  accountsList: {
    paddingHorizontal: moderateScale(16),
  },
  accountOption: {
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(10),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    minHeight: moderateScale(64),
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
    paddingHorizontal: moderateScale(5),
    backgroundColor: '#F4F4F4',
    marginBottom: verticalScale(15),
    marginTop: verticalScale(8),
  },
  headerText: {
    color: COLORS.textBlack,
    fontSize: moderateScale(33),
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
    width: moderateScale(20),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(12),
    marginRight:moderateScale(22),
    paddingVertical: moderateScale(4),
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
    borderRadius: moderateScale(15),
    padding: moderateScale(15),
    marginBottom: verticalScale(15),
    marginHorizontal: moderateScale(15),
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.05,
   shadowRadius: 2,
   elevation: 2,
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
    fontSize: moderateScale(14),
    color: 'black',
    fontWeight: '500',
    marginBottom: moderateScale(10),
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
    fontSize: moderateScale(30),
    fontWeight: 'bold',
    color: COLORS.textBlack,
    marginVertical: 5,
  },
  accountActions: {
    flexDirection: 'row',
    gap:moderateScale(30),
    justifyContent: 'center',
    marginTop: verticalScale(10),
    paddingHorizontal:moderateScale(10),
  },
  actionButton: {
    alignItems: 'center',
    maxWidth: scale(80),
    flex:1,
  },
  actionButtonTrade: {
    alignItems: 'center',
    width: scale(65),
    paddingHorizontal: moderateScale(5),
  },
  tradeIconContainer: {
    backgroundColor: '#FFD700',
    width: scale(45),
    height: scale(45),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:verticalScale(8),
    alignSelf:'center',
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
    width: scale(45),
    height: scale(45),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:verticalScale(8),
    alignSelf:'center',
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
  backgroundColor: '#f5f5f5', 
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
  borderBottomColor: 'black', 
},
tabText: {
  color: '#777',               
  fontWeight: 'normal',
},

tabTextActive: {
  color: 'black',             
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
    paddingTop: verticalScale(10),
    borderTopWidth: 0.2,
    borderTopColor: '#BFC0BF',
  },
  footerButton: {
    alignItems: 'center',
    flex: 1,
  },
  profileContainer: {
    position: 'relative',
    flex: 1,
  },
  profileMenuOverlay: {
    position: 'absolute',
    top: 20,  // Adjust this to position the menu above the button
    right: 20,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    marginTop: 10,
  },
  profileMenu: {
    position: 'relative',
    right: 10,
    bottom: 60,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    width: 144,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12, // Add some top margin to account for the close button
  },
  profileMenuIcon: {
    marginRight: 10,
  },
  profileMenuText: {
    fontSize: 16.5,
    color: '#FF3B30',
  },
  footerButtonActive: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: scale(12),
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
    padding: moderateScale(16),
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    marginTop: verticalScale(15),
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
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(17),
    width: '95%',
    height: verticalScale(50),  
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
  openSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  openHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  openTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  openCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  orderSymbol: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  orderType: {
    fontSize: 14,
    fontWeight: '400',
  },
  orderVolume: {
    fontWeight: 'bold',
  },
  orderPrice: {
    color: '#007bff',
    fontWeight: '500',
  },
  orderPL: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  orderLivePrice: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
  },
  openSectionCard: {
  width: '99%',
  backgroundColor: '#fff',
  borderRadius: 15,
  padding: 18,
  alignSelf: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.02,
  shadowRadius: 2,
},
openCardRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},
openCardIcon: {
  width: 33,
  height: 33,
  borderRadius: 16,
  marginRight: 12,
  backgroundColor: '#F7F7F7',
},
openCardSymbol: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#222',
  marginRight: 8,
},
openCardCount: {
  backgroundColor: '#ECECED',
  borderRadius: 10,
  paddingHorizontal: 7,
  marginRight: 8,
  marginLeft: 2,
  height: 22,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 2,
},
openCardCountText: {
  fontSize: 15,
  color: '#888',
  fontWeight: 'bold',
},
openCardPL: {
  fontSize: 17,
  fontWeight: 'bold',
  color: 'rgba(224, 10, 10, 0.71)',
  marginLeft: 'auto',
},
openCardDesc: {
  fontSize: 15,
  color: '#888',
  marginTop: 2,
  marginBottom: 10,
  marginLeft: 44,
},
});

function AccountCard({ account, accounts = [], isSelected, onSelect }) {
  if (!account) return null;

  // Find paired account (other type with same number)
  const pairedAccount = Array.isArray(accounts)
    ? accounts.find(acc => acc && acc.number === account.number && acc.id !== account.id)
    : null;

  // Use synced name/id from either account
  const displayName = account.name?.trim() || pairedAccount?.name?.trim() || '';
  const displayId = account.customId?.trim() || pairedAccount?.customId?.trim() || account.number;

  return (
    <TouchableOpacity
      style={[
        styles.accountOption,
        isSelected && styles.selectedAccountOption,
        { flexDirection: 'column', padding: moderateScale(12) },
      ]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: moderateScale(10), 
        marginTop: moderateScale(5) 
      }}>
        <Text style={{ 
          fontSize: moderateScale(15), 
          fontWeight: '600', 
          color: '#222',
          textTransform: 'uppercase'
        }}>
          {account.isDemo ? 'ZERO' : 'STANDARD'}
        </Text>
        <Text style={{ 
          fontSize: moderateScale(16), 
          fontWeight: 'bold', 
          color: '#222' 
        }}>
          {parseFloat(account.balance || 0).toFixed(2)} INR
        </Text>
      </View>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: moderateScale(8) 
      }}>
        <View style={{ 
          backgroundColor: '#ECECED', 
          borderRadius: moderateScale(6), 
          paddingHorizontal: moderateScale(8), 
          paddingVertical: moderateScale(2), 
          marginRight: moderateScale(6) 
        }}>
          <Text style={{ color: 'black', fontSize: moderateScale(13) }}>MT5</Text>
        </View>
        <View style={{ 
          backgroundColor: '#ECECED', 
          borderRadius: moderateScale(6), 
          paddingHorizontal: moderateScale(8), 
          paddingVertical: moderateScale(2), 
          marginRight: moderateScale(6) 
        }}>
          <Text style={{ 
            color: 'black', 
            fontSize: moderateScale(13),
            textTransform: 'capitalize' 
          }}>
            {account.isDemo ? 'Zero' : 'Standard'}
          </Text>
        </View>
        <Text style={{ 
          color: '#666', 
          fontSize: moderateScale(13) 
        }}>
          #{displayId}
        </Text>
      </View>
    </TouchableOpacity>
  );
}