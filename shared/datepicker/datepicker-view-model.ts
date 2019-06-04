import { DayTemplateContext } from './datepicker-day-template-context';
import { XmDate } from './xm-date';
import { XmDateStruct } from './xm-date-struct';

export type XmMarkDisabled = (date: XmDateStruct, current: { year: number, month: number }) => boolean;
export type XmDayTemplateData = (date: XmDateStruct, current: { year: number, month: number }) => any;

/* tslint:disable:interface-over-type-literal */

export type DayViewModel = {
  date: XmDate,
  context: DayTemplateContext,
  tabindex: number,
  ariaLabel: string,
  hidden: boolean
};

export type WeekViewModel = {
  number: number,
  days: DayViewModel[],
  collapsed: boolean
};

export type MonthViewModel = {
  firstDate: XmDate,
  lastDate: XmDate,
  number: number,
  year: number,
  weeks: WeekViewModel[],
  weekdays: number[]
};

// clang-format off
export type DatepickerViewModel = {
  dayTemplateData?: XmDayTemplateData,
  disabled: boolean,
  displayMonths: number,
  firstDate?: XmDate,
  firstDayOfWeek: number,
  focusDate?: XmDate,
  focusVisible: boolean,
  lastDate?: XmDate,
  markDisabled?: XmMarkDisabled,
  maxDate?: XmDate,
  minDate?: XmDate,
  months: MonthViewModel[],
  navigation: 'select' | 'arrows' | 'none',
  outsideDays: 'visible' | 'collapsed' | 'hidden',
  prevDisabled: boolean,
  nextDisabled: boolean,
  selectBoxes: {
    years: number[],
    months: number[]
  },
  selectedDate: XmDate
};
// clang-format on

export enum NavigationEvent {
  PREV,
  NEXT
}
