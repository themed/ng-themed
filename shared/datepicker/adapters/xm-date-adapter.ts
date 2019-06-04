import { Injectable } from '@angular/core';

import { isInteger } from '../../util/util';
import { XmDateStruct } from '../xm-date-struct';

export function XM_DATEPICKER_DATE_ADAPTER_FACTORY() {
  return new XmDateStructAdapter();
}

/**
 * An abstract service that does the conversion between the internal datepicker `XmDateStruct` model and
 * any provided user date model `D`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding datepicker to a form control,
 * ex. `[(ngModel)]="userDateModel"`. Here `userDateModel` can be of any type.
 *
 * The default datepicker implementation assumes we use `XmDateStruct` as a user model.
 *
 */
@Injectable({ providedIn: 'root', useFactory: XM_DATEPICKER_DATE_ADAPTER_FACTORY })
export abstract class XmDateAdapter<D> {
  /**
   * Converts a user-model date of type `D` to an `XmDateStruct` for internal use.
   */
  abstract fromModel(value: D): XmDateStruct;

  /**
   * Converts an internal `XmDateStruct` date to a user-model date of type `D`.
   */
  abstract toModel(date: XmDateStruct): D;
}

@Injectable()
export class XmDateStructAdapter extends XmDateAdapter<XmDateStruct> {
  /**
   * Converts a XmDateStruct value into XmDateStruct value
   */
  fromModel(date: XmDateStruct): XmDateStruct {
    return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
      { year: date.year, month: date.month, day: date.day } :
      null;
  }

  /**
   * Converts a XmDateStruct value into XmDateStruct value
   */
  toModel(date: XmDateStruct): XmDateStruct {
    return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
      { year: date.year, month: date.month, day: date.day } :
      null;
  }
}
