import { SafeHtml } from '@angular/platform-browser';

import { NotificationToastConfig } from './NotificationToastConfig.interface';

/**
 * Notification toast params
 */
export interface Notification {
  /**
   * Toast Title
   * @type {string}
   */
  title?: string;
  /**
   * Toast message
   * @type {string}
   */
  body?: string;
  /**
   * Config object
   * @type {NotificationToastConfig}
   */
  config?: NotificationToastConfig;
  /**
   * Html content
   */
  html?: string | SafeHtml;
}
