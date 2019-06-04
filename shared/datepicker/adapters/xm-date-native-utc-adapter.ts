import { Injectable } from '@angular/core';

import { XmDateStruct } from '../xm-date-struct';
import { XmDateNativeAdapter } from './xm-date-native-adapter';

@Injectable()
export class XmDateNativeUTCAdapter extends XmDateNativeAdapter {
  protected _fromNativeDate(date: Date): XmDateStruct {
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
  }

  protected _toNativeDate(date: XmDateStruct): Date {
    const jsDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
    // avoid 30 -> 1930 conversion
    jsDate.setUTCFullYear(date.year);
    return jsDate;
  }
}
