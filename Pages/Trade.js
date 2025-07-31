import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import TradeIcon from '../assets/TradeIcon';
import { Svg, Line, Polyline } from 'react-native-svg';


const TradeScreen = ({ onNavigate }) => {
  const handleTradePress = (symbol) => {
    onNavigate && onNavigate('graph', { symbol });
  };

  return (
    <View style={{ flex: 1 }}>
      
      {/* Fixed Top Section */}
      <View>
        {/* Balance */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceBox}>
            <View style={styles.demoPill}>
              <Text style={styles.demoText}>Demo</Text>
            </View>
            <Text style={styles.balanceAmount}>500.00 USD</Text>
            <MaterialCommunityIcons name="dots-vertical" size={18} color="#999" />
          </View>
        </View>

        {/* Trade Header */}
        <View style={styles.tradeHeader}>
          <Text style={styles.tradeTitle}>Trade</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="alarm" size={26} color="white" style={{marginRight:20}} />
          </TouchableOpacity>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <View style={styles.tabContainer}>
            <View style={styles.tabItem}>
              <Text style={styles.tabActive}>Favorites</Text>
              <View style={styles.activeTabIndicator} />
            </View>
            <Text style={styles.tab}>Most traded</Text>
            <Text style={styles.tab}>Top Movers</Text>
            <Text style={styles.tab}>Markets</Text>
            <View style={styles.tabSpacer} />
            <TouchableOpacity style={styles.searchIcon}>
              <MaterialCommunityIcons name="magnify" size={30} color="white" />
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
            <MaterialCommunityIcons name="square-edit-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
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
          <Text style={[styles.assetChange, { color: '#FF5B5A' }]}>↓-1.31%</Text>
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
<View style={styles.footer}>
  <TouchableOpacity
    style={styles.footerButton}
    onPress={() => onNavigate && onNavigate('home')}
  >
    <Icon name="view-dashboard-outline" size={24} color="#888" />
    <Text style={styles.footerText}>Accounts</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.footerButton}
    onPress={() => onNavigate && onNavigate('trade')}
  >
    <View style={{ marginBottom: 4 }}>
      <TradeIcon size={24} color="#fff" />
    </View>
    <Text style={styles.footerTextActive}>Trade</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.footerButton}>
    <Icon name="web" size={24} color="#888888" />
    <Text style={styles.footerText}>Insights</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.footerButton}
    onPress={() => onNavigate && onNavigate('graph')}
  >
    <View style={{ marginBottom: 4 }}>
      <MaterialIcons name="signal-cellular-alt" size={24} color="#888" />
    </View>
    <Text style={styles.footerText}>Performance</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.footerButton}>
    <Icon name="account-circle-outline" size={24} color="#888888" />
    <Text style={styles.footerText}>Profile</Text>
  </TouchableOpacity>
</View>
</View>
);
};
const styles = StyleSheet.create({
  tradeContainer1: {
    borderRadius: 4,
    padding: 3,
  },
  tradeContainer2: {
    borderRadius: 4,
    padding: 3,
  },
  tradeContainer3: {
    borderRadius: 4,
    padding: 3,
  },
  tradeContainer4: {
    borderRadius: 4,
    padding: 3,
  },
  tradeContainer5: {
    borderRadius: 4,
    padding: 3,
  },
  tradeContainer6: {
    borderRadius: 4,
    padding: 3,
  },  
  container: {
    flex: 1,
    backgroundColor: '#0D0F13',
    paddingTop: 40,
    paddingHorizontal: 16,
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
    marginTop: 35,
    marginBottom: 2,
    padding:2,
  },
  
  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171718',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#939393',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  demoPill: {
    backgroundColor: '#144C3C',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
  },
  
  demoText: {
    color: '#00C26D',
    fontSize: 13,
    fontWeight: '600',
  },
  
  balanceAmount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 2,
    marginLeft: 5,
    textShadowColor: '#999', 
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },  
  tradeTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 10,
    marginBottom: 5,
  },
  tabBar: {
    marginTop: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    position: 'relative',
    marginRight: 15,
    paddingVertical: 12,
  },
  tabActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  tab: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 20,
    paddingVertical: 12,
  },
  tabSpacer: {
    flex: 1,
  },
  searchIcon: {
    padding: 2,
    marginRight:12,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding:5,
    marginHorizontal:2,
  },
  sortButton: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight:12,
  },
  sortText: {
    color: '#D0D0D1',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    marginLeft: 4,
    marginRight:2,
  },
  tradeItem: {
    backgroundColor: '#1A1C1F',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#232222',
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: '#222',
    position:'fixed',
  },
  footerButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  footerTextActive: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tradeItemContent: {
    flexDirection: 'column',
    paddingVertical: 8,
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
    color: '#fff',
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
    color: '#fff',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0D0F13',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 10,
    marginTop: 4,
  },
  footerTextActive: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
  },
});

export default TradeScreen;
