import { NotificationType } from '../types/notification.type';

/**
 * Toast styles
 */
export interface NotificationStyles {
  simple: NotificationType;
  success: NotificationType;
  error: NotificationType;
  warning: NotificationType;
  info: NotificationType;
  async: NotificationType;
  confirm: NotificationType;
  prompt: NotificationType;
}
