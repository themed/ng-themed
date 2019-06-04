import { Injectable } from '@angular/core';

import { Key } from '../util/key';
import { XmDatepickerService } from './datepicker-service';
import { XmCalendar } from './xm-calendar';
import { XmDate } from './xm-date';

@Injectable()
export class XmDatepickerKeyMapService {
  private _minDate: XmDate;
  private _maxDate: XmDate;
  private _firstViewDate: XmDate;
  private _lastViewDate: XmDate;

  constructor(private _service: XmDatepickerService, private _calendar: XmCalendar) {
    _service.model$.subscribe(model => {
      this._minDate = model.minDate;
      this._maxDate = model.maxDate;
      this._firstViewDate = model.firstDate;
      this._lastViewDate = model.lastDate;
    });
  }

  processKey(event: KeyboardEvent) {
    // tslint:disable-next-line:deprecation
    switch (event.which) {
      case Key.PageUp:
        this._service.focusMove(event.shiftKey ? 'y' : 'm', -1);
        break;
      case Key.PageDown:
        this._service.focusMove(event.shiftKey ? 'y' : 'm', 1);
        break;
      case Key.End:
        this._service.focus(event.shiftKey ? this._maxDate : this._lastViewDate);
        break;
      case Key.Home:
        this._service.focus(event.shiftKey ? this._minDate : this._firstViewDate);
        break;
      case Key.ArrowLeft:
        this._service.focusMove('d', -1);
        break;
      case Key.ArrowUp:
        this._service.focusMove('d', -this._calendar.getDaysPerWeek());
        break;
      case Key.ArrowRight:
        this._service.focusMove('d', 1);
        break;
      case Key.ArrowDown:
        this._service.focusMove('d', this._calendar.getDaysPerWeek());
        break;
      case Key.Enter:
      case Key.Space:
        this._service.focusSelect();
        break;
      default:
        return;
    }

    // note 'return' in default case
    event.preventDefault();
    event.stopPropagation();
  }
}
