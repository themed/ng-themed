import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';

import { PlacementArray } from '../util/positioning';
import { XmTypeaheadConfig } from './typeahead';
import { ResultTemplateContext } from './typeahead-window.component';

/**
 * Payload of the selectItem event.
 */
export interface XmTypeaheadSelectItemEvent {
  /**
   * An item about to be selected
   */
  item: any;
  /**
   * Function that will prevent item selection if called
   */
  preventDefault: () => void;
}
/**
 * XmTypeahead directive provides a simple way of creating powerful typeaheads from any text input
 */
export declare class XmTypeahead implements ControlValueAccessor, OnInit, OnDestroy {
  private _elementRef;
  private _viewContainerRef;
  private _renderer;
  private _injector;
  private _live;
  private _document;
  private _ngZone;
  private _changeDetector;
  private _popupService;
  private _subscription;
  private _closed$;
  private _inputValueBackup;
  private _valueChanges;
  private _resubscribeTypeahead;
  private _windowRef;
  private _zoneSubscription;
  /**
   * Value for the configurable autocomplete attribute.
   * Defaults to 'off' to disable the native browser autocomplete, but this standard value does not seem
   * to be always correctly taken into account.
   *
   * @since 2.1.0
   */
  autocomplete: string;
  /**
   * A selector specifying the element the tooltip should be appended to.
   * Currently only supports "body".
   */
  container: string;
  /**
   * A flag indicating if model values should be restricted to the ones selected from the popup only.
   */
  editable: boolean;
  /**
   * A flag indicating if the first match should automatically be focused as you type.
   */
  focusFirst: boolean;
  /**
   * A function to convert a given value into string to display in the input field
   */
  inputFormatter: (value: any) => string;
  /**
   * A function to transform the provided observable text into the array of results.  Note that the "this" argument
   * is undefined so you need to explicitly bind it to a desired "this" target.
   */
  XmTypeahead: (text: Observable<string>) => Observable<any[]>;
  /**
   * A function to format a given result before display. This function should return a formatted string without any
   * HTML markup
   */
  resultFormatter: (value: any) => string;
  /**
   * A template to override a matching result default display
   */
  resultTemplate: TemplateRef<ResultTemplateContext>;
  /**
   * Show hint when an option in the result list matches.
   */
  showHint: boolean;
  /** Placement of a typeahead accepts:
   *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
   *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
   * and array of above values.
  */
  placement: PlacementArray;
  /**
   * An event emitted when a match is selected. Event payload is of type XmTypeaheadSelectItemEvent.
   */
  selectItem: EventEmitter<XmTypeaheadSelectItemEvent>;
  activeDescendant: string;
  popupId: string;
  private _onTouched;
  private _onChange;
  private _openPopup;
  private _closePopup;
  private _selectResult;
  private _selectResultClosePopup;
  private _showHint;
  private _formatItemForInput;
  private _writeInputValue;
  private _subscribeToUserInput;
  private _unsubscribeFromUserInput;
  constructor(
    _elementRef: ElementRef<HTMLInputElement>,
    _viewContainerRef: ViewContainerRef,
    _renderer: Renderer2, _injector: Injector,
    componentFactoryResolver: ComponentFactoryResolver,
    config: XmTypeaheadConfig,
    ngZone: NgZone,
    _document: any,
    _ngZone: NgZone,
    _changeDetector: ChangeDetectorRef
  );
  ngOnInit(): void;
  ngOnDestroy(): void;
  registerOnChange(fn: (value: any) => any): void;
  registerOnTouched(fn: () => any): void;
  writeValue(value: any): void;
  setDisabledState(isDisabled: boolean): void;
  /**
   * Dismisses typeahead popup window
   */
  dismissPopup(): void;
  /**
   * Returns true if the typeahead popup window is displayed
   */
  isPopupOpen(): boolean;
  handleBlur(): void;
  handleKeyDown(event: KeyboardEvent): void;
}
