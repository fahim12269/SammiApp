import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  todayMeals: 'todayMeals',
  goals: 'goals'
};

export async function getTodayMeals() {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.todayMeals);
  return json ? JSON.parse(json) : [];
}

export async function setTodayMeals(meals) {
  await AsyncStorage.setItem(STORAGE_KEYS.todayMeals, JSON.stringify(meals));
}

export async function clearTodayMeals() {
  await AsyncStorage.removeItem(STORAGE_KEYS.todayMeals);
}

export async function getGoals() {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.goals);
  return json ? JSON.parse(json) : { protein: 0, fat: 0, carbs: 0, fiber: 0, calories: 0 };
}

export async function setGoals(goals) {
  await AsyncStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
}


