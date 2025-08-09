import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import TradeIcon from '../assets/TradeIcon';
import { Svg, Line, Polyline } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';

const TradeScreen = (props) => {
  // Get selectedAccount from navigation params
  const selectedAccount = props.route?.params?.selectedAccount;

  // Use selectedAccount or fallback to default
  const account = selectedAccount || {
    type: 'ZERO',
    balance: 500.00,
    currency: 'INR',
    name: 'Demo',
  };

  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('Favorites'); 
  const [activeAccount, setActiveAccount] = React.useState({
    type: 'Demo',      
    balance: 500.00,   
    currency: 'INR',
  });
  const { onNavigate } = props;
  
  React.useEffect(() => {
    console.log('Trade screen mounted with props:', props);
    console.log('onNavigate function exists:', !!onNavigate);
  }, []);
  
  const handleTradePress = (symbol) => {
    console.log('Trade pressed with symbol:', symbol);
    if (symbol === 'BTC') {
      console.log('Navigating to Stock screen');
      onNavigate && onNavigate('Stock');
    } else {
      console.log('Navigating to graph with symbol:', symbol);
      onNavigate && onNavigate('graph', { symbol });
    }
  };

  // This function should be called when user selects an account (from Home page or account switcher)
  const handleAccountSelect = (account) => {
    setActiveAccount({
      type: account.type,
      balance: account.balance,
      currency: account.currency || 'INR',
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {/* Top Section */}
        <View>
          {/* Balance */}
          <View style={styles.balanceContainer}>
            <View style={styles.balanceBox}>
              <View style={styles.demoPill}>
                <Text style={styles.demoText}>{account.type}</Text>
              </View>
              <Text style={styles.balanceAmount}>
                {parseFloat(account.balance).toFixed(2)} {account.currency}
              </Text>
              <MaterialCommunityIcons name="dots-vertical" size={18} color="black" />
            </View>
          </View>

          {/* Trade Header */}
          <View style={styles.tradeHeader}>
            <Text style={styles.tradeTitle}>Trade</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="alarm" size={26} color="black" style={{marginRight:20}} />
            </TouchableOpacity>
          </View>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <View style={styles.tabContent}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                {['Favorites', 'Most traded', 'Top Movers', 'Markets'].map(tab => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={styles.tabItem}
                    activeOpacity={0.8}
                  >
                    <Text style={activeTab === tab ? styles.tabActive : styles.tab}>
                      {tab}
                    </Text>
                    {activeTab === tab && <View style={styles.activeTabIndicator} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.searchIcon}>
                <MaterialCommunityIcons name="magnify" size={26} color="black" marginRight={4} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sorted Section */}
          <View style={styles.sortRow}>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortText}>Sorted manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>Edit</Text>
              <MaterialCommunityIcons name="square-edit-outline" size={16} color="black" fontWeight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingBottom: 50, 
            minHeight: height - 180 
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Bitcoin Trade Container #1 */}
          <View style={styles.tradeContainer1}>
  <TouchableOpacity 
    style={styles.tradeItem} 
    onPress={() => handleTradePress('BTC')}
    activeOpacity={0.7}
  >
    <View style={styles.tradeItemContent}>
      <View style={styles.topRowContainer}>

        {/* Left Icon + BTC */}
        <View style={styles.iconTitleContainer}>
          <View style={styles.iconCircle}>
            <Image 
              source={require('../assets/btc.png')} 
              style={styles.assetIcon} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.assetTitle}>BTC</Text>
        </View>

        {/* Mini Chart + Price */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Mini Graph */}
          <View style={{ width: 80, height: 30, marginRight: 10 }}>
          <Svg height="30" width="80" marginLeft="-15">
    {/* Dotted baseline */}
    <Line
      x1="1"
      y1="15"
      x2="90"
      y2="15"
      stroke="#888"
      strokeWidth="2"
      strokeDasharray="4"
    />

    {/* Realistic fluxing red line */}
    <Polyline
      points="0,14 10,10 20,16 30,11 40,17 50,13 60,19 70,15 80,23"
      fill="none"
      stroke="#FF5B5A"
      strokeWidth="2"
    />
  </Svg>
          </View>

          {/* Price */}
          <View style={styles.priceChangeContainer}>
            <Text style={styles.assetPrice}>117,901.93</Text>
            <Text style={[styles.assetChange, { color: '#FF5B5A' }]}>↓1.31%</Text>
          </View>
        </View>

      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.assetSubtitle} numberOfLines={1}>
          Bitcoin vs US Dollar
        </Text>
      </View>
    </View>
  </TouchableOpacity>
</View>


    {/* Bitcoin Trade Container #2 */}
<View style={styles.tradeContainer1}>
  <TouchableOpacity 
    style={styles.tradeItem} 
    onPress={() => handleTradePress('BTC')}
    activeOpacity={0.7}
  >
    {/* Main Container */}
    <View style={styles.tradeItemContent}>
      
      {/* First Row: Icon + Title + Price Info */}
      <View style={styles.topRowContainer}>
        
        {/* Icon + BTC Title Container */}
        <View style={styles.iconTitleContainer}>
          <View style={styles.iconCircle}>
            {/* Overlapping gold and USD icons with circular style */}
            <View style={{ position: 'relative', width: 30, height: 30 }}>
              <Image 
                source={require('../assets/gold.png')} 
                style={{
                  width: 24,
                  height: 24,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: 12, // Makes it a circle
                  zIndex: 1
                }}
                resizeMode="cover" // Ensures full cover in circle
              />
              <Image 
                source={require('../assets/usd.png')} 
                style={{
                  width: 24,
                  height: 24,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  borderRadius: 12, // Makes it a circle
                  zIndex: 2
                }}
                resizeMode="cover"
              />
            </View>
          </View>

          <Text style={styles.assetTitle}>XAU/USD</Text>
        </View>
        
        {/* Price + Change Container */}
        <View style={styles.priceChangeContainer}>
          <Text style={styles.assetPrice}>3309.893</Text>
          <Text style={[styles.assetChange, { color: '#FF5B5A' }]}>↓-0.71%</Text>
        </View>
      </View>
      
      {/* Second Row: Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.assetSubtitle} numberOfLines={1}>
          Gold vs US Dollar
        </Text>
      </View>
      
    </View>
  </TouchableOpacity>
</View>


    {/* Bitcoin Trade Container #3 */}
<View style={styles.tradeContainer1}>
  <TouchableOpacity 
    style={styles.tradeItem} 
    onPress={() => handleTradePress('BTC')}
    activeOpacity={0.7}
  >
    {/* Main Container */}
    <View style={styles.tradeItemContent}>
      
      {/* First Row: Icon + Title + Price Info */}
      <View style={styles.topRowContainer}>
        
        {/* Icon + BTC Title Container */}
        <View style={styles.iconTitleContainer}>
          {/* Circle Icon Wrapper */}
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 15,
            overflow: 'hidden',
            marginRight: 10,
          }}>
            <Image 
              source={require('../assets/aapl.png')} 
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover" // Ensures no white space
            />
          </View>
          <Text style={styles.assetTitle}>AAPL</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Mini Graph */}
          <View style={{ width: 80, height: 30, marginRight: 10 }}>
          <Svg height="30" width="80" marginLeft="-15">
    {/* Dotted baseline */}
    <Line
      x1="1"
      y1="15"
      x2="90"
      y2="15"
      stroke="#888"
      strokeWidth="2"
      strokeDasharray="4"
    />

    {/* Realistic fluxing red line */}
    <Polyline
      points="0,14 5,13 10,14 15,13 20,14 25,16 30,18 35,12 40,17 45,19 50,14 55,22 60,30 65,28 70,32 75,36 80,34"
      fill="none"
      stroke="#FF5B5A"
      strokeWidth="2"
    />
  </Svg>
          </View>

          {/* Price */}
          <View style={styles.priceChangeContainer}>
            <Text style={styles.assetPrice}>117,901.93</Text>
            <Text style={[styles.assetChange, { color: '#FF5B5A' }]}>↓1.31%</Text>
          </View>
        </View>
      
      </View>
      
      {/* Second Row: Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.assetSubtitle} numberOfLines={1}>
          Apple INC
        </Text>
      </View>
    </View>
  </TouchableOpacity>
</View>


    {/* Bitcoin Trade Container #4 */}
