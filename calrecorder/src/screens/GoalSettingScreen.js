import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { spacing } from '../styles/theme';
import { getGoals, setGoals } from '../services/storage';
import { saveGoals, getGoalsRemote } from '../services/firestore';

export default function GoalSettingScreen() {
  const [goals, setGoalsState] = useState({ protein: 0, fat: 0, carbs: 0, fiber: 0, calories: 0 });

  useEffect(() => {
    (async () => {
      const local = await getGoals();
      const remote = await getGoalsRemote();
      setGoalsState(remote || local);
    })();
  }, []);

  function update(field, value) {
    setGoalsState((g) => ({ ...g, [field]: Number(value) || 0 }));
  }

  async function save() {
    await setGoals(goals);
    await saveGoals(goals);
  }

  function renderInput(label, field) {
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 6 }}>{label}</Text>
        <TextInput keyboardType="numeric" value={String(goals[field] || '')} onChangeText={(t) => update(field, t)}
          style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: spacing.lg, backgroundColor: '#f5f6f7' }}>
      {renderInput('Protein Goal (g)', 'protein')}
      {renderInput('Fat Goal (g)', 'fat')}
      {renderInput('Carbs Goal (g)', 'carbs')}
      {renderInput('Fiber Goal (g)', 'fiber')}
      {renderInput('Calorie Goal (kcal)', 'calories')}

      <Pressable onPress={save} style={{ backgroundColor: '#31c4b8', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>Save Goals</Text>
      </Pressable>
    </ScrollView>
  );
}
