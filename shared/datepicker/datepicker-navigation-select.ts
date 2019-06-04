import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { toInteger } from '../util/util';
import { XmDatepickerI18n } from './datepicker-i18n';
import { XmDate } from './xm-date';

@Component({
  selector: 'xm-datepicker-navigation-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./datepicker-navigation-select.scss'],
  template: `
    <select
      [disabled]="disabled"
      class="datepicker-select"
      [value]="date?.month"
      i18n-aria-label="@@xm.datepicker.select-month" aria-label="Select month"
      i18n-title="@@xm.datepicker.select-month" title="Select month"
      (change)="changeMonth($event.target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date?.year)"
                [value]="m">{{ i18n.getMonthShortName(m, date?.year) }}</option>
    </select><select
      [disabled]="disabled"
      class="datepicker-select"
      [value]="date?.year"
      i18n-aria-label="@@xm.datepicker.select-year" aria-label="Select year"
      i18n-title="@@xm.datepicker.select-year" title="Select year"
      (change)="changeYear($event.target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `
})
export class XmDatepickerNavigationSelectComponent {
  @Input() date: XmDate;
  @Input() disabled: boolean;
  @Input() months: number[];
  @Input() years: number[];

  @Output() select = new EventEmitter<XmDate>();

  constructor(public i18n: XmDatepickerI18n) { }

  changeMonth(month: string) { this.select.emit(new XmDate(this.date.year, toInteger(month), 1)); }

  changeYear(year: string) { this.select.emit(new XmDate(toInteger(year), this.date.month, 1)); }
}
