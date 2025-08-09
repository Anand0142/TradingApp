import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
  Animated,
  Image,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { 
  Line, 
  Rect, 
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText
} from 'react-native-svg';
import FooterNav from '../components/FooterNav';
import TradeIcon from '../assets/TradeIcon';
// Using React Native's built-in WebSocket

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size; // base iPhone 11 width
const vScale = (size) => (height / 812) * size; // base iPhone 11 height

const ChartGraphScreen = ({ route, navigation }) => {
  const { tradeItem } = route.params || {};
  const [activeTab, setActiveTab] = useState('trade');
  const intervalRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [volume, setVolume] = useState(''); // Use string for input
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [orderType, setOrderType] = useState(''); // 'buy' or 'sell'
  const [totalAmount, setTotalAmount] = useState(0);
  const [showOrderOpened, setShowOrderOpened] = useState(false);
  const [orderOpenedDetails, setOrderOpenedDetails] = useState(null);
  
  // Default data matching the image
  const defaultTradeItem = {
    symbol: 'BTC',
    name: 'Bitcoin vs US Dollar',
    buyPrice: '117004.03',
    sellPrice: '116988.91',
    currentPrice: '117003.70',
    change: '↓ 1.31%',
    isPositive: false,
    icon: require('../assets/btc.png'),
  };

  const currentItem = tradeItem || defaultTradeItem;

  // Live data state
  const [candlestickData, setCandlestickData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(117003.70);
  const [prevPrice, setPrevPrice] = useState(117003.70);
  const [priceChange, setPriceChange] = useState({ value: -1.31, isPositive: false });
  const [priceRange, setPriceRange] = useState({ min: 116400, max: 116800 });
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Animation value for price changes
  const priceAnim = useRef(new Animated.Value(117003.70)).current;

  // Initialize chart data
  const initializeData = () => {
    const initialData = Array.from({ length: 30 }, (_, i) => {
      const basePrice = 116600 + Math.sin(i * 0.1) * 200;
      const open = basePrice + (Math.random() - 0.5) * 100;
      const close = open + (Math.random() - 0.5) * 150;
      const high = Math.max(open, close, basePrice) + Math.random() * 80;
      const low = Math.min(open, close, basePrice) - Math.random() * 80;
      
      return {
        open,
        high,
        low,
        close,
        time: new Date(Date.now() - (29 - i) * 5 * 60 * 1000),
        isBullish: close > open,
      };
    });
    
    // Calculate initial price range with proper padding
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;
    
    initialData.forEach(candle => {
      minPrice = Math.min(minPrice, candle.low);
      maxPrice = Math.max(maxPrice, candle.high);
    });
    
    // Add 5% padding on both sides
    const padding = (maxPrice - minPrice) * 0.05 || 1;
    
    // Ensure minimum range to prevent flat lines
    const minRange = maxPrice * 0.01;
    if ((maxPrice - minPrice) < minRange) {
      const mid = (maxPrice + minPrice) / 2;
      minPrice = mid - (minRange / 2);
      maxPrice = mid + (minRange / 2);
    }
    
    setCandlestickData(initialData);
    setCurrentPrice(initialData[initialData.length - 1].close);
    setPriceRange({ 
      min: minPrice - padding, 
      max: maxPrice + padding 
    });
  };

  // Generate new candlestick data point
  const generateNewCandle = (lastCandle) => {
    const volatility = 50;
    const trend = (Math.random() - 0.5) * 2; // Random trend
    
    const open = lastCandle.close;
    const priceMovement = (Math.random() - 0.5) * volatility + trend;
    const close = open + priceMovement;
    const high = Math.max(open, close) + Math.random() * 30;
    const low = Math.min(open, close) - Math.random() * 30;
    
    return {
      open,
      high,
      low,
      close,
      time: new Date(),
      isBullish: close > open,
    };
  };

  // Order management functions
  const generateOrderId = () => {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const handleBuyOrder = () => {
    setOrderType('buy');
    setShowVolumeModal(true);
  };

  const handleSellOrder = () => {
    setOrderType('sell'); // <-- Add this line
    setShowVolumeModal(true);
  };

  const handleVolumeConfirm = () => {
    const spread = 15.12;
    const isBuy = orderType === 'buy';
    const price = isBuy ? currentPrice + (spread / 2) : currentPrice - (spread / 2);
    
    const newOrder = {
      id: generateOrderId(),
      type: isBuy ? 'BUY' : 'SELL',
      symbol: currentItem.symbol,
      price: price,
      currentPrice: currentPrice,
      quantity: volume,
      totalAmount: totalAmount,
      timestamp: new Date(),
      status: 'pending',
      profit: 0
    };

    setOrderDetails(newOrder);
    setShowVolumeModal(false);
    setShowOrderModal(true);
  };

  const handleOrderConfirm = () => {
    if (orderDetails) {
      const confirmedOrder = {
        ...orderDetails,
        status: 'open',
        timestamp: new Date().toISOString() // <-- convert to string
      };
      setOrders(prevOrders => [...prevOrders, confirmedOrder]);
      setShowOrderModal(false);
      setShowConfirmationModal(true);

      setOrderOpenedDetails(confirmedOrder);
      setShowOrderOpened(true);

      setTimeout(() => {
        setShowOrderOpened(false);
      }, 3000);

      setTimeout(() => {
        setShowConfirmationModal(false);
        navigation.navigate('Home', { openOrders: [...orders, confirmedOrder] });
      }, 3000);
    }
  };

  // Removed confirmOrder function as it's replaced by handleOrderConfirm

  const cancelOrder = () => {
    setShowOrderModal(false);
    setShowVolumeModal(false);
    setShowConfirmationModal(false);
    setOrderDetails(null);
  };

  // Footer navigation handlers
  const handleNavigate = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigation.navigate('Home');
    } else if (tab === 'trade') {
      navigation.navigate('Trade');
    }
  };

  const handleProfile = () => {
    setActiveTab('profile');
    // Handle profile navigation or modal
  };

  // WebSocket initialization
  const initializeWebSocket = () => {
    // Using React Native's built-in WebSocket
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_5m');
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout;

    const connect = () => {
      ws.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.k) {
            const newPrice = parseFloat(data.k.c);
            const isNewCandle = data.k.x; // True if this is a new candle
            
            // Update previous price before setting new one
            setPrevPrice(currentPrice);
            
            // Update current price with animation
            Animated.spring(priceAnim, {
              toValue: newPrice,
              friction: 10,
              useNativeDriver: true,
            }).start();
            
            setCurrentPrice(newPrice);
            
            const candle = {
              open: parseFloat(data.k.o),
              high: parseFloat(data.k.h),
              low: parseFloat(data.k.l),
              close: newPrice,
              time: new Date(data.k.t),
              isBullish: newPrice > parseFloat(data.k.o)
            };

            // Update candlestick data, keeping only last 60 candles
            setCandlestickData(prevData => {
              if (isNewCandle) {
                // For new candle, add to the end and remove oldest if needed
                return [...prevData.slice(-59), candle];
              } else {
                // For updates to current candle, replace the last one
                const newData = [...prevData];
                if (newData.length > 0) {
                  newData[newData.length - 1] = candle;
                } else {
                  newData.push(candle);
                }
                return newData;
              }
            });
            
            // Calculate price change
            const changeValue = ((newPrice - parseFloat(data.k.o)) / parseFloat(data.k.o)) * 100;
            setPriceChange({
              value: changeValue,
              isPositive: changeValue >= 0
            });

            // Update price range to include all candlesticks
            setPriceRange(prevRange => {
              // Get all candlestick data including the new candle
              const allCandles = isNewCandle 
                ? [...candlestickData.slice(-59), candle] 
                : candlestickData.length > 0 
                  ? [...candlestickData.slice(0, -1), candle]
                  : [candle];
              
              // Find min and max across all candles
              let minPrice = Number.MAX_VALUE;
              let maxPrice = Number.MIN_VALUE;
              
              allCandles.forEach(c => {
                minPrice = Math.min(minPrice, c.low);
                maxPrice = Math.max(maxPrice, c.high);
              });
              
              // Add 5% padding on both sides
              const padding = (maxPrice - minPrice) * 0.05 || 1; // Ensure padding is never 0
              
              // Ensure minimum range to prevent flat lines
              const minRange = maxPrice * 0.01; // 1% of max price as minimum range
              if ((maxPrice - minPrice) < minRange) {
                const mid = (maxPrice + minPrice) / 2;
                minPrice = mid - (minRange / 2);
                maxPrice = mid + (minRange / 2);
              }
              
              return {
                min: minPrice - padding,
                max: maxPrice + padding
              };
            });
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket Disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`Reconnecting in ${delay}ms...`);
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++;
            console.log(`Reconnect attempt ${reconnectAttempts} of ${maxReconnectAttempts}`);
            connect();
          }, delay);
        } else {
          console.log('Max reconnection attempts reached');
        }
      };
    };

    // Start the connection
    connect();

    // Store the WebSocket instance
    setSocket(ws);

    // Cleanup function
    return () => {
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  };

  // Initialize data and WebSocket on component mount
  useEffect(() => {
    initializeData();
    initializeWebSocket();

    // Clean up WebSocket on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Animate price changes
  useEffect(() => {
    if (prevPrice !== currentPrice) {
      Animated.spring(priceAnim, {
        toValue: currentPrice,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [currentPrice]);

  const timeLabels = ['6:50', '11:00', '14:10', '19:20'];

  const TopHeader = () => (
    <View style={styles.topHeader}>
      {/* BTC Section */}
      <View style={styles.btcSection}>
        <View style={styles.btcContainer}>
          <View style={styles.btcIcon}>
            <Image source={currentItem.icon} style={styles.btcImage} resizeMode="contain" />
          </View>
          <Text style={styles.btcText}>{currentItem.symbol}</Text>
          <Ionicons name="chevron-down" size={18} color="black" fontWeight="bold" />
        </View>

        {/* Action Icons */}
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.actionIcon}>
            <MaterialIcons name="alarm-add" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <MaterialIcons name="fullscreen" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <MaterialIcons name="settings" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <MaterialIcons name="more-vert" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Open </Text>
          <Text style={styles.statusValue}>0</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Pending </Text>
          <Text style={styles.statusValue}>0</Text>
        </View>
      </View>
      {/* Live Price Display */}
      <View style={styles.livePriceSection}>
        <Text style={styles.livePrice}>₹{currentPrice.toFixed(2)}</Text>
        <View style={styles.priceChangeContainer}>
          <Text style={[
            styles.priceChangeText, 
            { color: priceChange.isPositive ? '#00d4ff' : '#ff4757' }
          ]}>
            {priceChange.isPositive ? '↑' : '↓'} {Math.abs(priceChange.value).toFixed(2)}%
          </Text>
          <View style={[
            styles.liveIndicator,
            { backgroundColor: isConnected ? '#00d4ff' : '#ff4757' }
          ]}>
            <Text style={styles.liveIndicatorText}>
              {isConnected ? 'LIVE' : 'CONNECTING...'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const [touchPrice, setTouchPrice] = useState(null);
  const [touchPosition, setTouchPosition] = useState(null);

  const CandlestickChart = () => {
    const chartHeight = 380;
    const chartWidth = width - 40;
    const candleWidth = Math.max(3, (chartWidth - 100) / Math.max(candlestickData.length, 30) * 0.8);
    const priceHeight = priceRange.max - priceRange.min || 1; // Prevent division by zero
    const paddingTop = 20;
    const paddingBottom = 40;
    const chartContentHeight = Math.max(1, chartHeight - paddingTop - paddingBottom); // Ensure positive height
    
    // Ensure candlestickData is an array
    const safeCandlestickData = Array.isArray(candlestickData) ? candlestickData : [];
    
    // Simple color definitions for candlesticks
    const bullColor = '#2196F3';
    const bearColor = '#f44336';

    // Calculate Y position for a given price
    const getYPosition = (price) => {
      return paddingTop + ((priceRange.max - price) / (priceRange.max - priceRange.min)) * chartContentHeight;
    };

    // Calculate price for a given Y position
    const getPriceAtY = (y) => {
      return priceRange.max - ((y - paddingTop) / chartContentHeight) * (priceRange.max - priceRange.min);
    };

    const handleChartTouch = (event) => {
      const { locationX, locationY } = event.nativeEvent;
      
      // Only process if touch is within chart bounds
      if (locationY >= paddingTop && locationY <= (chartHeight - paddingBottom)) {
        const touchedPrice = getPriceAtY(locationY);
        setTouchPrice(touchedPrice.toFixed(2));
        setTouchPosition({ x: locationX, y: locationY });
      }
    };

    // Generate price markers
    const generatePriceMarkers = () => {
      const markers = [];
      const min = Math.floor(priceRange.min / 100) * 100; // Round down to nearest 100
      const max = Math.ceil(priceRange.max / 100) * 100;  // Round up to nearest 100
      const step = (max - min) / 3;
      
      for (let i = 0; i <= 3; i++) {
        const price = min + (step * i);
        const y = getYPosition(price);
        markers.push({ price, y });
      }
      
      return markers;
    };

    const priceMarkers = generatePriceMarkers();

    return (
      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {/* Price markers on the right */}
        <View style={styles.priceLabelsRight}>
          {priceMarkers.map((marker, index) => (
            <Text key={index} style={styles.priceLabel}>
              {marker.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Text>
          ))}
        </View>
        
        {/* Main chart area */}
        <TouchableOpacity 
          style={styles.chartTouchArea}
          onPress={handleChartTouch}
          activeOpacity={1}
        >
          <Svg width={chartWidth - 60} height={chartHeight} style={styles.chartSvg}>
            {/* Grid lines */}
            {priceMarkers.map((marker, index) => (
              <React.Fragment key={`fragment-${index}`}>
                <Line
                  key={`grid-${index}`}
                  x1={0}
                  y1={marker.y}
                  x2={chartWidth - 60}
                  y2={marker.y}
                  stroke="rgba(0,0,0,0.1)"
                  strokeDasharray="3 2"
                />
                {/* Price label at the end of line */}
                <SvgText
                  key={`label-${index}`}
                  x={chartWidth - 55}
                  y={marker.y + 4}
                  fill="#666"
                  fontSize="12"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  {marker.price.toFixed(2)}
                </SvgText>
              </React.Fragment>
            ))}
            {/* Candlesticks */}
            {safeCandlestickData.map((candle, index) => {
              const x = 30 + (index * ((chartWidth - 100) / Math.max(safeCandlestickData.length, 1)));
              const openY = getYPosition(candle.open);
              const closeY = getYPosition(candle.close);
              const highY = getYPosition(candle.high);
              const lowY = getYPosition(candle.low);
              
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

              return (
                <React.Fragment key={index}>
                  {/* Wick */}
                  {/* Wick */}
                  <Line
                    key={`wick-${index}`}
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={candle.isBullish ? bullColor : bearColor}
                    strokeWidth="1.5"
                  />
                  {/* Body */}
                  <Rect
                    key={`body-${index}`}
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candle.isBullish ? bullColor : bearColor}
                    stroke="none"
                    rx="2" // Rounded corners
                    ry="2"
                  />
                  {/* Highlight on touch */}
                  {touchPosition && Math.abs(touchPosition.x - x) < candleWidth * 2 && (
                    <Circle
                      key={`highlight-${index}`}
                      cx={x}
                      cy={closeY}
                      r="10"
                      fill={candle.isBullish ? '#00d4ff' : '#ff4757'}
                      opacity="0.5"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        </TouchableOpacity>

        {/* Price Indicators */}
        <View style={styles.priceIndicators}>
          <View style={[styles.priceIndicator, styles.buyIndicator, { top: 45 }]}>
            <Text style={styles.priceIndicatorText}>{(priceRange.max * 1.0005).toFixed(2)}</Text>
          </View>
          <View style={[styles.priceIndicator, styles.sellIndicator, { top: 85 }]}>
            <Text style={styles.priceIndicatorText}>{(priceRange.min * 0.9995).toFixed(2)}</Text>
          </View>
        </View>

        {/* Touch Price Indicator */}
        {touchPrice && touchPosition && (
          <View style={[styles.touchPriceIndicator, { 
            right: 20, 
            top: touchPosition.y - 15 
          }]}>
            <Text style={styles.touchPriceText}>{touchPrice}</Text>
          </View>
        )}
      </View>
    );
  };



  const BottomSection = () => (
    <View style={styles.bottomSection}>
      {/* HMR Indicator */}
      <View style={styles.hmrSection}>
        <View style={styles.hmrIndicator}>
          <MaterialCommunityIcons name="view-column" size={13} color="black" style={{marginRight:2}} />
          <Text style={styles.hmrText}>HMR</Text>
        </View>
      </View>

      {/* Time Labels */}
      <View style={styles.timeLabels}>
        {timeLabels.map((time, index) => (
          <Text key={index} style={styles.timeLabel}>{time}</Text>
        ))}
      </View>

      {/* Control Buttons */}
      <View style={styles.controlButtons}>
        <TouchableOpacity style={styles.controlButton}>
          <TradeIcon size={16} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.activeButton]}>
          <Text style={styles.controlButtonText}>5 m</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="equalizer" size={16} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const TradingPanel = () => {
    // Calculate live buy/sell prices with small spread
    const spread = 15.12;
    const sellPrice = currentPrice - (spread / 2);
    const buyPrice = currentPrice + (spread / 2);
    const sellPercentage = 72; // Example: 48% for sell
    const buyPercentage = 52;  // Example

    // Calculate total amount when component mounts or currentPrice changes
    useEffect(() => {
      const price = orderType === 'buy' ? 
        (currentPrice + (15.12 / 2)) : 
        (currentPrice - (15.12 / 2));
      setTotalAmount(price * volume);
    }, [currentPrice, orderType, volume]);

    return (
      <View style={styles.tradingPanelContainer}>
        <View style={styles.tradingPanel}>
          {/* Sell Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.tradeButton, styles.sellButton]} 
              onPress={handleSellOrder}
            >
              <Text style={styles.tradeButtonLabel}>Sell</Text>
              <Text style={styles.tradeButtonPrice}>
                ₹{sellPrice.toFixed(2)}
              </Text>
            </TouchableOpacity>
            <View style={styles.volumeBarContainer}>
              <View style={styles.volumeBar}>
                <View style={[styles.volumeBarFill, styles.volumeBarSell, { width: `${sellPercentage}%` }]} />
              </View>
              <Text style={styles.volumeBarLabel}>{sellPercentage}%</Text>
            </View>
          </View>

          {/* Buy Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.tradeButton, styles.buyButton]} 
              onPress={handleBuyOrder}
            >
              <Text style={styles.tradeButtonLabel}>Buy</Text>
              <Text style={styles.tradeButtonPrice}>
                ₹{buyPrice.toFixed(2)}
              </Text>
            </TouchableOpacity>
            <View style={styles.volumeBarContainer}>
              <View style={styles.volumeBar}>
                <View style={[styles.volumeBarFill, styles.volumeBarBuy, { width: `${buyPercentage}%` }]} />
              </View>
              <Text style={styles.volumeBarLabel}>{buyPercentage}%</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Top Bar with Back Button and Demo Account */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceBox}>
          <View style={styles.demoPill}>
            <Text style={styles.demoText}>Real</Text>
          </View>
          <Text style={styles.balanceAmount}>500.00 USD</Text>
          <MaterialCommunityIcons name="dots-vertical" size={18} color="#000" />
        </View>
      </View>

        <View style={styles.spacer} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TopHeader />
        <CandlestickChart />
        <BottomSection />
        <TradingPanel />
      </ScrollView>

      {/* Order Opened Notification - place here, above FooterNav */}
      {showOrderOpened && orderOpenedDetails && (
        <View style={styles.orderOpenedNotificationCustom}>
          <View style={styles.orderOpenedRow}>
            <Text style={styles.orderOpenedTitle}>Order opened</Text>
            <TouchableOpacity onPress={() => setShowOrderOpened(false)}>
              <MaterialCommunityIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.orderOpenedText}>
            {orderOpenedDetails.symbol} {orderOpenedDetails.type} {orderOpenedDetails.quantity} lot at {orderOpenedDetails.price.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Footer Navigation */}
      <FooterNav 
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onProfile={handleProfile}
      />

      {/* Volume Adjustment Modal */}
      <Modal
        visible={showVolumeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelOrder}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { height: 300 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{orderType === 'buy' ? 'Buy' : 'Sell'} {currentItem.symbol}</Text>
              <TouchableOpacity onPress={cancelOrder} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.volumeContainer}>
              <Text style={styles.volumeLabel}>Volume (Lots)</Text>
              <View style={styles.volumeInputContainer}>
                <TouchableOpacity 
                  style={[styles.volumeButton, { backgroundColor: '#f0f0f0' }]}
                  onPress={() => {
                    const newVolume = Math.max(0.01, Number(volume) - 0.01);
                    setVolume(newVolume.toString());
                    const price = orderType === 'buy'
                      ? (currentPrice + (15.12 / 2))
                      : (currentPrice - (15.12 / 2));
                    setTotalAmount(price * (newVolume > 0 ? newVolume : 0));
                  }}
                >
                  <Text style={styles.volumeButtonText}>-</Text>
                </TouchableOpacity>
                
                <TextInput
                  style={[styles.volumeInput, { backgroundColor: '#fff' }]}
                  keyboardType="numeric"
                  value={volume}
                  placeholder="Enter volume"
                  onChangeText={(text) => {
                    setVolume(text); // Store as string
                    const parsedVolume = Number(text);
                    const price = orderType === 'buy'
                      ? (currentPrice + (15.12 / 2))
                      : (currentPrice - (15.12 / 2));
                    setTotalAmount(price * (parsedVolume > 0 ? parsedVolume : 0));
                  }}
                />
                
                <TouchableOpacity 
                  style={[styles.volumeButton, { backgroundColor: '#f0f0f0' }]}
                  onPress={() => {
                    const newVolume = Number(volume) + 0.01;
                    setVolume(newVolume.toString());
                    const price = orderType === 'buy'
                      ? (currentPrice + (15.12 / 2))
                      : (currentPrice - (15.12 / 2));
                    setTotalAmount(price * (newVolume > 0 ? newVolume : 0));
                  }}
                >
                  <Text style={styles.volumeButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              
              {/* Move amount below input field */}
              <View style={styles.totalAmountBelowInput}>
                <Text style={styles.totalAmountLabel}>Amount:</Text>
                <Text style={styles.totalAmountValue}>₹{totalAmount.toFixed(2)}</Text>
              </View>
              
              <View style={{ height: 10 }} />
              
              <View style={styles.volumeActionButtons}>
                <TouchableOpacity 
                  style={[styles.volumeActionButton, styles.cancelButton, { marginRight: 10 }]}
                  onPress={cancelOrder}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.volumeActionButton, 
                    { backgroundColor: orderType === 'buy' ? '#00d4ff' : '#ff4757', opacity: 1 }
                  ]}
                  onPress={handleVolumeConfirm}
                  disabled={false} // Always active
                >
                  <Text style={styles.confirmButtonText}>
                    {orderType === 'buy' ? 'Buy' : 'Sell'} {currentItem.symbol}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Order Confirmation Modal */}
      <Modal
        visible={showOrderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelOrder}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Order</Text>
              <TouchableOpacity onPress={cancelOrder} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {orderDetails && (
              <View style={styles.modalContent}>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Type:</Text>
                  <Text style={[
                    styles.orderDetailValue,
                    { color: orderDetails.type === 'BUY' ? '#00d4ff' : '#ff4757' }
                  ]}>
                    {orderDetails.type} {orderDetails.symbol}
                  </Text>
                </View>

                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Price:</Text>
                  <Text style={styles.orderDetailValue}>₹{orderDetails.totalAmount.toFixed(2)}</Text>
                </View>

                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Quantity:</Text>
                  <Text style={styles.orderDetailValue}>{orderDetails.quantity}</Text>
                </View>

                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Order ID:</Text>
                  <Text style={styles.orderDetailValue}>{orderDetails.id}</Text>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelOrder}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleOrderConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chartContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: vScale(5),
    marginBottom: vScale(8),
    height: vScale(180),
    minHeight: vScale(180),
  },
  chartSvg: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    borderRadius: scale(7),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
    paddingTop: vScale(25),
    paddingBottom: vScale(1),
    zIndex: 10,
  },
  backButton: {
    padding: scale(3),
  },
  spacer: {
    width: scale(34),
  },
  scrollContent: {
    paddingBottom: vScale(10),
  },
  topHeader: {
    paddingHorizontal: scale(10),
    paddingTop: vScale(5),
    paddingBottom: vScale(5),
    backgroundColor: '#fff',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: vScale(2),
    padding: scale(2),
    paddingTop: scale(7),
  },
  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: scale(20),
    borderWidth: 0.5,
    borderColor: '#939393',
    paddingVertical: vScale(8),
    paddingHorizontal: scale(10),
  },
  demoPill: {
    backgroundColor: '#DEF8DD',
    borderRadius: scale(8),
    paddingHorizontal: scale(6),
    paddingVertical: vScale(4),
    marginRight: scale(6),
  },
  demoText: {
    color: '#08680A',
    fontSize: scale(10),
    fontWeight: '600',
  },
  balanceAmount: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: scale(12),
    marginRight: scale(2),
    marginLeft: scale(5),
    textShadowColor: '#999',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  btcSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vScale(15),
  },
  btcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btcIcon: {
    width: scale(25),
    height: scale(25),
    borderRadius: scale(14),
    backgroundColor: '#f7931a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  btcImage: {
    width: scale(22),
    height: scale(23),
  },
  btcText: {
    color: '#000',
    fontSize: scale(17),
    fontWeight: 'bold',
    marginRight: scale(8),
  },
  actionIcons: {
    flexDirection: 'row',
  },
  actionIcon: {
    padding: scale(4),
    marginLeft: scale(4),
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: scale(30),
    backgroundColor:'#ecedec',
    padding: scale(5),
    borderRadius: scale(12),
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: scale(10),
  },
  statusLabel: {
    color: '#666',
    fontSize: scale(14),
    fontWeight: '500',
    marginBottom: scale(2),
  },
  statusValue: {
    color: '#666',
    marginTop: scale(2),
    fontSize: scale(13),
    fontWeight: '600',
  },
  livePriceSection: {
    alignItems: 'center',
    paddingVertical: vScale(13),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  livePrice: {
    color: '#000',
    fontSize: scale(22),
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: scale(5),
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(9),
  },
  priceChangeText: {
    fontSize: scale(13),
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  liveIndicator: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(12),
    backgroundColor: '#00d4ff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicatorText: {
    color: '#000',
    fontSize: scale(8),
    fontWeight: 'bold',
  },
  chartTouchArea: {
    width: '100%',
    height: '100%',
    paddingHorizontal: scale(8),
  },
  priceLabelsRight: {
    position: 'absolute',
    right: scale(-10),
    top: 0,
    height: '100%',
    justifyContent: 'space-around',
    paddingVertical: vScale(40),
    width: scale(100),
  },
  priceLabel: {
    color: '#555',
    fontSize: scale(10),
    fontFamily: 'Roboto',
    textAlign: 'right',
    fontWeight: '500',
    marginVertical: scale(1),
  },
  touchPriceIndicator: {
    position: 'absolute',
    backgroundColor: 'black',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
    zIndex: 18,
  },
  touchPriceText: {
    color: '#fff',
    fontSize: scale(11),
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  priceIndicators: {
    position: 'absolute',
    right: scale(-10),
    top: 0,
    zIndex: 10,
  },
  priceIndicator: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
    marginBottom: scale(10),
  },
  buyIndicator: {},
  sellIndicator: {
    backgroundColor: '#ff4757',
  },
  priceIndicatorText: {
    color: '#fff',
    fontSize: scale(10),
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(20),
    paddingTop: vScale(15),
    paddingBottom: vScale(10),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  hmrSection: {
    alignItems: 'flex-start',
    marginBottom: vScale(8),
    paddingVertical: scale(2.5),
    padding: scale(5),
  },
  hmrIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    padding: scale(5),
  },
  hmrText: {
    color: '#666',
    fontWeight:'600',
    fontSize: scale(13),
    marginLeft: scale(4),
  },
  timeLabels: {
    flexDirection: 'row',
    gap: scale(32),
    marginLeft: scale(48),
    marginBottom: vScale(10),
  },
  timeLabel: {
    color: '#888',
    fontSize: scale(13),
    fontWeight:'bold',
    fontFamily: 'monospace',
  },
  controlButtons: {
    flexDirection: 'row',
    marginLeft: scale(4),
    gap: scale(15),
    paddingTop: vScale(8),
  },
  controlButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(5),
    minWidth: scale(45),
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#f8f9fa',
  },
  controlButtonText: {
    color: 'black',
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#fff',
  },
  tradingPanelContainer: {
    paddingHorizontal: scale(13),
    paddingBottom: vScale(13),
    backgroundColor: '#fff',
    paddingTop: vScale(13),
  },
  tradingPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(6),
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: scale(4),
    margin: scale(3),
  },
  tradeButton: {
    width: '100%',
    borderRadius: scale(6),
    paddingVertical: vScale(8),
    paddingHorizontal: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(4),
  },
  sellButton: {
    backgroundColor: '#f44336',
  },
  buyButton: {
    backgroundColor: '#2196F3',
  },
  tradeButtonLabel: {
    color: '#fff',
    fontSize: scale(13),
    fontWeight: '600',
    marginBottom: scale(2),
  },
  tradeButtonPrice: {
    color: '#fff',
    fontSize: scale(13),
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  spreadContainer: {
    width: scale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  spreadLabel: {
    color: '#666',
    fontSize: scale(12),
    marginBottom: scale(2),
  },
  spreadValue: {
    color: '#333',
    fontSize: scale(14),
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  chartWrapper: {
    height: vScale(400),
    width: '100%',
    marginBottom: 0,
    paddingHorizontal: scale(8),
  },
  volumeBarContainer: {
    width: '100%',
    marginTop: vScale(6),
  },
  volumeBar: {
    height: scale(4),
    backgroundColor: '#e5e7eb',
    borderRadius: scale(2),
    overflow: 'hidden',
    marginBottom: scale(2),
  },
  volumeBarFill: {
    height: '100%',
  },
  volumeBarSell: {
    backgroundColor: '#ef4444',
  },
  volumeBarBuy: {
    backgroundColor: '#1E7EDE',
  },
  volumeBarLabel: {
    fontSize: scale(11),
    color: '#6b7280',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%', // same as volume modal
    backgroundColor: '#fff',
    borderRadius: scale(10),
    padding: scale(12), // reduced padding
    maxHeight: '70%', // reduced height
  },
  volumeContainer: {
    padding: scale(3),
    flex: 1,
    justifyContent: 'flex-start',
  },
  volumeActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(2),
  },
  volumeActionButton: {
    flex: 1,
    height: vScale(32), // smaller button
    borderRadius: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(3),
  },
  volumeLabel: {
    fontSize: scale(13), // smaller font
    color: '#666',
    marginBottom: scale(7),
    textAlign: 'center',
  },
  volumeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(7),
    marginTop: scale(3),
  },
  volumeButton: {
    width: scale(24), // smaller button
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeButtonText: {
    fontSize: scale(16), // smaller text
    color: '#333',
    lineHeight: scale(18),
  },
  volumeInput: {
    flex: 1,
    height: vScale(38), // slightly increased for better centering
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(6),
    textAlign: 'center',
    fontSize: scale(14), // slightly increased for visibility
    marginHorizontal: scale(3),
    paddingVertical: scale(6), // add vertical padding for centering
    backgroundColor: '#fff',
  },
  totalAmountBelowInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(6),
    marginBottom: scale(2),
  },
  totalAmountLabel: {
    color: '#666',
    fontSize: scale(12),
  },
  totalAmountValue: {
    color: '#333',
    fontSize: scale(13),
    fontWeight: '600',
  },
  volumeInfoContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: scale(8),
    padding: scale(15),
    marginBottom: scale(20),
  },
  volumeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(8),
  },
  volumeInfoLabel: {
    color: '#666',
    fontSize: scale(14),
  },
  volumeInfoValue: {
    color: '#333',
    fontSize: scale(14),
    fontWeight: '500',
  },
  successIconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  confirmationTitle: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: scale(10),
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: scale(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: scale(15),
    lineHeight: scale(22),
  },
  confirmationPrice: {
    fontSize: scale(28),
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: scale(10),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12), // reduced margin
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: scale(8), // reduced padding
  },
  modalTitle: {
    color: '#000',
    fontSize: scale(15), // reduced font size
    fontWeight: 'bold',
  },
  modalContent: {
    marginBottom: scale(15), // reduced margin
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(6), // reduced padding
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderDetailLabel: {
    color: '#666',
    fontSize: scale(13), // reduced font size
    fontWeight: '500',
  },
  orderDetailValue: {
    color: '#000',
    fontSize: scale(13), // reduced font size
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: scale(10), // reduced gap
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: scale(8),
    paddingVertical: vScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  cancelButtonText: {
    color: '#666',
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: scale(8),
    paddingVertical: scale(10), // reduced padding
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: scale(13),
    fontWeight: 'bold',
  },
  totalAmountBelowInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(6),
    marginBottom: scale(2),
  },
  orderOpenedNotification: {
    position: 'absolute',
    top: vScale(50),
    right: scale(20),
    left: scale(20),
    backgroundColor: '#fff',
    borderRadius: scale(8),
    padding: scale(15),
    elevation: 4,
    zIndex: 100,
  },
  orderOpenedNotificationCustom: {
    position: 'absolute',
    left: scale(30),
    right: scale(30),
    bottom: vScale(90), // Try 70-110 for your layout, so it's just above the buttons
    backgroundColor: '#fff',
    borderRadius: scale(7),
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    elevation: 3,
    zIndex: 100,
    minHeight: vScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderOpenedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4), // reduced margin
  },
  orderOpenedTitle: {
    color: '#333',
    fontSize: scale(13), // reduced font size
    fontWeight: 'bold',
  },
  orderOpenedText: {
    color: '#666',
    fontSize: scale(11), // reduced font size
    lineHeight: scale(16),
    textAlign: 'center',
  },
});

export default ChartGraphScreen;