import { Notification } from '../interfaces/Notification.interface';
import { NotificationType } from '../types/notification.type';

/**
 * Defines toast style depending on method name
 * @param target
 * @param {NotificationType} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns {{value: ((...args: any[]) => any)}}
 * @constructor
 */
export function SetToastType(target: any, propertyKey: NotificationType, descriptor: PropertyDescriptor) {
  return {
    value: function (...args: any[]) {
      (args[0] as Notification).config = {
        ...(args[0] as Notification).config,
        type: propertyKey
      };
      return descriptor.value.apply(this, args);
    }
  };
}
