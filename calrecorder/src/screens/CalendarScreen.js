import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getDay } from '../services/firestore';
import { getGoals } from '../services/storage';
import { spacing } from '../styles/theme';

function TotalsRow({ meals }) {
  const totals = meals.reduce((a, m) => ({
    protein: a.protein + (m.protein || 0),
    fat: a.fat + (m.fat || 0),
    carbs: a.carbs + (m.carbs || 0),
    fiber: a.fiber + (m.fiber || 0),
    calories: a.calories + (m.calories || 0)
  }), { protein: 0, fat: 0, carbs: 0, fiber: 0, calories: 0 });
  return totals;
}

function Table({ date, meals, goals }) {
  const totals = TotalsRow({ meals });
  const rows = [
    ...meals.map((m) => ({ label: m.type || 'Meal', ...m })),
    { label: 'TOTAL', bold: true, ...totals },
    { label: 'GOALS', bold: true, ...goals }
  ];

  function Cell({ text, bold }) {
    return <Text style={{ flex: 1, padding: 8, borderWidth: 1, borderColor: '#374151', color: '#fff', fontWeight: bold ? '800' : '400' }}>{text}</Text>;
  }

  return (
    <View style={{ marginTop: 12, borderWidth: 1, borderColor: '#374151' }}>
      <View style={{ flexDirection: 'row', backgroundColor: '#111827' }}>
        <Cell text={date} bold />
        <Cell text={'Protein'} bold />
        <Cell text={'Fat'} bold />
        <Cell text={'Carbs'} bold />
        <Cell text={'Fiber'} bold />
        <Cell text={'Calories'} bold />
      </View>
      {rows.map((r, idx) => (
        <View style={{ flexDirection: 'row', backgroundColor: '#1f2937' }} key={idx}>
          <Cell text={r.label} bold={r.bold} />
          <Cell text={String(r.protein || 0)} bold={r.bold} />
          <Cell text={String(r.fat || 0)} bold={r.bold} />
          <Cell text={String(r.carbs || 0)} bold={r.bold} />
          <Cell text={String(r.fiber || 0)} bold={r.bold} />
          <Cell text={String(r.calories || 0)} bold={r.bold} />
        </View>
      ))}
    </View>
  );
}

export default function CalendarScreen() {
  const [selected, setSelected] = useState(null);
  const [meals, setMeals] = useState([]);
  const [goals, setGoalsState] = useState({ protein: 0, fat: 0, carbs: 0, fiber: 0, calories: 0 });

  async function onDayPress(day) {
    const dateKey = day.dateString; // YYYY-MM-DD
    if (selected === dateKey) {
      setSelected(null);
      return;
    }
    setSelected(dateKey);
    const [doc, g] = await Promise.all([getDay(dateKey), getGoals()]);
    setMeals(doc.meals || []);
    setGoalsState(g);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f1115' }} contentContainerStyle={{ padding: spacing.lg }}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={selected ? { [selected]: { selected: true } } : {}}
      />
      {selected && <Table date={selected.replace('-', ' ')} meals={meals} goals={goals} />}
    </ScrollView>
  );
}

