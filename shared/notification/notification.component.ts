import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationPosition } from './enums/NotificationPosition.enum';
import { Notifications } from './interfaces/Notifications.interface';
import { NotificationService } from './notification.service';
import { NotificationToast } from './toast/notification-toast.model';
import { NotificationEvent } from './types/event.type';



@Component({
  selector: 'xm-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class XmNotificationComponent implements OnInit, OnDestroy {
  /**
   * Toasts array
   */
  notifications: Notifications;
  /**
   * Toasts emitter
   */
  emitter: Subscription;
  /**
   * Helper for slice pipe (maxOnScreen)
   */
  dockSize_a: number;
  /**
   * Helper for slice pipe (maxOnScreen)
   */
  dockSize_b: number | undefined;
  /**
   * Helper for slice pipe (maxAtPosition)
   */
  blockSize_a: number;
  /**
   * Helper for slice pipe (maxAtPosition)
   */
  blockSize_b: number | undefined;
  /**
   * Backdrop Opacity
   */
  backdrop = -1;
  /**
   * How many toasts with backdrop in current queue
   */
  withBackdrop: NotificationToast[];

  constructor(private service: NotificationService) { }

  /**
   * Init base options. Subscribe to options, lifecycle change
   */
  ngOnInit() {
    this.emitter = this.service.emitter.subscribe(
      (toasts: NotificationToast[]) => {

        if (this.service.config.global.newOnTop) {
          this.dockSize_a = -this.service.config.global.maxOnScreen;
          this.dockSize_b = undefined;
          this.blockSize_a = -this.service.config.global.maxAtPosition;
          this.blockSize_b = undefined;
          this.withBackdrop = toasts.filter(toast => toast.config.backdrop >= 0);
        } else {
          this.dockSize_a = 0;
          this.dockSize_b = this.service.config.global.maxOnScreen;
          this.blockSize_a = 0;
          this.blockSize_b = this.service.config.global.maxAtPosition;
          this.withBackdrop = toasts.filter(toast => toast.config.backdrop >= 0).reverse();
        }
        this.notifications = this.splitToasts(toasts.slice(this.dockSize_a, this.dockSize_b));
        this.stateChanged('mounted');
      }
    );

  }

  // TODO: fix backdrop if more than one toast called in a row
  /**
   * Changes the backdrop opacity
   * @param {NotificationEvent} event
   */
  stateChanged(event: NotificationEvent) {
    if (!this.withBackdrop.length) {
      if (this.backdrop >= 0) {
        this.backdrop = -1;
      }
      return;
    }
    switch (event) {
      case 'mounted':
        if (this.backdrop < 0) {
          this.backdrop = 0;
        }
        break;
      case 'beforeShow':
        this.backdrop = this.withBackdrop[this.withBackdrop.length - 1].config.backdrop;
        break;
      case 'beforeHide':
        if (this.withBackdrop.length === 1) {
          this.backdrop = 0;
        }
        break;
      case 'hidden':
        if (this.withBackdrop.length === 1) {
          this.backdrop = -1;
        }
        break;
    }

  }

  /**
   * Split toasts toasts into different objects
   * @param {NotificationToast[]} toasts
   * @returns {Notifications}
   */
  splitToasts(toasts: NotificationToast[]): Notifications {
    const result: Notifications = {};

    for (const property in NotificationPosition) {
      if (NotificationPosition.hasOwnProperty(property)) {
        result[NotificationPosition[property]] = [];
      }
    }

    toasts.forEach((toast: NotificationToast) => {
      result[toast.config.position as string].push(toast);
    });

    return result;
  }

  /**
   * Unsubscribe subscriptions
   */
  ngOnDestroy() {
    this.emitter.unsubscribe();
  }

}
