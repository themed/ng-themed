import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { UserService } from '@services/user.service';
import { Subscription } from 'rxjs';

import { toString } from '../util/util';

/**
 * Context for the typeahead result template in case you want to override the default one
 */
export interface ResultTemplateContext {
  /**
   * Your typeahead result data model
   */
  result: any;

  /**
   * Search term from the input used to get current result
   */
  term: string;
}

@Component({
  selector: 'xm-typeahead-window',
  exportAs: 'xmTypeaheadWindow',
  templateUrl: './typeahead-window.component.html',
  styleUrls: ['./typeahead-window.component.scss']
})
export class XmTypeaheadWindowComponent implements OnInit, OnDestroy {
  activeIdx = 0;
  themeSubscription: Subscription;
  theme: string;

  @HostBinding('attr.role') role = 'listbox';
  @HostBinding('class.typeahead-menu') typeaheadMenu = true;
  @HostBinding('class.show') show = true;

  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private hostElement: ElementRef
  ) { }

  /**
   *  The id for the typeahead window. The id should be unique and the same
   *  as the associated typeahead's id.
   */
  @HostBinding('id') @Input() id: string;

  /**
   * Flag indicating if the first row should be active initially
   */
  @Input() focusFirst = true;

  /**
   * Typeahead match results to be displayed
   */
  @Input() results;

  /**
   * Search term used to get current results
   */
  @Input() term: string;

  /**
   * A function used to format a given result before display. This function should return a formatted string without any
   * HTML markup
   */
  @Input() formatter = toString;

  /**
   * A template to override a matching result default display
   */
  @Input() resultTemplate: TemplateRef<ResultTemplateContext>;

  /**
   * Event raised when user selects a particular result row
   */
  @Output() selectEvent = new EventEmitter();

  @Output() activeChangeEvent = new EventEmitter();

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    event.preventDefault();
  }

  hasActive() { return this.activeIdx > -1 && this.activeIdx < this.results.length; }

  getActive() { return this.results[this.activeIdx]; }

  markActive(activeIdx: number) {
    this.activeIdx = activeIdx;
    this._activeChanged();
  }

  next() {
    if (this.activeIdx === this.results.length - 1) {
      this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
    } else {
      this.activeIdx++;
    }
    this._activeChanged();
  }

  prev() {
    if (this.activeIdx < 0) {
      this.activeIdx = this.results.length - 1;
    } else if (this.activeIdx === 0) {
      this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
    } else {
      this.activeIdx--;
    }
    this._activeChanged();
  }

  resetActive() {
    this.activeIdx = this.focusFirst ? 0 : -1;
    this._activeChanged();
  }

  select(item) { this.selectEvent.emit(item); }

  ngOnInit() {
    this.resetActive();
    this.addThemeClass();
  }

  addThemeClass() {
    this.themeSubscription = this.userService.getPrefs().subscribe(prefs => {
      if (this.theme) {
        this.renderer.removeClass(this.hostElement.nativeElement, this.theme);
      }
      this.renderer.addClass(this.hostElement.nativeElement, prefs.theme);
      this.theme = prefs.theme;
    });
  }

  private _activeChanged() {
    this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
