import { Injectable } from '@angular/core';

import { isNumber, padNumber, toInteger } from '../util/util';
import { XmDateStruct } from './xm-date-struct';

export function XM_DATEPICKER_PARSER_FORMATTER_FACTORY() {
  return new XmDateISOParserFormatter();
}

/**
 * An abstract service for parsing and formatting dates for the
 * Converts between the internal `XmDateStruct` model presentation and a `string` that is displayed in the
 * input element.
 *
 * When user types something in the input this service attempts to parse it into a `XmDateStruct` object.
 * And vice versa, when users selects a date in the calendar with the mouse, it must be displayed as a `string`
 * in the input.
 *
 * Default implementation uses the ISO 8601 format, but you can provide another implementation via DI
 * to use an alternative string format or a custom parsing logic.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 */
@Injectable({ providedIn: 'root', useFactory: XM_DATEPICKER_PARSER_FORMATTER_FACTORY })
export abstract class XmDateParserFormatter {
  /**
   * Parses the given `string` to an `XmDateStruct`.
   *
   * Implementations should try their best to provide a result, even
   * partial. They must return `null` if the value can't be parsed.
   */
  abstract parse(value: string): XmDateStruct;

  /**
   * Formats the given `XmDateStruct` to a `string`.
   *
   * Implementations should return an empty string if the given date is `null`,
   * and try their best to provide a partial result if the given date is incomplete or invalid.
   */
  abstract format(date: XmDateStruct): string;
}

@Injectable()
export class XmDateISOParserFormatter extends XmDateParserFormatter {
  parse(value: string): XmDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { year: toInteger(dateParts[0]), month: null, day: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
      }
    }
    return null;
  }

  format(date: XmDateStruct): string {
    return date ?
      `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
      '';
  }
}
