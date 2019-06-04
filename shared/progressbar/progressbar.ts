import { ChangeDetectionStrategy, Component, HostBinding, Injectable, Input } from '@angular/core';

import { getValueInRange } from '../util/util';

@Injectable({ providedIn: 'root' })
export class XmProgressbarConfig {
  max = 100;
  type: string;
  showValue = false;
  height: string;
}

/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
@Component({
  selector: 'xm-progressbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
})
export class XmProgressbarComponent {
  /**
   * Maximal value to be displayed in the progressbar.
   */
  @Input() max: number;

  @Input() customClass: string;

  /**
   * A flag indicating if the current percentage value should be shown.
   */
  @Input() showValue: boolean;

  /**
   * Type of progress bar, can be one of "success", "warning" or "danger".
   */
  @Input() type: string;

  /**
   * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
   */
  @Input() value = 0;

  /**
   * Height of the progress bar. Accepts any valid CSS height values, ex. '2rem'
   */
  @Input() height: string;

  @HostBinding('class') get classes() {
    return this.customClass ? this.customClass : '';
  }

  constructor(config: XmProgressbarConfig) {
    this.max = config.max;
    this.type = config.type;
    this.showValue = config.showValue;
    this.height = config.height;
  }

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}
