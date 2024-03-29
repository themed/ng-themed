/**
 * An interface of the date model used by the datepicker.
 *
 * All datepicker APIs consume `XmDateStruct`, but return `XmDate`.
 *
 */
export interface XmDateStruct {
  /**
   * The year, for example 2016
   */
  year: number;

  /**
   * The month, for example 1=Jan ... 12=Dec
   */
  month: number;

  /**
   * The day of month, starting at 1
   */
  day: number;
}
