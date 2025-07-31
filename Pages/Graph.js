import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 64;

const labels = ['1 Apr', '12 May', '26 May', '09 Jun', '23 Jun', '07 Jul', '21 Jul'];

// Sample net values (profit - loss), where negative means loss
const netData = [-190, 55, 24, 10, 10, 0, 0];

const profitData = netData.map((val) => (val > 0 ? val : 0));
const lossData = netData.map((val) => (val < 0 ? Math.abs(val) : 0));

const Graph = (props) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View>
        <Text style={styles.title}>Performance</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonWithIcon]}>
          <Text style={styles.filterText}>All real accounts</Text>
          <MaterialCommunityIcons name="chevron-down" size={18} color="#000" style={styles.filterIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonWithIcon]}>
          <MaterialCommunityIcons name="calendar" size={18} color="#000" style={styles.filterIcon} />
          <Text style={styles.filterText}> Last 90 days</Text>
        </TouchableOpacity>
      </View>

      {/* Profit / Loss */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Profit / Loss</Text>
        <MaterialCommunityIcons name="information-outline" size={25} color="black" />
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        <View style={styles.summary}>
          <Text style={styles.lossAmount}>-108.12 USD</Text>
          <View style={styles.lossPercentContainer}>
            <MaterialCommunityIcons name="arrow-down" size={14} color="#DB2829" />
            <Text style={styles.lossPercentText}>-340.00%</Text>
            <MaterialCommunityIcons name="information-outline" size={14} color="#DB2829" />
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chart}>
          <BarChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: profitData,
                  color: () => '#4CAF50',
                },
                {
                  data: lossData,
                  color: () => '#DB2829',
                },
              ],
            }}
            width={screenWidth}
            height={300}
            fromZero={true}
            showBarTops={false}
            segments={6}
            chartConfig={{
              backgroundGradientFrom: '#F9F9F9',
              backgroundGradientTo: '#F9F9F9',
              decimalPlaces: 2,
              barPercentage: 0.6,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForBackgroundLines: {
                stroke: '#F0F0F0',
              },
            }}
            verticalLabelRotation={0}
            style={{
              borderRadius: 16,
            }}
            withInnerLines={true}
            withHorizontalLabels={true}
          />
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>
            <Text style={{ color: '#9E9D9D' }}>Profit</Text>
            <Text style={{ fontWeight: '600' }}>  +141.93 USD</Text>
          </Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: '#DB2829' }]} />
          <Text style={styles.legendText}>
            <Text style={{ color: '#9E9D9D' }}>Loss</Text>
            <Text style={{ fontWeight: '600' }}>  -250.05 USD</Text>
          </Text>
        </View>
      </View>

      {/* Last updated */}
      <Text style={styles.updatedText}>Last updated: Today, 9:21 pm</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => props.onNavigate && props.onNavigate('home')}>
          <MaterialCommunityIcons name="view-grid" size={24} color="#888" />
          <Text style={styles.footerText}>Accounts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => props.onNavigate && props.onNavigate('trade')}>
          <MaterialCommunityIcons name="chart-candlestick" size={24} color="#000" />
          <Text style={styles.footerTextActive}>Trade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
          <MaterialCommunityIcons name="web" size={24} color="#888" />
          <Text style={styles.footerText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => props.onNavigate && props.onNavigate('graph')}>
          <MaterialIcons name="signal-cellular-alt" size={24} color="#000" />
          <Text style={styles.footerTextActive}>Performance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <MaterialCommunityIcons name="account-circle-outline" size={24} color="#888" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    padding:15,
    marginTop:15,
  },
  titleUnderline: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 30,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    borderWidth: 0,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 16,
    backgroundColor: '#F2F2F2',
  },
  filterButtonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    fontWeight:'600',
  },
  filterIcon: {
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    padding:5,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  lossAmount: {
    fontSize: 18.5,
    fontWeight: 'bold',
    color: '#121619',
    marginRight: 8,
  },
  lossPercentContainer: {
    backgroundColor: '#FDE8E8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 160,
  },
  lossPercentText: {
    color: '#DB2829',
    marginLeft: 4,
    fontSize: 12,
  },
  chart: {
    height: 425,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 2,
    marginTop: 6,
    padding: 8,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  timePeriodText: {
    color: '#9E9D9D',
    fontSize: 12,
  },
  activeTimePeriod: {
    color: '#000000',
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    // Shadow for iOS - bottom only
    shadowColor: '#867D7D',
    shadowOffset: {
      width: 0,
      height: 2, // Controls the vertical offset (smaller value = shadow closer to the card)
    },
    shadowOpacity: 0.1, // Makes the shadow lighter
    shadowRadius: 2, // Makes the shadow sharper
    // Shadow for Android - bottom only
    elevation: 0.2,
  },
  legendContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 28,
    marginBottom: 1.5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 15,
    color: '#121619',
  },
  updatedText: {
    fontSize: 13,
    color: '#999',
    fontWeight:'600',
    textAlign: 'center',
    marginTop: 10,
    marginRight: 150,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding:5,
    margin:5,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#888888',
    marginTop: 4,
  },
  footerTextActive: {
    fontSize: 10,
    color: '#000000',
    marginTop: 4,
    fontWeight: 'bold',
  },
});
