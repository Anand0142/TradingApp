import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TradeScreen = ({ onNavigate }) => {
  const handleTradePress = (symbol) => {
    // Navigate to Performance screen with the selected symbol
    onNavigate && onNavigate('graph', { symbol });
  };

  const renderTradeItem = ({
    id,
    containerStyle,
    title,
    subtitle,
    price,
    change,
    changeColor,
    icon,
    iconType = 'icon', // 'icon' or 'image'
    additionalContent
  }) => (
    <View style={containerStyle} key={id}>
      <TouchableOpacity 
        style={styles.tradeItem} 
        onPress={() => handleTradePress(title)}
        activeOpacity={0.7}
      >
        <View style={styles.tradeItemContent}>
          <View style={styles.iconCircle}>
            {iconType === 'image' ? (
              <Image 
                source={icon} 
                style={styles.assetIcon} 
                resizeMode="contain" 
              />
            ) : (
              <MaterialCommunityIcons 
                name={icon} 
                size={24} 
                color="#fff" 
              />
            )}
          </View>
          <View style={styles.assetInfo}>
            <View style={styles.assetHeader}>
              <Text style={styles.assetTitle}>{title}</Text>
              <View style={styles.priceSection}>
                <Text style={styles.assetPrice}>{price}</Text>
                <Text style={[styles.assetChange, { color: changeColor || '#888' }]}>
                  {change}
                </Text>
              </View>
            </View>
            <Text style={styles.assetSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
            {additionalContent}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {/* Balance */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceBox}>
            <View style={styles.demoPill}>
              <Text style={styles.demoText}>Demo</Text>
            </View>
            <Text style={styles.balanceAmount}>500.00 USD</Text>
            <MaterialCommunityIcons name="dots-vertical" size={18} color="#999" fontWeight="bold"/>
          </View>
        </View>

        <View style={styles.tradeHeader}>
          <Text style={styles.tradeTitle}>Trade</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="alarm" size={26} color="white" />
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

        {/* Sorting row */}
        <View style={styles.sortRow}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sorted manually</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
            <MaterialCommunityIcons name="square-edit-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Individual Trade Containers */}
        {renderTradeItem({
          id: 'btc',
          containerStyle: styles.tradeContainer1,
          title: 'BTC',
          subtitle: 'Bitcoin vs US Dollar',
          price: '117,901.93',
          change: '-1.31%',
          changeColor: '#FF5B5A',
          icon: require('../assets/btc.png'),
          iconType: 'image',
        })}

        {renderTradeItem({
          id: 'xau',
          containerStyle: styles.tradeContainer2,
          title: 'XAU/USD',
          subtitle: 'Gold vs US Dollar',
          price: '3,309.89',
          change: '-0.71%',
          changeColor: '#FF5B5A',
          icon: 'gold',
        })}

        {renderTradeItem({
          id: 'aapl',
          containerStyle: styles.tradeContainer3,
          title: 'AAPL',
          subtitle: 'Apple Inc.',
          price: '213.78',
          change: '-0.27%',
          changeColor: '#FF5B5A',
          icon: 'apple',
        })}

        {renderTradeItem({
          id: 'eurusd',
          containerStyle: styles.tradeContainer4,
          title: 'EUR/USD',
          subtitle: 'Euro vs US Dollar',
          price: '1.15939',
          change: '-1.37%',
          changeColor: '#FF5B5A',
          icon: 'currency-eur',
        })}

        {renderTradeItem({
          id: 'gbpusd',
          containerStyle: styles.tradeContainer5,
          title: 'GBP/USD',
          subtitle: 'Great Britain Pound vs US Dollar',
          price: '1.33682',
          change: '-0.52%',
          changeColor: '#FF5B5A',
          icon: 'currency-gbp',
        })}

        {renderTradeItem({
          id: 'usdjpy',
          containerStyle: styles.tradeContainer6,
          title: 'USD/JPY',
          subtitle: 'US Dollar vs Japanese Yen',
          price: '148.486',
          change: '0.0%',
          changeColor: '#888',
          icon: 'currency-jpy',
        })}

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.footerButton, styles.footerButtonActive]}>
            <MaterialCommunityIcons name="view-grid" size={24} color="#fff" />
            <Text style={[styles.footerText, styles.footerTextActive]}>Accounts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialCommunityIcons name="chart-candlestick" size={24} color="#fff" />
            <Text style={styles.footerTextActive}>Trade</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => onNavigate && onNavigate('graph')}
          >
            <MaterialCommunityIcons name="chart-bar" size={24} color="#888" />
            <Text style={styles.footerText}>Performance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialCommunityIcons name="account-circle-outline" size={24} color="#888" />
            <Text style={styles.footerText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginTop: 10,
    marginBottom: 2,
    padding:1,
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
  tradeItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconSection: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
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
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5.6,
    marginRight: 8,
    marginBottom: 3,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  assetPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  assetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assetSubtitle: {
    color: '#888',
    fontSize: 12,
    flex: 1,
    marginRight: 10,
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
