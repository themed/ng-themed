/**
 * Notification animation params
 * If you want more animations, you can include animate.css or write animations yourself in your styles
 * Then you'll need to share this styles with notification component [xm-notification] component.
 */
export interface NotificationAnimate {
  /**
   * In animation
   * @type {string}
   *
   * @default 'fadeIn'
   */
  enter: string;
  /**
   * Out animation
   * @type {string}
   * @default 'fadeOut'
   */
  exit: string;
  /**
   * Animation time in ms
   * @type {number}
   * @default 400
   */
  time: number;
}
