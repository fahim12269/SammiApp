import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../styles/theme';

export default function MacroBar({ label, value, goal, color }) {
  const progress = goal > 0 ? Math.min(value / goal, 1) : 0;
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ color: colors.muted, marginBottom: 6 }}>{label}</Text>
      <View style={{ height: 6, backgroundColor: colors.grayBar, borderRadius: 4 }}>
        <View style={{ width: `${progress * 100}%`, height: 6, backgroundColor: color, borderRadius: 4 }} />
      </View>
      <Text style={{ marginTop: 4, fontWeight: '600' }}>{`${value} / ${goal} g`}</Text>
    </View>
  );
}


