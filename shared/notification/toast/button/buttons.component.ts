import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NotificationService } from '../../notification.service';
import { NotificationToast } from '../notification-toast.model';

@Component({
  selector: 'xm-notification-button',
  templateUrl: './buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * Buttons component
 */
export class ButtonsComponent {
  /**
   * Get buttons Array
   */
  @Input() toast: NotificationToast;
  constructor(private service: NotificationService) { }

  /**
   * remove toast
   */
  remove() {
    this.service.remove(this.toast.id);
  }
}
