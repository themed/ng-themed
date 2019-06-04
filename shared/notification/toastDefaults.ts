import { NotificationPosition } from './enums/NotificationPosition.enum';
import { NotificationStyle } from './enums/NotificationStyle.enum';

/**
 * Notification default configuration object
 * @type {NotificationToastDefaults}
 */
export const NotificationToastDefaults = {
  global: {
    newOnTop: true,
    maxOnScreen: 4,
    maxAtPosition: 4,
    filterDuplicates: false
  },
  toast: {
    type: NotificationStyle.simple,
    showProgressBar: false,
    timeout: 0,
    closeOnClick: true,
    pauseOnHover: true,
    bodyMaxLength: 150,
    titleMaxLength: 60,
    backdrop: 0.4,
    icon: null,
    iconClass: null,
    html: null,
    position: NotificationPosition.rightTop,
    animation: { enter: 'fadeIn', exit: 'fadeOut', time: 400 }
  },
  type: {
    [NotificationStyle.prompt]: {
      timeout: 0,
      closeOnClick: false,
      buttons: [
        { text: 'Ok', action: null, bold: true },
        { text: 'Cancel', action: null, bold: false },
      ],
      placeholder: 'Enter answer here...',
      type: NotificationStyle.prompt,
    },
    [NotificationStyle.confirm]: {
      timeout: 0,
      closeOnClick: false,
      buttons: [
        { text: 'Ok', action: null, bold: true },
        { text: 'Cancel', action: null, bold: false },
      ],
      type: NotificationStyle.confirm,
    },
    [NotificationStyle.simple]: {
      type: NotificationStyle.simple
    },
    [NotificationStyle.success]: {
      type: NotificationStyle.success
    },
    [NotificationStyle.error]: {
      type: NotificationStyle.error
    },
    [NotificationStyle.warning]: {
      type: NotificationStyle.warning
    },
    [NotificationStyle.info]: {
      type: NotificationStyle.info
    },
    [NotificationStyle.async]: {
      pauseOnHover: false,
      closeOnClick: false,
      timeout: 0,
      showProgressBar: false,
      type: NotificationStyle.async
    }
  }
};
