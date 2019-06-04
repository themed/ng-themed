import { SafeHtml } from '@angular/platform-browser';

import { NotificationPosition } from '../enums/NotificationPosition.enum';
import { NotificationType } from '../types/notification.type';
import { NotificationAnimate } from './NotificationAnimate.interface';
import { NotificationButton } from './NotificationButton.interface';

/**
 * Toast configuration object
 */
export interface NotificationToastConfig {

  /**
   * Toast timeout in milliseconds.
   * Disable timeout = 0
   * @type {number}
   * @default: 2000
   */
  timeout?: number;
  /**
   * Enable/Disable progress bar.
   * Disabled if timeout is 0.
   * @type {boolean}
   * @default true
   */
  showProgressBar?: boolean;
  /**
   * Type of toast, affects toast style.
   * It's not recommended to change it.
   * Depends on toast type.
   * @type {NotificationType}
   * @default NotificationStyle.SIMPLE | NotificationStyle.SUCCESS | NotificationStyle. ERROR | NotificationStyle.WARNING etc..
   */
  type?: NotificationType;
  /**
   * Should toast close on click?
   * @type {boolean}
   * @default true
   */
  closeOnClick?: boolean;
  /**
   * Should timeout pause on hover?
   * @type {boolean}
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * Buttons config.
   * @type {NotificationButton[]}
   * @default Look Notification button description
   */
  buttons?: NotificationButton[];
  /**
   * Placeholder for Prompt toast
   * @type {string}
   * @default 'Enter answer here...'
   */
  placeholder?: string;
  /**
   * Toast title maximum length
   * @type {number}
   * @default 16
   */
  titleMaxLength?: number;
  /**
   * Toast body maximum length
   * @type {number}
   * @default 150
   */
  bodyMaxLength?: number;
  /**
   * Activate custom icon.
   * You should provide full tag, e.g.
   * ```html
   * <img src="assets/custom-icon.png"/>
   * ```
   * ```html
   * <svg x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 48 48;" xml:space="preserve" width="48px" height="48px">
   *     <g><path....../></g>
   * </svg>
   * ```
   * @type {string}
   * @default Depends on toast type. Look more in icon.component.html
   */
  icon?: string;

  /**
   * Custom icon class.
   * @default null
   */
  iconClass?: string;
  /**
   * Backdrop opacity.
   * * **Range:** `0.0 - 1.0`.
   * * **Disabled:** `-1`
   * @type {number}
   * @default -1
   */
  backdrop?: number;
  /**
   * Animation config
   * @type {NotificationAnimate}
   * @default -1
   */
  animation?: NotificationAnimate;
  /**
   * Html string witch overrides toast content
   * @type {string | SafeHtml}
   * @default null
   */
  html?: string | SafeHtml;
  /**
   * Toasts position on screen
   * @type {NotificationPosition}
   * @default NotificationPosition.rightBottom
   */
  position?: NotificationPosition;
}
