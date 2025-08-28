import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { spacing, radius } from '../styles/theme';
import { getTodayMeals, setTodayMeals } from '../services/storage';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

function MealRow({ meal, onChange }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md }}>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Meal</Text>
      <TextInput
        value={meal.type}
        placeholder="Breakfast/Lunch/Snack/Dinner"
        onChangeText={(t) => onChange({ ...meal, type: t })}
        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 }}
      />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput keyboardType="numeric" placeholder="Protein" value={String(meal.protein || '')}
          onChangeText={(t) => onChange({ ...meal, protein: Number(t) || 0 })}
          style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }} />
        <TextInput keyboardType="numeric" placeholder="Fat" value={String(meal.fat || '')}
          onChangeText={(t) => onChange({ ...meal, fat: Number(t) || 0 })}
          style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <TextInput keyboardType="numeric" placeholder="Carbs" value={String(meal.carbs || '')}
          onChangeText={(t) => onChange({ ...meal, carbs: Number(t) || 0 })}
          style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }} />
        <TextInput keyboardType="numeric" placeholder="Fiber" value={String(meal.fiber || '')}
          onChangeText={(t) => onChange({ ...meal, fiber: Number(t) || 0 })}
          style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }} />
      </View>
      <TextInput keyboardType="numeric" placeholder="Calories" value={String(meal.calories || '')}
        onChangeText={(t) => onChange({ ...meal, calories: Number(t) || 0 })}
        style={{ marginTop: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }} />
    </View>
  );
}

export default function AddEntryScreen() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    (async () => {
      const stored = await getTodayMeals();
      setMeals(stored && stored.length > 0 ? stored : [{ type: 'Breakfast', protein: 0, fat: 0, carbs: 0, fiber: 0, calories: 0 }]);
    })();
  }, []);

  function updateMeal(idx, next) {
    const copy = [...meals];
    copy[idx] = next;
    setMeals(copy);
  }

  async function addMeal() {
    setMeals((m) => [...m, { type: 'Snack', protein: 0, fat: 0, carbs: 0, fiber: 0, calories: 0 }]);
  }

  async function save() {
    await setTodayMeals(meals);
  }

  return (
    <ScrollView style={{ flex: 1, padding: spacing.lg, backgroundColor: '#f5f6f7' }}>
      {meals.map((m, i) => (
        <MealRow key={i} meal={m} onChange={(next) => updateMeal(i, next)} />
      ))}

      <Pressable onPress={addMeal} style={{ backgroundColor: '#e6f7f5', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: '#0f766e', fontWeight: '700' }}>Add Another Meal</Text>
      </Pressable>

      <Pressable onPress={save} style={{ backgroundColor: '#31c4b8', padding: 14, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

