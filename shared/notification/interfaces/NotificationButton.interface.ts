import { NotificationToast } from '../toast/notification-toast.model';

/**
 * Buttons config.
 */

/**
 * Buttons config
 */
export interface NotificationButton {
  /**
   * Button text
   * @type {string}
   */
  text: string;
  /**
   * Action which will be called after button click
   * @type {function}
   * @param text? {string}
   * @returns {void}
   * @default this.remove(id)
   */
  action?: (toast: NotificationToast) => void;
  /**
   * Should button text be bold.
   */
  bold?: boolean;
}
