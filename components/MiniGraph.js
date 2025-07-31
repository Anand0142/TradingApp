import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';

const MiniGraph = ({ data = [], width = 60, height = 20, color = '#FF5B5A' }) => {
  if (!data || data.length === 0) {
    // Generate sample data with downward trend if none provided
    data = [
      { value: 0.9, isUp: true },
      { value: 0.85, isUp: false },
      { value: 0.8, isUp: true },
      { value: 0.7, isUp: false },
      { value: 0.75, isUp: true },
      { value: 0.65, isUp: false },
      { value: 0.6, isUp: false },
      { value: 0.5, isUp: false },
      { value: 0.45, isUp: false },
      { value: 0.4, isUp: false }
    ];
  }

  // Create points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = (1 - item.value) * height;
    return { x, y, isUp: item.isUp };
  });

  // Create path for the line
  const path = points.reduce((acc, point, index) => {
    if (index === 0) return `M${point.x},${point.y}`;
    return `${acc} L${point.x},${point.y}`;
  }, '');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {/* Dotted baseline */}
        <Line
          x1="0"
          y1={height - 1}
          x2={width}
          y2={height - 1}
          stroke="#888888"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        
        {/* Main trend line */}
        <Path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* End point dot */}
        <Path
          d={`M${points[points.length-1].x-1.5} ${points[points.length-1].y-1.5}h3v3h-3z`}
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default MiniGraph;
