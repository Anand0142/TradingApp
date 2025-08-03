import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './Pages/Home';
import Graph from './Pages/Graph';
import Trade from './Pages/Trade';
import Deposit from './Pages/Deposit';
import DepositStatus from './Pages/depositStatus';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentParams, setCurrentParams] = useState({});
  const [balance, setBalance] = useState(500.00);
  
  const updateBalance = (amount) => {
    setBalance(prevBalance => prevBalance + parseFloat(amount));
  };

  const handleNavigation = (screen, params = {}) => {
    setCurrentScreen(screen);
    setCurrentParams(params);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={handleNavigation} balance={balance} />;
      case 'graph':
        return <Graph onNavigate={handleNavigation} />;
      case 'trade':
        return <Trade onNavigate={handleNavigation} />;
      case 'deposit':
        return <Deposit onNavigate={handleNavigation} />;
      case 'depositStatus':
        return (
          <DepositStatus 
            onNavigate={handleNavigation} 
            amount={currentParams.amount} 
            onDepositSuccess={updateBalance}
          />
        );
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}