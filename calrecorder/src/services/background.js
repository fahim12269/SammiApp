import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { performDailyRollover } from './rollover';

export const ROLLOVER_TASK = 'daily-rollover-task';

TaskManager.defineTask(ROLLOVER_TASK, async () => {
  try {
    await performDailyRollover();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted || status === BackgroundFetch.BackgroundFetchStatus.Denied) {
      return false;
    }
    const isRegistered = await TaskManager.isTaskRegisteredAsync(ROLLOVER_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(ROLLOVER_TASK, {
        minimumInterval: 60 * 60, // 1 hour; system decides exact timing
        stopOnTerminate: false,
        startOnBoot: true
      });
    }
    return true;
  } catch (e) {
    return false;
  }
}

