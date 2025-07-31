import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import Home from './Pages/Home';
import Graph from './Pages/Graph';
import Trade from './Pages/Trade';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={setCurrentScreen} />;
      case 'graph':
        return <Graph onNavigate={setCurrentScreen} />;
      case 'trade':
        return <Trade onNavigate={setCurrentScreen} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0F13' }}>
      {renderScreen()}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