<View style={styles.tradeContainer1}>
  <TouchableOpacity 
    style={styles.tradeItem} 
    onPress={() => handleTradePress('BTC')}
    activeOpacity={0.7}
  >
    {/* Main Container */}
    <View style={styles.tradeItemContent}>
      
      {/* First Row: Icon + Title + Price Info */}
      <View style={styles.topRowContainer}>
        
        {/* Icon + BTC Title Container */}
        <View style={styles.iconTitleContainer}>
          {/* Overlapping Circular Icons */}
          <View style={{ position: 'relative', width: 30, height: 30,marginRight: 10 }}>
            <Image 
              source={require('../assets/eur.png')} 
              style={{
                width: 26,
                height: 26,
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: 12,
                zIndex: 1,
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
                zIndex: 2,
              }}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.assetTitle}>EUR/USD</Text>
        </View>
        
        {/* Price + Change Container */}
        <View style={styles.priceChangeContainer}>
          <Text style={styles.assetPrice}>117,901.93</Text>
          <Text style={[styles.assetChange, { color: '#FF5B5A' }]}>↓-1.31%</Text>
        </View>
      </View>
      
      {/* Second Row: Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.assetSubtitle} numberOfLines={1}>
        Euro vs US Dollar
        </Text>
      </View>
    </View>
  </TouchableOpacity>
</View>

{/* Bitcoin Trade Container #5 */}
<View style={styles.tradeContainer1}>
  <TouchableOpacity 
    style={styles.tradeItem} 
    onPress={() => handleTradePress('BTC')}
    activeOpacity={0.7}
  >
    {/* Main Container */}
    <View style={styles.tradeItemContent}>
      
      {/* First Row: Icon + Title + Price Info */}
      <View style={styles.topRowContainer}>
        
        {/* Icon + BTC Title Container */}
        <View style={styles.iconTitleContainer}>
          {/* Overlapping Circular Icons */}
          <View style={{ position: 'relative', width: 30, height: 30,marginRight: 10 }}>
            <Image 
              source={require('../assets/usd.png')} 
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: 14,
                zIndex: 1,
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
                padding:2,
                marginLeft:6,
                borderRadius: 12,
                zIndex: 2,
              }}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.assetTitle}>GBP/USD</Text>
        </View>
        
        {/* Price + Change Container */}
        <View style={styles.priceChangeContainer}>
          <Text style={styles.assetPrice}>117,901.93</Text>
          <Text style={[styles.assetChange, { color: '#FF5B5A' }]}>↓-1.31%</Text>
        </View>
      </View>
      
      {/* Second Row: Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.assetSubtitle} numberOfLines={1}>
          British Pound vs US Dollar
        </Text>
      </View>
    </View>
  </TouchableOpacity>
</View>

{/* Bitcoin Trade Container #5 */}
<View style={styles.tradeContainer1}>
  <TouchableOpacity 
    style={styles.tradeItem} 
    onPress={() => handleTradePress('BTC')}
    activeOpacity={0.7}
  >
    {/* Main Container */}
    <View style={styles.tradeItemContent}>
      
      {/* First Row: Icon + Title + Price Info */}
      <View style={styles.topRowContainer}>
        
        {/* Icon + BTC Title Container */}
        <View style={styles.iconTitleContainer}>
          {/* Overlapping Circular Icons */}
          <View style={{ position: 'relative', width: 30, height: 30,marginRight: 10 }}>
            <Image 
              source={require('../assets/usd.png')} 
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: 14,
                zIndex: 1,
              }}
              resizeMode="cover"
            />
            <Image 
              source={require('../assets/japan.png')} 
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                bottom: 0,
                right: 0,
                padding:2,
                marginLeft:6,
                borderRadius: 12,
                zIndex: 2,
              }}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.assetTitle}>USD/JPY</Text>
        </View>
        
        {/* Price + Change Container */}
        <View style={styles.priceChangeContainer}>
          <Text style={styles.assetPrice}>117,901.93</Text>
          <Text style={[styles.assetChange, { color: '#d12323ff' }]}>↓-1.31%</Text>
        </View>
      </View>
      
      {/* Second Row: Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.assetSubtitle} numberOfLines={1}>
          US Dollar vs Japanese Yen
        </Text>
      </View>
    </View>
  </TouchableOpacity>
</View>

        </ScrollView>

        {/* Fixed Footer Navigation */}
        <View style={[styles.footer]}>
          <TouchableOpacity 
            style={styles.footerButton} 
            onPress={() => {
              if (props.navigation) {
                props.navigation.navigate('Home');
              }
            }}
          >
            <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#888" />
            <Text style={styles.footerText}>Accounts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.footerButton} 
            onPress={() => {}}
          >
            <View style={{marginBottom: 4}}>
              <TradeIcon size={24} color="black" />
            </View>
            <Text style={[styles.footerText, {color: 'black', fontWeight: 'bold'}]}>Trade</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerButton}>
          <MaterialCommunityIcons name="web" size={24} color="#888888" />
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
            <MaterialCommunityIcons name="account-circle-outline" size={24} color="#888888" />
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'flex-start',
  },
  tradeContainer1: {
    borderRadius: 4,
    padding: 2.5,
  },
  tradeContainer2: {
    borderRadius: 4,
    padding: 2.5,
  },
  tradeContainer3: {
    borderRadius: 4,
    padding: 2.5,
  },
  tradeContainer4: {
    borderRadius: 4,
    padding: 2.5,
  },
  tradeContainer5: {
    borderRadius: 4,
    padding: 2.5,
  },
  tradeContainer6: {
    borderRadius: 4,
    padding: 2.5,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: '#fff',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    color: '#fff',
    marginLeft: 2,
  },
  
  balanceContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 2,
    padding:2,
  },
  
  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#939393',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  
  demoPill: {
    backgroundColor: '#DEF8DD',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
  },
  
  demoText: {
    color: '#08680A',
    fontSize: 13,
    fontWeight: '600',
  },
  
  balanceAmount: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 2,
    marginLeft: 5,
    textShadowColor: '#999', 
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },  
  tradeTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 17,
    marginBottom: 5,
  },
  tabBar: {
    marginTop: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#94949a',
    paddingHorizontal: 12,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingRight: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
    backgroundColor: 'transparent', // No pill styling
    position: 'relative',
  },
  tabActive: {
    color: 'black',
    fontWeight: 'bold',
  },
  tab: {
    color: '#888',
    fontWeight: '500',
  },
  activeTabIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: 'black',
    borderRadius: 2,
  },
  searchIcon: {
    marginLeft: 8,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding:5,
    marginHorizontal:2,
  },
  sortButton: {
    backgroundColor: '#ECECED',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight:12,
  },
  sortText: {
    color: 'black',
    fontWeight: '400',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#ECECED',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  editText: {
    color: 'black',
    marginLeft: 4,
    marginRight:2,
  },
  tradeItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    marginBottom: 5,
    marginHorizontal: 16,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#fff',
      paddingTop: verticalScale(8),
      paddingBottom: verticalScale(2),
      borderTopWidth: 0.2,
      borderTopColor: '#BFC0BF',
  },
  footerButton: {
    alignItems: 'center',
    paddingHorizontal: verticalScale(12),
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    marginTop: verticalScale(2),
  },
  footerTextActive: {
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(12),
  },
  tradeItemContent: {
    flexDirection: 'column',
    paddingVertical: verticalScale(5),
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priceChangeContainer: {
    alignItems: 'flex-end',
  },
  subtitleContainer: {
    marginTop: 4,
  },
  iconSection: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  overlappingIcons: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 0,
    left: 0,
    zIndex: 1,
  },
  assetIcon: {
    width: 36,
    height: 36,
  },
  assetInfo: {
    flex: 1,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:12,
    marginRight:1,
    alignItems: 'center',
    flex: 1,
  },
  assetTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  priceSection: {
    alignItems: 'flex-end',
    paddingVertical: 2,
    paddingHorizontal: 3,
    padding: 2,
  },
  assetPrice: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  assetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetSubtitle: {
    color: '#888',
    fontSize: 15,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  changeIcon: {
    marginRight: 2,
  },
  assetChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  pairContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  pairText: {
    color: '#666',
    fontSize: 12,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeText: {
    color: '#666',
    fontSize: 12,
    marginRight: 4,
  },
});

export default TradeScreen;
