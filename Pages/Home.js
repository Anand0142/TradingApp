import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Home(props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Accounts</Text>
        <View style={styles.headerIconsContainer}>
          <View style={styles.topIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="alarm" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, {marginLeft: 15}]}>
              <Icon name="bell-outline" size={20} color="white" />
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
                <Text style={styles.numberText}># 269446202</Text>
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
            <View style={styles.chevronCircle}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
          
          <Text style={styles.balanceText}>500.00 USD</Text>

        <View style={styles.accountActions}>
          <TouchableOpacity style={styles.actionButtonTrade}>
            <View style={styles.tradeIconContainer}>
            <Icon name="custom-candlestick" size={24} />
            </View>
            <Text style={styles.tradeText}>Trade</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Icon name="arrow-down" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
                <Icon name="arrow-up" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity> 
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconContainer}>
              <Icon name="dots-vertical" size={24} color="#fff" />
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
          <View style={styles.tabIndicator}></View>
        </View>
        
        {/* Empty state placeholders */}
        <View style={styles.emptyStateContainer}>
          {/* These are the gray bars shown in the image */}
          <View style={styles.placeholderBar}></View>
          <View style={styles.placeholderBar}></View>
          <View style={styles.placeholderBar}></View>
          <View style={styles.placeholderBar}></View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
                  style={styles.footerButton} 
                  onPress={() => onNavigate && onNavigate('home')}
                >
                  <Icon name="view-grid" size={24} color="#888" />
                  <Text style={styles.footerText}>Accounts</Text>
                </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => props.onNavigate && props.onNavigate('trade')}>
          <Icon name="chart-candlestick" size={24} color="#fff" />
          <Text style={styles.footerTextActive}>Trade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
        <Icon name="web" size={24} color="#888888" />
        <Text style={styles.footerText}>Insights</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => props.onNavigate && props.onNavigate('graph')}>
        <Icon name="signal-cellular-alt" size={24} color="#888888" />
        <Text style={styles.footerText}>Performance</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <Icon name="account-circle" size={24} color="#888888" />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#000000',
    paddingTop: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 37,
    fontWeight: '900',
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
  },
  numberText: {
    fontSize: 18,
    color: '#CDD6CF',      
    fontWeight: '700',    
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
    backgroundColor: '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:20,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  accountCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    margin: 15,
    padding: 20,
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
    fontSize: 16,
    color: 'white',
    fontWeight: '900',
    marginBottom: 10,
  },
  accountTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6, 
  },
  tagMT5: {
    backgroundColor: '#2A4D3A',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagStandard: {
    backgroundColor: '#2A4D3A',
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagDemo: {
    backgroundColor: '#2A4D3A',
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  tagText: {
    color: '#91D9A1',
    fontSize: 14,
  },
  chevronCircle: {
    backgroundColor: '#2C2D2D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  chevron: {
    color: 'white',
    fontSize: 24,
    marginBottom: 15,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 20,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeIcon: {
    fontSize: 24,
    color: 'black',
  },
  tradeText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionIconContainer: {
    backgroundColor: '#2A2A2A',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  actionIcon: {
    fontSize: 24,
    color: 'white',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabs: {
    marginTop: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
  },
  tabTextActive: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIndicator: {
    display: 'none', 
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
    backgroundColor: '#111',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
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
    marginBottom: 4,
  },
  footerText: {
    color: '#888',
    fontSize: 12,
  },
  footerTextActive: {
    color: 'white',
    fontSize: 12,
  },
});
