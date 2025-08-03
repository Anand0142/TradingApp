import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base design dimensions (iPhone 11 - 414 width x 896 height)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

// Base scaling function
const baseScale = (size) => (width / BASE_WIDTH) * size;

// Vertical scaling
export const verticalScale = (size) => {
  return (height / BASE_HEIGHT) * size;
};

// Icon scaling
export const responsiveIconSize = (size) => {
  return baseScale(size);
};

// Button scaling with max cap
export const responsiveButtonWidth = (size) => {
  return Math.min(baseScale(size), size * 1.5); // Cap scaling at 1.5x
};

// Moderate scaling for better text and other elements
export const moderateScale = (size, factor = 0.5) => {
  return size + (baseScale(size) - size) * factor;
};

// Alias for backward compatibility
export const scale = responsiveButtonWidth;