import { Inject, Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { from, Observable, Subject, Subscription } from 'rxjs';

import { SetToastType } from './decorators/set-toast-type.decorator';
import { TransformArgument } from './decorators/transform-argument.decorator';
import { NotificationStyle } from './enums/NotificationStyle.enum';
import { Notification } from './interfaces/Notification.interface';
import { NotificationDefaults } from './interfaces/NotificationDefaults.interface';
import { NotificationToastConfig } from './interfaces/NotificationToastConfig.interface';
import { NotificationToast } from './toast/notification-toast.model';
import { NotificationType } from './types/notification.type';
import { mergeDeep, uuid } from './utils';

/**
 * NotificationService - create, remove, config toasts
 */
@Injectable()
// tslint:disable:unified-signatures
export class NotificationService {
  readonly emitter = new Subject<NotificationToast[]>();
  readonly toastChanged = new Subject<NotificationToast>();
  readonly toastDeleted = new Subject<number>();
  private notifications: NotificationToast[] = [];

  constructor(@Inject('NotificationToastConfig') public config: NotificationDefaults) {
  }
  /**
   * emit changes in notifications array
   */
  private emit(): void {
    this.emitter.next(this.notifications.slice());
  }

  /**
   * returns NotificationToast object
   * @param id {Number}
   * @return {NotificationToast|undefined}
   */
  get(id: number): NotificationToast {
    return this.notifications.find(toast => toast.id === id);
  }

  /**
   * add NotificationToast to notifications array
   * @param toast {NotificationToast}
   */
  private add(toast: NotificationToast): void {
    if (this.config.global.filterDuplicates && this.containsToast(toast)) {
      return;
    }
    if (this.config.global.newOnTop) {
      this.notifications.unshift(toast);
    } else {
      this.notifications.push(toast);
    }
    this.emit();
  }

  /**
   * checks if the toast is in the collection.
   * @param {NotificationToast} inToast
   * @returns {boolean}
   */
  private containsToast(inToast: NotificationToast): boolean {
    return this.notifications.some(toast => toast.equals(inToast));
  }

  /**
   * If ID passed, emits toast animation remove, if ID & REMOVE passed, removes toast from notifications array
   * @param id {number}
   * @param remove {boolean}
   */
  remove(id?: number, remove?: boolean): void {
    if (!id) {
      return this.clear();
    } else if (remove) {
      this.notifications = this.notifications.filter(toast => toast.id !== id);
      return this.emit();
    }
    this.toastDeleted.next(id);
  }

  /**
   * Clear notifications array
   */
  clear(): void {
    this.notifications = [];
    this.emit();
  }

  /**
   * Creates toast and add it to array, returns toast id
   * @param notification {Notification}
   * @return {number}
   */
  create(notification: Notification): NotificationToast {
    const config =
      mergeDeep(this.config.toast, this.config.type[notification.config.type], notification.config);
    const toast = new NotificationToast(
      uuid(),
      notification.title,
      notification.body,
      config
    );
    this.add(toast);
    return toast;
  }

  setDefaults(defaults: NotificationDefaults): NotificationDefaults {
    return this.config = mergeDeep(this.config, defaults) as NotificationDefaults;
  }

  /**
   * Create toast with simple style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  simple(body: string): NotificationToast;
  /**
   * Create toast with simple style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  simple(body: string, title: string): NotificationToast;
  /**
   * Create toast with simple style returns toast id;
   * @param body {String}
   * @param config {NotificationToastConfig}
   * @returns {number}
   */
  simple(body: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Create toast with simple style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  simple(body: string, title: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  simple(args: any): NotificationToast {
    return this.create(args);
  }

  /**
   * Create toast with success style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  success(body: string): NotificationToast;
  /**
   * Create toast with success style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  success(body: string, title: string): NotificationToast;
  /**
   * Create toast with success style returns toast id;
   * @param body {String}
   * @param config {NotificationToastConfig}
   * @returns {number}
   */
  success(body: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Create toast with success style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  success(body: string, title: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  success(args: any): NotificationToast {
    return this.create(args);
  }

  /**
   * Create toast with error style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  error(body: string): NotificationToast;
  /**
   * Create toast with error style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  error(body: string, title: string): NotificationToast;
  /**
   * Create toast with error style returns toast id;
   * @param body {String}
   * @param config {NotificationToastConfig}
   * @returns {number}
   */
  error(body: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Create toast with error style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  error(body: string, title: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  error(args: any): NotificationToast {
    return this.create(args);
  }

  /**
   * Create toast with info style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  info(body: string): NotificationToast;
  /**
   * Create toast with info style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  info(body: string, title: string): NotificationToast;
  /**
   * Create toast with info style returns toast id;
   * @param body {String}
   * @param config {NotificationToastConfig}
   * @returns {number}
   */
  info(body: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Create toast with info style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  info(body: string, title: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  info(args: any): NotificationToast {
    return this.create(args);
  }

  /**
   * Create toast with warning style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  warning(body: string): NotificationToast;
  /**
   * Create toast with warning style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  warning(body: string, title: string): NotificationToast;
  /**
   * Create toast with warning style returns toast id;
   * @param body {String}
   * @param config {NotificationToastConfig}
   * @returns {number}
   */
  warning(body: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Create toast with warning style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  warning(body: string, title: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  warning(args: any): NotificationToast {
    return this.create(args);
  }

  /**
   * Create toast with confirm style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  confirm(body: string): NotificationToast;
  /**
   * Create toast with confirm style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  confirm(body: string, title: string): NotificationToast;
  /**
   * Create toast with confirm style returns toast id;
   * @param body {String}
   * @param config {NotificationToastConfig}
   * @returns {number}
   */
  confirm(body: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Create toast with confirm style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  confirm(body: string, title: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  confirm(args: any): NotificationToast {
    return this.create(args);
  }

  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param body {String}
   * @returns {number}
   */
  prompt(body: string): NotificationToast;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  prompt(body: string, title: string): NotificationToast;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param body {String}
   * @param config {NotificationToastConfig}
   * @returns {number}
   */
  prompt(body: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  prompt(body: string, title: string, config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  prompt(args: any): NotificationToast {
    return this.create(args);
  }

  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   * @param body {String}
   * @param action {Promise<Notification> | Observable<Notification>}
   * @returns {number}
   */
  async(body: string, action: Promise<Notification> | Observable<Notification>): NotificationToast;
  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   * @param body {String}
   * @param title {String}
   * @param action {Promise<Notification> | Observable<Notification>}
   * @returns {number}
   */
  async(body: string, title: string, action: Promise<Notification> | Observable<Notification>): NotificationToast;
  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   * @param body {String}
   * @param action {Promise<Notification> | Observable<Notification>}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  async(body: string, action: Promise<Notification> | Observable<Notification>, config: NotificationToastConfig): NotificationToast;
  /**
   * Creates async toast with Info style. Pass action, and resolve or reject it.
   * @param body {String}
   * @param title {String}
   * @param action {Promise<Notification> | Observable<Notification>}
   * @param [config] {NotificationToastConfig}
   * @returns {number}
   */
  async(
    body: string,
    title: string,
    action: Promise<Notification> | Observable<Notification>,
    config: NotificationToastConfig): NotificationToast;
  /**
   * Transform toast arguments into {Notification} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  async(args: any): NotificationToast {
    let async: Observable<any>;
    if (args.action instanceof Promise) {
      async = from(args.action);
    } else {
      async = args.action;
    }

    const toast = this.create(args);

    toast.on('mounted',
      () => {
        const subscription: Subscription = async.subscribe(
          (next?: Notification) => {
            this.mergeToast(toast, next);
          },
          (error?: Notification) => {
            this.mergeToast(toast, error, NotificationStyle.error);
            subscription.unsubscribe();
          },
          () => {
            this.mergeToast(toast, {}, NotificationStyle.success);
            subscription.unsubscribe();
          }
        );
      }
    );

    return toast;
  }

  private mergeToast(toast, next, type?: NotificationType) {
    if (next.body) {
      toast.body = next.body;
    }
    if (next.title) {
      toast.title = next.title;
    }
    if (type) {
      toast.config = mergeDeep(toast.config, this.config.global, this.config.toast[type], { type }, next.config);
    } else {
      toast.config = mergeDeep(toast.config, next.config);
    }
    if (next.html) {
      toast.config.html = next.html;
    }
    this.emit();
    this.toastChanged.next(toast);
  }

  /**
   * Creates empty toast with html string inside
   * @param {string | SafeHtml} html
   * @param {NotificationToastConfig} config
   * @returns {number}
   */
  html(html: string | SafeHtml, config?: NotificationToastConfig): NotificationToast {
    return this.create({
      title: null,
      body: null,
      config: {
        ...config,
        ...{ html }
      }
    });
  }
}
