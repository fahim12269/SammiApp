import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { VictoryPie } from 'victory-native';
import Svg from 'react-native-svg';
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

export default function DashboardScreen() {
  const [meals, setMeals] = useState([]);
  const [goals, setGoalsState] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 });

  useEffect(() => {
    (async () => {
      const [m, g] = await Promise.all([getTodayMeals(), getGoals()]);
      setMeals(m);
      setGoalsState(g);
    })();
  }, []);

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

          <Svg width={180} height={160}>
            <VictoryPie
              standalone={false}
              width={180}
              height={160}
              innerRadius={60}
              startAngle={-90}
              endAngle={270}
              padAngle={2}
              data={[{ x: 1, y: progress }, { x: 2, y: 1 - progress }]}
              colorScale={[colors.primary, '#e6e6e6']}
              labels={() => null}
            />
          </Svg>
          <View style={{ position: 'absolute', top: 52, left: 0, right: 0, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '800' }}>{Math.round(remaining)}</Text>
            <Text style={{ color: colors.muted }}>Remaining</Text>
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


