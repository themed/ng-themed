import { Subject, Subscription } from 'rxjs';

import { NotificationStyle } from '../enums/NotificationStyle.enum';
import { NotificationToastConfig } from '../interfaces/NotificationToastConfig.interface';
import { NotificationEvent } from '../types/event.type';

// @TODO remove method in observable way
/**
 * Toast main model
 */
export class NotificationToast {
  /**
   * Emits {NotificationEvent}
   * @type {Subject<NotificationEvent>}
   */
  readonly eventEmitter = new Subject<NotificationEvent>();
  /**
   * Holds all subscribers because we need to unsubscribe from all before toast get destroyed
   * @type {Subscription[]}
   * @private
   */
  private _eventsHolder: Subscription[] = [];
  /**
   * Toast prompt value
   */
  value: string;
  /**
   * Toast validator
   */
  valid: boolean;
  constructor(public id: number,
    public title: string,
    public body: string,
    public config: NotificationToastConfig) {
    if (this.config.type === NotificationStyle.prompt) {
      this.value = '';
    }
    this.on('hidden', () => {
      this._eventsHolder.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
    });
  }

  /**
   * Subscribe to toast events
   * @param {NotificationEvent} event
   * @param {(toast: NotificationEvent) => void} action
   * @returns {this}
   */
  on(event: NotificationEvent, action: (toast: this) => void): this {
    this._eventsHolder.push(
      this.eventEmitter.subscribe((e: NotificationEvent) => {
        if (e === event) {
          action(this);
        }
      })
    );
    return this;
  }

  /**
   * Tests if a toast equals this toast.
   * @param {NotificationToast} toast
   * @returns {boolean} true then equals else false.
   */
  equals(toast: NotificationToast): boolean {
    return this.body === toast.body &&
      this.title === toast.title &&
      this.config.type === toast.config.type;
  }

}
