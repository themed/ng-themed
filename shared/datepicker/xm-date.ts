import { isInteger } from '../util/util';
import { XmDateStruct } from './xm-date-struct';

/**
 * A simple class that represents a date that datepicker also uses internally.
 *
 * It is the implementation of the `XmDateStruct` interface that adds some convenience methods,
 * like `.equals()`, `.before()`, etc.
 *
 * All datepicker APIs consume `XmDateStruct`, but return `XmDate`.
 *
 *
 *
 * @since 3.0.0
 */
export class XmDate implements XmDateStruct {
  /**
   * The year, for example 2016
   */
  year: number;

  /**
   * The month, for example 1=Jan ... 12=Dec as in ISO 8601
   */
  month: number;

  /**
   * The day of month, starting with 1
   */
  day: number;

  /**
   * A **static method** that creates a new date object from the `XmDateStruct`,
   *
   * ex. `XmDate.from({year: 2000, month: 5, day: 1})`.
   *
   * If the `date` is already of `XmDate` type, the method will return the same object.
   */
  static from(date: XmDateStruct): XmDate {
    if (date instanceof XmDate) {
      return date;
    }
    return date ? new XmDate(date.year, date.month, date.day) : null;
  }

  constructor(year: number, month: number, day: number) {
    this.year = isInteger(year) ? year : null;
    this.month = isInteger(month) ? month : null;
    this.day = isInteger(day) ? day : null;
  }

  /**
   * Checks if the current date is equal to another date.
   */
  equals(other: XmDateStruct): boolean {
    return other && this.year === other.year && this.month === other.month && this.day === other.day;
  }

  /**
   * Checks if the current date is before another date.
   */
  before(other: XmDateStruct): boolean {
    if (!other) {
      return false;
    }

    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day < other.day;
      } else {
        return this.month < other.month;
      }
    } else {
      return this.year < other.year;
    }
  }

  /**
   * Checks if the current date is after another date.
   */
  after(other: XmDateStruct): boolean {
    if (!other) {
      return false;
    }
    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day > other.day;
      } else {
        return this.month > other.month;
      }
    } else {
      return this.year > other.year;
    }
  }
}
