// components/WithdrawIcon.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const WithdrawIcon = ({ size = 24, color = 'black', strokeWidth = 2 }) => (
  // viewBox="0 0 24 24" from your SVG
  // fill="none" as the icon uses strokes
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* All path elements from your SVG, with dynamic stroke color and width */}
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 9l-6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 15v-6h-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default WithdrawIcon;