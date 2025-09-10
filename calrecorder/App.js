import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './src/screens/DashboardScreen';
import AddEntryScreen from './src/screens/AddEntryScreen';
import GoalSettingScreen from './src/screens/GoalSettingScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { useEffect } from 'react';
import { performDailyRollover } from './src/services/rollover';
import { registerBackgroundTask } from './src/services/background';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    performDailyRollover();
    registerBackgroundTask();
  }, []);
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
        <Tab.Screen name="Goals" component={GoalSettingScreen} options={{ title: 'Goals' }} />
        <Tab.Screen name="Add" component={AddEntryScreen} options={{ title: 'Add Entry' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
