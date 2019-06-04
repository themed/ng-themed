import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { XmDatepickerI18n } from './datepicker-i18n';
import { MonthViewModel, NavigationEvent } from './datepicker-view-model';
import { XmDate } from './xm-date';

@Component({
  selector: 'xm-datepicker-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./datepicker-navigation.scss'],
  template: `
    <div class="xm-dp-arrow left">
      <button type="button" class="xm-dp-arrow-btn" (click)="navigate.emit(navigation.PREV)" [disabled]="prevDisabled"
              i18n-aria-label="@@xm.datepicker.previous-month" aria-label="Previous month"
              i18n-title="@@xm.datepicker.previous-month" title="Previous month">
        <span class="xm-dp-navigation-chevron"></span>
      </button>
    </div>
    <xm-datepicker-navigation-select *ngIf="showSelect" class="xm-dp-navigation-select"
      [date]="date"
      [disabled] = "disabled"
      [months]="selectBoxes.months"
      [years]="selectBoxes.years"
      (select)="select.emit($event)">
    </xm-datepicker-navigation-select>

    <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
      <div class="xm-dp-arrow" *ngIf="i > 0"></div>
      <div class="xm-dp-month-name">
        <span>{{ i18n.getMonthFullName(month.number, month.year) }} {{ i18n.getYearNumerals(month.year) }}</span>
      </div>
      <div class="xm-dp-arrow" *ngIf="i !== months.length - 1"></div>
    </ng-template>
    <div class="xm-dp-arrow right">
      <button type="button" class="xm-dp-arrow-btn" (click)="navigate.emit(navigation.NEXT)" [disabled]="nextDisabled"
              i18n-aria-label="@@xm.datepicker.next-month" aria-label="Next month"
              i18n-title="@@xm.datepicker.next-month" title="Next month">
        <span class="xm-dp-navigation-chevron"></span>
      </button>
    </div>
    `
})
export class XmDatepickerNavigationComponent {
  navigation = NavigationEvent;

  @Input() date: XmDate;
  @Input() disabled: boolean;
  @Input() months: MonthViewModel[] = [];
  @Input() showSelect: boolean;
  @Input() prevDisabled: boolean;
  @Input() nextDisabled: boolean;
  @Input() selectBoxes: { years: number[], months: number[] };

  @Output() navigate = new EventEmitter<NavigationEvent>();
  @Output() select = new EventEmitter<XmDate>();

  constructor(public i18n: XmDatepickerI18n) { }
}
