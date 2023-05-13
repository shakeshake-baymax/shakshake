import React from 'react';
import {View} from 'react-native';

type BoxSizePorps = {
  height?: number;
  width?: number;
  bgColor?: string;
};

export default function BoxSize(props: BoxSizePorps) {
  const {height, width, bgColor} = props;
  return (
    <View
      style={{
        height: height || '100%',
        width: width || '100%',
        backgroundColor: bgColor || '100%',
      }}
    />
  );
}
