import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayMeals, clearTodayMeals } from './storage';
import { saveDay } from './firestore';
import { todayKey, yesterdayKey } from './date';

const LAST_ROLLOVER_KEY = 'lastRolloverDateKey';

export async function performDailyRollover() {
  const last = await AsyncStorage.getItem(LAST_ROLLOVER_KEY);
  const today = todayKey();
  if (last === today) return; // already ran today

  // Push yesterday's meals to Firestore if any
  const meals = await getTodayMeals();
  if (meals && meals.length > 0) {
    const yKey = yesterdayKey();
    await saveDay(yKey, meals);
  }
  await clearTodayMeals();
  await AsyncStorage.setItem(LAST_ROLLOVER_KEY, today);
}

