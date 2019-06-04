import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { XmDate } from '@shared/datepicker/xm-date';
import { NotificationService } from '@shared/notification/notification.service';

import { DateRange } from '../../models/date-time/date-range.model';

@Component({
  selector: 'xm-calendar-selector',
  templateUrl: './calendar-selector.component.html',
  styleUrls: ['./calendar-selector.component.scss']
})
export class CalendarSelectorComponent implements OnInit {
  @Input() maxDateSet: Date;
  @Input() dateRange: DateRange;
  @Input() maxDateRange: number;
  hoveredDate: XmDate;
  fromDate: XmDate;
  toDate: XmDate;
  @Output() dateSelected = new EventEmitter<DateRange>();
  isDisabled: Function;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.dateRange && this.dateRange.fromDate) {
      this.fromDate = this.convertToXMDate(this.dateRange.fromDate);
    }
    if (this.dateRange && this.dateRange.toDate) {
      this.toDate = this.convertToXMDate(this.dateRange.toDate);
    }
    // TODO: This needs to be converted to an input parameter
    this.isDisabled = (data: XmDate) => this.isDisabledMarker(data);
  }

  get placeholderString(): string {
    return this.dateRange.printDateRange();
  }

  appendClass(): void {
    let ref = document.getElementsByClassName('show');
    if (ref.length) {
      ref.item(0).className += ' date-picker-popup';
    }
  }

  convertToXMDate(date: Date): XmDate {
    return new XmDate(date.getFullYear(),
      date.getMonth() + 1,
      date.getDate());
  }

  convertFromXMDate(date: XmDate): Date {
    let jsDate = new Date(date.year, date.month - 1, date.day);
    return jsDate;
  }

  // Written using if statement to make adding addtional conditions easier
  isDisabledMarker(xmDate: XmDate): Boolean {
    let date: Date = new Date(xmDate.year, xmDate.month - 1, xmDate.day);
    if (date > this.maxDateSet) {
      return true;
    }
    return false;
  }

  onDateSelection(date: XmDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      // Really crazy logic to check if date is More than 30 days from the originally selected day
      let fromDateCompare = this.convertFromXMDate(this.fromDate);
      let maxDaysForward = new Date(fromDateCompare);
      maxDaysForward.setDate(fromDateCompare.getDate() + this.maxDateRange);
      let maxDaysForwardXM: XmDate = this.convertToXMDate(maxDaysForward);
      if (date.after(maxDaysForwardXM)) {
        // TODO: Refactor this into something better than an alert
        this.openNotification(`Date range cannot Extend more than ${this.maxDateRange} days. Please remake your selection.`);
        this.toDate = null;
        this.fromDate = null;
        this.hoveredDate = null;
      } else {
        this.toDate = date;
      }
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if (this.fromDate && this.toDate) {
      this.dateSelected.emit(
        new DateRange(this.convertFromXMDate(this.fromDate),
          this.convertFromXMDate(this.toDate)
        )
      );
    }
  }

  isHovered(date: XmDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: XmDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: XmDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  // TODO: Refactor to be global
  /**
   * open notification pop over for messaging to user
   * @returns no return
   */
  private openNotification(value: string) {
    this.notificationService.warning(value, {
      buttons: [
        {
          text: 'OK', action: (toast) => {
          }, bold: false
        },
      ]
    });
  }
}
