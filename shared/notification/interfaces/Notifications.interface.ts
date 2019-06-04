import { NotificationToast } from '../toast/notification-toast.model';

/**
 * Notifications object
 */
export interface Notifications {
  left_top?: NotificationToast[];
  left_center?: NotificationToast[];
  left_bottom?: NotificationToast[];

  right_top?: NotificationToast[];
  right_center?: NotificationToast[];
  right_bottom?: NotificationToast[];

  center_top?: NotificationToast[];
  center_center?: NotificationToast[];
  center_bottom?: NotificationToast[];
}
