import * as Notifications from "expo-notifications";

export async function schedulePushNotification(
  content: Notifications.NotificationContentInput,
  trigger: Notifications.NotificationTriggerInput
) {
  await Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
}
