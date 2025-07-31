// components/TradeIcon.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const TradeIcon = ({ size = 24, color = 'black', strokeWidth = 1.33 }) => (
  // The 'viewBox' is "0 0 16 16" from your SVG
  // 'fill="none"' because the icon is primarily drawn with strokes
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      // This is the 'd' attribute value directly from your SVG's <path> element
      d="M4.66797 2.66602V4.66602M4.66797 8.66602V13.3327M11.3346 2.66602V4.66602M11.3346 11.3327V13.3327M2.66797 5.33268C2.66797 5.15587 2.73821 4.9863 2.86323 4.86128C2.98826 4.73625 3.15782 4.66602 3.33464 4.66602H6.0013C6.17811 4.66602 6.34768 4.73625 6.47271 4.86128C6.59773 4.9863 6.66797 5.15587 6.66797 5.33268V7.99935C6.66797 8.17616 6.59773 8.34573 6.47271 8.47075C6.34768 8.59578 6.17811 8.66602 6.0013 8.66602H3.33464C3.15782 8.66602 2.98826 8.59578 2.86323 8.47075C2.73821 8.34573 2.66797 8.17616 2.66797 7.99935V5.33268ZM9.33464 5.33268C9.33464 5.15587 9.40487 4.9863 9.5299 4.86128C9.65492 4.73625 9.82449 4.66602 10.0013 4.66602H12.668C12.8448 4.66602 13.0143 4.73625 13.1394 4.86128C13.2644 4.9863 13.3346 5.15587 13.3346 5.33268V10.666C13.3346 10.8428 13.2644 11.0124 13.1394 11.1374C13.0143 11.2624 12.8448 11.3327 12.668 11.3327H10.0013C9.82449 11.3327 9.65492 11.2624 9.5299 11.1374C9.40487 11.0124 9.33464 10.8428 9.33464 10.666V5.33268Z"
      // These props control the appearance
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TradeIcon;