import { Platform } from 'react-native';
import { performDailyRollover } from './rollover';

export const ROLLOVER_TASK = 'daily-rollover-task';

async function ensureTaskDefined(TaskManager, BackgroundFetch) {
  try {
    TaskManager.defineTask(ROLLOVER_TASK, async () => {
      try {
        await performDailyRollover();
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (e) {
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
  } catch (e) {
    // ignore if TaskManager is unavailable
  }
}

export async function registerBackgroundTask() {
  if (Platform.OS === 'web') return false;
  try {
    const TaskManager = await import('expo-task-manager');
    const BackgroundFetch = await import('expo-background-fetch');
    await ensureTaskDefined(TaskManager, BackgroundFetch);
    const status = await BackgroundFetch.getStatusAsync();
    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) {
      return false;
    }
    const isRegistered = await TaskManager.isTaskRegisteredAsync(ROLLOVER_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(ROLLOVER_TASK, {
        minimumInterval: 60 * 60,
        stopOnTerminate: false,
        startOnBoot: true
      });
    }
    return true;
  } catch (e) {
    return false;
  }
}

