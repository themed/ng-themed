import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { XmDatepickerComponent } from './datepicker';
import { XmDatepickerDayViewComponent } from './datepicker-day-view';
import { XmInputDatepickerDirective } from './datepicker-input';
import { XmDatepickerMonthViewComponent } from './datepicker-month-view';
import { XmDatepickerNavigationComponent } from './datepicker-navigation';
import { XmDatepickerNavigationSelectComponent } from './datepicker-navigation-select';

export { XmDatepickerComponent, XmDatepickerNavigateEvent } from './datepicker';
export { XmInputDatepickerDirective } from './datepicker-input';
export { XmCalendar, XmPeriod, XmCalendarGregorian } from './xm-calendar';
export { XmDatepickerMonthViewComponent } from './datepicker-month-view';
export { XmDatepickerDayViewComponent } from './datepicker-day-view';
export { XmDatepickerNavigationComponent } from './datepicker-navigation';
export { XmDatepickerNavigationSelectComponent } from './datepicker-navigation-select';
export { XmDatepickerConfig } from './datepicker-config';
export { XmDatepickerI18n } from './datepicker-i18n';
export { XmDateStruct } from './xm-date-struct';
export { XmDate } from './xm-date';
export { XmDateAdapter } from './adapters/xm-date-adapter';
export { XmDateNativeAdapter } from './adapters/xm-date-native-adapter';
export { XmDateNativeUTCAdapter } from './adapters/xm-date-native-utc-adapter';
export { XmDateParserFormatter } from './xm-date-parser-formatter';

@NgModule({
  declarations: [
    XmDatepickerComponent,
    XmDatepickerMonthViewComponent,
    XmDatepickerNavigationComponent,
    XmDatepickerNavigationSelectComponent,
    XmDatepickerDayViewComponent,
    XmInputDatepickerDirective
  ],
  exports: [XmDatepickerComponent, XmInputDatepickerDirective],
  imports: [CommonModule, FormsModule],
  entryComponents: [XmDatepickerComponent]
})
export class DatepickerModule { }
