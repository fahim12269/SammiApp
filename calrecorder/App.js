import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './src/screens/DashboardScreen';
import AddEntryScreen from './src/screens/AddEntryScreen';
import GoalSettingScreen from './src/screens/GoalSettingScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { Pressable, Text } from 'react-native';
import { useEffect } from 'react';
import { performDailyRollover } from './src/services/rollover';
import { registerBackgroundTask } from './src/services/background';

const Stack = createNativeStackNavigator();

function HeaderRight({ navigation }) {
  return (
    <>
      <Pressable onPress={() => navigation.navigate('Calendar')} style={{ marginRight: 14 }}>
        <Text style={{ color: '#31c4b8', fontWeight: '700' }}>Calendar</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Goals')} style={{ marginRight: 14 }}>
        <Text style={{ color: '#31c4b8', fontWeight: '700' }}>Goals</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Add')}>
        <Text style={{ color: '#31c4b8', fontWeight: '700' }}>Add</Text>
      </Pressable>
    </>
  );
}

export default function App() {
  useEffect(() => {
    performDailyRollover();
    registerBackgroundTask();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={({ navigation }) => ({
          headerRight: () => <HeaderRight navigation={navigation} />
        })} />
        <Stack.Screen name="Add" component={AddEntryScreen} options={{ title: 'Add Entry' }} />
        <Stack.Screen name="Goals" component={GoalSettingScreen} options={{ title: 'Goals' }} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
