import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NotificationToast } from '../notification-toast.model';

@Component({
  selector: 'xm-notification-prompt',
  templateUrl: './prompt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * Prompt component. Part of PROMPT type
 */
export class PromptComponent {
  /**
   * Get PROMPT placeholder
   */
  @Input() toast: NotificationToast;
  /**
   * Is PROMPT focused
   * @type {boolean}
   */
  isPromptFocused = false;
}
