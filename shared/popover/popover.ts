import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Injectable,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { autoClose } from '../util/autoclose';
import { PopupService } from '../util/popup';
import { PlacementArray, positionElements } from '../util/positioning';
import { listenToTriggers } from '../util/triggers';

/**
 * Configuration service for the XmPopoverDirective.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
@Injectable({ providedIn: 'root' })
export class XmPopoverConfig {
  autoClose: boolean | 'inside' | 'outside' = true;
  placement: PlacementArray = 'auto';
  triggers = 'click';
  container: string;
  disablePopover = false;
  popoverClass: string;
  openDelay = 0;
  closeDelay = 0;
}

let nextId = 0;

@Component({
  selector: 'xm-popover-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class XmPopoverWindowComponent {
  @Input() title: undefined | string | TemplateRef<any>;
  @Input() popoverClass: string;
  @Input() context: any;

  constructor() { }

  @HostBinding('attr.role') role = 'tooltip';
  @HostBinding('id') @Input() id: string;

  @HostBinding('class') get classes() {
    return `${this.popoverClass ? this.popoverClass : ''} popover show`;
  }

  isTitleTemplate() { return this.title instanceof TemplateRef; }
}

/**
 * A lightweight, extensible directive for fancy popover creation.
 */
@Directive({ selector: '[xmPopover]', exportAs: 'xmPopover' })
export class XmPopoverDirective implements OnInit, OnDestroy, OnChanges {
  /**
   * Indicates whether the popover should be closed on Escape key and inside/outside clicks.
   *
   * - true (default): closes on both outside and inside clicks as well as Escape presses
   * - false: disables the autoClose feature (NB: triggers still apply)
   * - 'inside': closes on inside clicks as well as Escape presses
   * - 'outside': closes on outside clicks (sometimes also achievable through triggers)
   * as well as Escape presses
   *
   * @since 3.0.0
   */
  @Input() autoClose: boolean | 'inside' | 'outside';
  /**
   * Content to be displayed as popover. If title and content are empty, the popover won't open.
   */
  @Input() xmPopover: string | TemplateRef<any>;
  /**
   * Title of a popover. If title and content are empty, the popover won't open.
   */
  @Input() popoverTitle: string | TemplateRef<any>;
  /**
    * Placement of a popover accepts:
    *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
    *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom",
    *  array or a space separated string of above values
    */
  @Input() placement: PlacementArray;
  /**
   * Specifies events that should trigger. Supports a space separated list of event names.
   */
  @Input() triggers: string;
  /**
   * A selector specifying the element the popover should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;
  /**
   * A flag indicating if a given popover is disabled and should not be displayed.
   *
   * @since 1.1.0
   */
  @Input() disablePopover: boolean;
  /**
   * An optional class applied to xm-popover-window
   *
   * @since 2.2.0
   */
  @Input() popoverClass: string;
  /**
   * Opening delay in ms. Works only for non-manual opening triggers.
   *
   * @since 4.1.0
   */
  @Input() openDelay: number;
  /**
   * Closing delay in ms. Works only for non-manual closing triggers.
   *
   * @since 4.1.0
   */
  @Input() closeDelay: number;
  /**
   * Emits an event when the popover is shown
   */
  @Output() shown = new EventEmitter();
  /**
   * Emits an event when the popover is hidden
   */
  @Output() hidden = new EventEmitter();

  private _xmPopoverWindowId = `xm-popover-${nextId++}`;
  private _popupService: PopupService<XmPopoverWindowComponent>;
  private _windowRef: ComponentRef<XmPopoverWindowComponent>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;
  private _isDisabled(): boolean {
    if (this.disablePopover) {
      return true;
    }
    if (!this.xmPopover && !this.popoverTitle) {
      return true;
    }
    return false;
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2, injector: Injector,
    componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: XmPopoverConfig,
    private _ngZone: NgZone, @Inject(DOCUMENT) private _document: any, private _changeDetector: ChangeDetectorRef) {
    this.autoClose = config.autoClose;
    this.placement = config.placement;
    this.triggers = config.triggers;
    this.container = config.container;
    this.disablePopover = config.disablePopover;
    this.popoverClass = config.popoverClass;
    this.openDelay = config.openDelay;
    this.closeDelay = config.closeDelay;
    this._popupService = new PopupService<XmPopoverWindowComponent>(
      XmPopoverWindowComponent, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        positionElements(
          this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
          this.container === 'body', 'bs-popover');
      }
    });
  }

  /**
   * Opens an element’s popover. This is considered a “manual” triggering of the popover.
   * The context is an optional value to be injected into the popover template when it is created.
   */
  open(context?: any) {
    if (!this._windowRef && !this._isDisabled()) {
      this._windowRef = this._popupService.open(this.xmPopover, context);
      this._windowRef.instance.title = this.popoverTitle;
      this._windowRef.instance.context = context;
      this._windowRef.instance.popoverClass = this.popoverClass;
      this._windowRef.instance.id = this._xmPopoverWindowId;

      this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._xmPopoverWindowId);

      if (this.container === 'body') {
        this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
      }

      // apply styling to set basic css-classes on target element, before going for positioning
      this._windowRef.changeDetectorRef.markForCheck();

      autoClose(
        this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden,
        [this._windowRef.location.nativeElement]);
      this.shown.emit();
    }
  }

  /**
   * Closes an element’s popover. This is considered a “manual” triggering of the popover.
   */
  close(): void {
    if (this._windowRef) {
      this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
      this._popupService.close();
      this._windowRef = null;
      this.hidden.emit();
      this._changeDetector.markForCheck();
    }
  }

  /**
   * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
   */
  toggle(): void {
    if (this._windowRef) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Returns whether or not the popover is currently being shown
   */
  isOpen(): boolean { return this._windowRef != null; }

  ngOnInit() {
    this._unregisterListenersFn = listenToTriggers(
      this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this),
      this.close.bind(this), +this.openDelay, +this.closeDelay);
  }

  ngOnChanges(changes: SimpleChanges) {
    // close popover if title and content become empty, or disablePopover set to true
    if ((changes['xmPopover'] || changes['popoverTitle'] || changes['disablePopover']) && this._isDisabled()) {
      this.close();
    }
  }

  ngOnDestroy() {
    this.close();
    // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
    // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
    if (this._unregisterListenersFn) {
      this._unregisterListenersFn();
    }
    this._zoneSubscription.unsubscribe();
  }
}
