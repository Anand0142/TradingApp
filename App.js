import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Pages/SplashScreen';
import LoginScreen from './Pages/LoginScreen';
import Home from './Pages/Home';
import Graph from './Pages/Graph';
import Trade from './Pages/Trade';
import Deposit from './Pages/Deposit';
import DepositStatus from './Pages/depositStatus';

const Stack = createNativeStackNavigator();

// Main App component with navigation
export default function App() {
  const [balance, setBalance] = useState(500.00);
  
  const updateBalance = (amount) => {
    setBalance(prevBalance => prevBalance + parseFloat(amount));
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home">
            {props => <Home {...props} balance={balance} />}
          </Stack.Screen>
          <Stack.Screen name="Graph" component={Graph} />
          <Stack.Screen name="Trade" component={Trade} />
          <Stack.Screen name="Deposit" component={Deposit} />
          <Stack.Screen name="DepositStatus">
            {props => (
              <DepositStatus 
                {...props}
                onDepositSuccess={updateBalance}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}