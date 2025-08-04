import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../components/firebase';

const SplashScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Start fade out animation after 2 seconds
    const fadeOutTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    // Check auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Navigate after animation completes
      setTimeout(() => {
        if (user) {
          // User is signed in, navigate to Home
          navigation.replace('Home');
        } else {
          // No user is signed in, navigate to Login
          navigation.replace('Login');
        }
      }, 2500);
    });

    // Cleanup
    return () => {
      clearTimeout(fadeOutTimer);
      unsubscribe();
    };
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/exness_logo.jpg')}
        style={[
          styles.fullScreenImage,
          {
            opacity: fadeAnim,
          }
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;