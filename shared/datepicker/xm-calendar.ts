import { Injectable } from '@angular/core';

import { isInteger } from '../util/util';
import { XmDate } from './xm-date';

export function fromJSDate(jsDate: Date) {
  return new XmDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}
export function toJSDate(date: XmDate) {
  const jsDate = new Date(date.year, date.month - 1, date.day, 12);
  // this is done avoid 30 -> 1930 conversion
  if (!isNaN(jsDate.getTime())) {
    jsDate.setFullYear(date.year);
  }
  return jsDate;
}

export type XmPeriod = 'y' | 'm' | 'd';

export function XM_DATEPICKER_CALENDAR_FACTORY() {
  return new XmCalendarGregorian();
}

/**
 * A service that represents the calendar used by the datepicker.
 *
 * The default implementation uses the Gregorian calendar. You can inject it in your own
 * implementations if necessary to simplify `XmDate` calculations.
 */
@Injectable({ providedIn: 'root', useFactory: XM_DATEPICKER_CALENDAR_FACTORY })
export abstract class XmCalendar {
  /**
   * Returns the number of days per week.
   */
  abstract getDaysPerWeek(): number;

  /**
   * Returns an array of months per year.
   *
   * With default calendar we use ISO 8601 and return [1, 2, ..., 12];
   */
  abstract getMonths(year?: number): number[];

  /**
   * Returns the number of weeks per month.
   */
  abstract getWeeksPerMonth(): number;

  /**
   * Returns the weekday number for a given day.
   *
   * With the default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
   */
  abstract getWeekday(date: XmDate): number;

  /**
   * Adds a number of years, months or days to a given date.
   *
   * * `period` can be `y`, `m` or `d` and defaults to day.
   * * `number` defaults to 1.
   *
   * Always returns a new date.
   */
  abstract getNext(date: XmDate, period?: XmPeriod, number?: number): XmDate;

  /**
   * Subtracts a number of years, months or days from a given date.
   *
   * * `period` can be `y`, `m` or `d` and defaults to day.
   * * `number` defaults to 1.
   *
   * Always returns a new date.
   */
  abstract getPrev(date: XmDate, period?: XmPeriod, number?: number): XmDate;

  /**
   * Returns the week number for a given week.
   */
  abstract getWeekNumber(week: XmDate[], firstDayOfWeek: number): number;

  /**
   * Returns the today's date.
   */
  abstract getToday(): XmDate;

  /**
   * Checks if a date is valid in the current calendar.
   */
  abstract isValid(date: XmDate): boolean;
}

@Injectable()
export class XmCalendarGregorian extends XmCalendar {
  getDaysPerWeek() { return 7; }

  getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }

  getWeeksPerMonth() { return 6; }

  getNext(date: XmDate, period: XmPeriod = 'd', number = 1) {
    let jsDate = toJSDate(date);

    switch (period) {
      case 'y':
        return new XmDate(date.year + number, 1, 1);
      case 'm':
        jsDate = new Date(date.year, date.month + number - 1, 1, 12);
        break;
      case 'd':
        jsDate.setDate(jsDate.getDate() + number);
        break;
      default:
        return date;
    }

    return fromJSDate(jsDate);
  }

  getPrev(date: XmDate, period: XmPeriod = 'd', number = 1) { return this.getNext(date, period, -number); }

  getWeekday(date: XmDate) {
    let jsDate = toJSDate(date);
    let day = jsDate.getDay();
    // in JS Date Sun=0, in ISO 8601 Sun=7
    return day === 0 ? 7 : day;
  }

  getWeekNumber(week: XmDate[], firstDayOfWeek: number) {
    // in JS Date Sun=0, in ISO 8601 Sun=7
    if (firstDayOfWeek === 7) {
      firstDayOfWeek = 0;
    }

    const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
    let date = week[thursdayIndex];

    const jsDate = toJSDate(date);
    jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));  // Thursday
    const time = jsDate.getTime();
    jsDate.setMonth(0);  // Compare with Jan 1
    jsDate.setDate(1);
    return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
  }

  getToday(): XmDate { return fromJSDate(new Date()); }

  isValid(date: XmDate): boolean {
    if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
      return false;
    }

    // year 0 doesn't exist in Gregorian calendar
    if (date.year === 0) {
      return false;
    }

    const jsDate = toJSDate(date);

    return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year && jsDate.getMonth() + 1 === date.month &&
      jsDate.getDate() === date.day;
  }
}
