import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { Subject } from 'rxjs';

import { autoClose } from '../util/autoclose';
import { focusTrap } from '../util/focus-trap';
import { PlacementArray, positionElements } from '../util/positioning';
import { XmDateAdapter } from './adapters/xm-date-adapter';
import { XmDatepickerComponent, XmDatepickerNavigateEvent } from './datepicker';
import { DayTemplateContext } from './datepicker-day-template-context';
import { XmDatepickerService } from './datepicker-service';
import { XmCalendar } from './xm-calendar';
import { XmDate } from './xm-date';
import { XmDateParserFormatter } from './xm-date-parser-formatter';
import { XmDateStruct } from './xm-date-struct';

const XM_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => XmInputDatepickerDirective),
  multi: true
};

const XM_DATEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => XmInputDatepickerDirective),
  multi: true
};

/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
@Directive({
  selector: 'input[xmDatepicker]',
  exportAs: 'xmDatepicker',
  providers: [XM_DATEPICKER_VALUE_ACCESSOR, XM_DATEPICKER_VALIDATOR, XmDatepickerService]
})
export class XmInputDatepickerDirective implements OnChanges,
  OnDestroy, ControlValueAccessor, Validator {
  private _closed$ = new Subject();
  private _cRef: ComponentRef<XmDatepickerComponent> = null;
  private _model: XmDate;
  private _inputValue: string;
  private _zoneSubscription: any;

  @HostBinding('disabled') private _disabled = false;

  /**
   * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
   *
   * * `true` - the popup will close on both date selection and outside click.
   * * `false` - the popup can only be closed manually via `close()` or `toggle()` methods.
   * * `"inside"` - the popup will close on date selection, but not outside clicks.
   * * `"outside"` - the popup will close only on the outside click and not on date selection/inside clicks.
   *
   * @since 3.0.0
   */
  @Input() autoClose: boolean | 'inside' | 'outside' = true;

  /**
   * The reference to a custom template for the day.
   *
   * Allows to completely override the way a day 'cell' in the calendar is displayed.
   *
   * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
   */
  @Input() dayTemplate: TemplateRef<DayTemplateContext>;

  /**
   * The callback to pass any arbitrary data to the template cell via the
   * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
   *
   * `current` is the month that is currently displayed by the datepicker.
   *
   * @since 3.3.0
   */
  @Input() dayTemplateData: (date: XmDate, current: { year: number, month: number }) => any;

  /**
   * The number of months to display.
   */
  @Input() displayMonths: number;

  /**
   * The first day of the week.
   *
   * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
   */
  @Input() firstDayOfWeek: number;

  /**
   * The reference to the custom template for the datepicker footer.
   *
   * @since 3.3.0
   */
  @Input() footerTemplate: TemplateRef<any>;

  /**
   * The callback to mark some dates as disabled.
   *
   * It is called for each new date when navigating to a different month.
   *
   * `current` is the month that is currently displayed by the datepicker.
   */
  @Input() markDisabled: (date: XmDate, current: { year: number, month: number }) => boolean;

  /**
   * The earliest date that can be displayed or selected. Also used for form validation.
   *
   * If not provided, 'year' select box will display 10 years before the current month.
   */
  @Input() minDate: XmDateStruct;

  /**
   * The latest date that can be displayed or selected. Also used for form validation.
   *
   * If not provided, 'year' select box will display 10 years after the current month.
   */
  @Input() maxDate: XmDateStruct;

  /**
   * Navigation type.
   *
   * * `"select"` - select boxes for month and navigation arrows
   * * `"arrows"` - only navigation arrows
   * * `"none"` - no navigation visible at all
   */
  @Input() navigation: 'select' | 'arrows' | 'none';

  /**
   * The way of displaying days that don't belong to the current month.
   *
   * * `"visible"` - days are visible
   * * `"hidden"` - days are hidden, white space preserved
   * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
   *
   * For the 2+ months view, days in between months are never shown.
   */
  @Input() outsideDays: 'visible' | 'collapsed' | 'hidden';

  /**
   * The preferred placement of the datepicker popup.
   *
   * Possible values are `"top"`, `"top-left"`, `"top-right"`, `"bottom"`, `"bottom-left"`,
   * `"bottom-right"`, `"left"`, `"left-top"`, `"left-bottom"`, `"right"`, `"right-top"`,
   * `"right-bottom"`
   *
   * Accepts an array of strings or a string with space separated possible values.
   *
   * The default order of preference is `"bottom-left bottom-right top-left top-right"`
   */
  @Input() placement: PlacementArray = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];

  /**
   * If `true`, weekdays will be displayed.
   */
  @Input() showWeekdays: boolean;

  /**
   * If `true`, week numbers will be displayed.
   */
  @Input() showWeekNumbers: boolean;

  /**
   * The date to open calendar with.
   *
   * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   * If nothing or invalid date is provided, calendar will open with current month.
   *
   * You could use `navigateTo(date)` method as an alternative.
   */
  @Input() startDate: { year: number, month: number, day?: number };

  /**
   * A selector specifying the element the datepicker popup should be appended to.
   *
   * Currently only supports `"body"`.
   */
  @Input() container: string;

  /**
   * An event emitted when user selects a date using keyboard or mouse.
   *
   * The payload of the event is currently selected `XmDate`.
   *
   * @since 1.1.1
   */
  @Output() dateSelect = new EventEmitter<XmDate>();

  /**
   * Event emitted right after the navigation happens and displayed month changes.
   *
   */
  @Output() navigate = new EventEmitter<XmDatepickerNavigateEvent>();

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = value === '' || (value && value !== 'false');

    if (this.isOpen()) {
      this._cRef.instance.setDisabledState(this._disabled);
    }
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => { };
  private _validatorChange = () => { };

  @HostListener('input', ['$event']) input(event) { this.manualDateChange(event.target.value); }
  @HostListener('change', ['$event']) change(event) { this.manualDateChange(event.target.value, true); }
  @HostListener('blur', ['$event']) blur(event) { this.onBlur(); }

  constructor(
    private _parserFormatter: XmDateParserFormatter, private _elRef: ElementRef<HTMLInputElement>,
    private _vcRef: ViewContainerRef, private _renderer: Renderer2, private _cfr: ComponentFactoryResolver,
    private _ngZone: NgZone, private _service: XmDatepickerService, private _calendar: XmCalendar,
    private _dateAdapter: XmDateAdapter<any>, @Inject(DOCUMENT) private _document: any,
    private _changeDetector: ChangeDetectorRef) {
    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      if (this._cRef) {
        positionElements(
          this._elRef.nativeElement, this._cRef.location.nativeElement, this.placement, this.container === 'body');
      }
    });
  }

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }

  registerOnTouched(fn: () => any): void { this._onTouched = fn; }

  registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  validate(c: AbstractControl): { [key: string]: any } {
    const value = c.value;

    if (value === null || value === undefined) {
      return null;
    }

    const xmDate = this._fromDateStruct(this._dateAdapter.fromModel(value));

    if (!this._calendar.isValid(xmDate)) {
      return { 'xmDate': { invalid: c.value } };
    }

    if (this.minDate && xmDate.before(XmDate.from(this.minDate))) {
      return { 'xmDate': { requiredBefore: this.minDate } };
    }

    if (this.maxDate && xmDate.after(XmDate.from(this.maxDate))) {
      return { 'xmDate': { requiredAfter: this.maxDate } };
    }
  }

  writeValue(value) {
    this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
    this._writeModelValue(this._model);
  }

  manualDateChange(value: string, updateView = false) {
    const inputValueChanged = value !== this._inputValue;
    if (inputValueChanged) {
      this._inputValue = value;
      this._model = this._fromDateStruct(this._parserFormatter.parse(value));
    }
    if (inputValueChanged || !updateView) {
      this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
    }
    if (updateView && this._model) {
      this._writeModelValue(this._model);
    }
  }

  isOpen() { return !!this._cRef; }

  /**
   * Opens the datepicker popup.
   *
   * If the related form control contains a valid date, the corresponding month will be opened.
   */
  open() {
    if (!this.isOpen()) {
      const cf = this._cfr.resolveComponentFactory(XmDatepickerComponent);
      this._cRef = this._vcRef.createComponent(cf);

      this._applyPopupStyling(this._cRef.location.nativeElement);
      this._applyDatepickerInputs(this._cRef.instance);
      this._subscribeForDatepickerOutputs(this._cRef.instance);
      this._cRef.instance.ngOnInit();
      this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));

      // date selection event handling
      this._cRef.instance.registerOnChange((selectedDate) => {
        this.writeValue(selectedDate);
        this._onChange(selectedDate);
        this._onTouched();
      });

      this._cRef.changeDetectorRef.detectChanges();

      this._cRef.instance.setDisabledState(this.disabled);

      if (this.container === 'body') {
        window.document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
      }

      // focus handling
      focusTrap(this._cRef.location.nativeElement, this._closed$, true);
      this._cRef.instance.focus();

      autoClose(
        this._ngZone, this._document, this.autoClose, () => this.close(), this._closed$, [],
        [this._elRef.nativeElement, this._cRef.location.nativeElement]);
    }
  }

  /**
   * Closes the datepicker popup.
   */
  close() {
    if (this.isOpen()) {
      this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
      this._cRef = null;
      this._closed$.next();
      this._changeDetector.markForCheck();
    }
  }

  /**
   * Toggles the datepicker popup.
   */
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Navigates to the provided date.
   *
   * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   * If nothing or invalid date provided calendar will open current month.
   *
   * Use the `[startDate]` input as an alternative.
   */
  navigateTo(date?: { year: number, month: number, day?: number }) {
    if (this.isOpen()) {
      this._cRef.instance.navigateTo(date);
    }
  }

  onBlur() { this._onTouched(); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['minDate'] || changes['maxDate']) {
      this._validatorChange();
    }
  }

  ngOnDestroy() {
    this.close();
    this._zoneSubscription.unsubscribe();
  }

  private _applyDatepickerInputs(datepickerInstance: XmDatepickerComponent): void {
    ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
      'maxDate', 'navigation', 'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
      .forEach((optionName: string) => {
        if (this[optionName] !== undefined) {
          datepickerInstance[optionName] = this[optionName];
        }
      });
    datepickerInstance.startDate = this.startDate || this._model;
  }

  private _applyPopupStyling(nativeElement: any) {
    this._renderer.addClass(nativeElement, 'datepicker-dropdown');
    this._renderer.setStyle(nativeElement, 'padding', '0');
    this._renderer.addClass(nativeElement, 'show');
  }

  private _subscribeForDatepickerOutputs(datepickerInstance: XmDatepickerComponent) {
    datepickerInstance.navigate.subscribe(navigateEvent => this.navigate.emit(navigateEvent));
    datepickerInstance.select.subscribe(date => {
      this.dateSelect.emit(date);
      if (this.autoClose === true || this.autoClose === 'inside') {
        this.close();
      }
    });
  }

  private _writeModelValue(model: XmDate) {
    const value = this._parserFormatter.format(model);
    this._inputValue = value;
    this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
    if (this.isOpen()) {
      this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
      this._onTouched();
    }
  }

  private _fromDateStruct(date: XmDateStruct): XmDate {
    const xmDate = date ? new XmDate(date.year, date.month, date.day) : null;
    return this._calendar.isValid(xmDate) ? xmDate : null;
  }
}
