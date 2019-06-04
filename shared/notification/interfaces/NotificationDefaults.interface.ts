import { NotificationGlobalConfig } from './NotificationGlobalConfig.interface';
import { NotificationToastConfig } from './NotificationToastConfig.interface';

/**
 * Global configuration object
 */
export interface NotificationDefaults {
  global?: NotificationGlobalConfig;
  toast?: NotificationToastConfig;
  type?: {
    [key: string]: NotificationToastConfig
  };
}
