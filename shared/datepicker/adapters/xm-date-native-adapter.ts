import { Injectable } from '@angular/core';

import { isInteger } from '../../util/util';
import { XmDateStruct } from '../xm-date-struct';
import { XmDateAdapter } from './xm-date-adapter';

/**
 * native javascript dates as a user date model.
 */
@Injectable()
export class XmDateNativeAdapter extends XmDateAdapter<Date> {
  /**
   * Converts a native `Date` to a `XmDateStruct`.
   */
  fromModel(date: Date): XmDateStruct {
    return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
  }

  /**
   * Converts a `XmDateStruct` to a native `Date`.
   */
  toModel(date: XmDateStruct): Date {
    return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) ? this._toNativeDate(date) :
      null;
  }

  protected _fromNativeDate(date: Date): XmDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  protected _toNativeDate(date: XmDateStruct): Date {
    const jsDate = new Date(date.year, date.month - 1, date.day, 12);
    // avoid 30 -> 1930 conversion
    jsDate.setFullYear(date.year);
    return jsDate;
  }
}
