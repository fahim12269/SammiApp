import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors, spacing, radius } from '../styles/theme';
import MacroBar from '../components/MacroBar';
import { getTodayMeals, getGoals } from '../services/storage';

function aggregateMeals(meals) {
  return meals.reduce(
    (acc, m) => ({
      protein: acc.protein + Number(m.protein || 0),
      fat: acc.fat + Number(m.fat || 0),
      carbs: acc.carbs + Number(m.carbs || 0),
      fiber: acc.fiber + Number(m.fiber || 0),
      calories: acc.calories + Number(m.calories || 0),
      burned: acc.burned + Number(m.burned || 0)
    }),
    { protein: 0, fat: 0, carbs: 0, fiber: 0, calories: 0, burned: 0 }
  );
}

export default function DashboardScreen({ navigation }) {
  const [meals, setMeals] = useState([]);
  const [goals, setGoalsState] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 });

  useEffect(() => {
    (async () => {
      const [m, g] = await Promise.all([getTodayMeals(), getGoals()]);
      setMeals(m);
      setGoalsState(g);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const [m, g] = await Promise.all([getTodayMeals(), getGoals()]);
      setMeals(m);
      setGoalsState(g);
    });
    return unsubscribe;
  }, [navigation]);

  const totals = useMemo(() => aggregateMeals(meals), [meals]);
  const remaining = Math.max(goals.calories - totals.calories + totals.burned, 0);
  const progress = goals.calories > 0 ? Math.min((totals.calories - totals.burned) / goals.calories, 1) : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f6f7' }} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={{ backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, shadowColor: '#00000022', shadowOpacity: 0.1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', width: 70 }}>
            <Text style={{ fontWeight: '700' }}>{totals.calories}</Text>
            <Text style={{ color: colors.muted }}>Eaten</Text>
          </View>

          <View style={{ alignItems: 'center', width: 180 }}>
            <View style={{ 
              width: 120, 
              height: 120, 
              borderRadius: 60, 
              backgroundColor: '#e6e6e6',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <View style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.primary,
                opacity: progress
              }} />
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', zIndex: 1 }}>
                {Math.round(remaining)}
              </Text>
              <Text style={{ color: '#fff', fontSize: 12, zIndex: 1 }}>Remaining</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', width: 70 }}>
            <Text style={{ fontWeight: '700' }}>{totals.burned}</Text>
            <Text style={{ color: colors.muted }}>Burned</Text>
          </View>
        </View>

        <View style={{ marginTop: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: colors.muted }}>Carbs</Text>
            <Text style={{ fontWeight: '700' }}>{`${totals.carbs} / ${goals.carbs} g`}</Text>
          </View>
          <MacroBar label="" value={totals.carbs} goal={goals.carbs} color={'#63b3ed'} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: 8 }}>
            <Text style={{ color: colors.muted }}>Protein</Text>
            <Text style={{ fontWeight: '700' }}>{`${totals.protein} / ${goals.protein} g`}</Text>
          </View>
          <MacroBar label="" value={totals.protein} goal={goals.protein} color={'#60a5fa'} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: 8 }}>
            <Text style={{ color: colors.muted }}>Fat</Text>
            <Text style={{ fontWeight: '700' }}>{`${totals.fat} / ${goals.fat} g`}</Text>
          </View>
          <MacroBar label="" value={totals.fat} goal={goals.fat} color={'#93c5fd'} />
        </View>
      </View>
    </ScrollView>
  );
}

