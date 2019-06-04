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
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { autoClose } from '../util/autoclose';
import { PopupService } from '../util/popup';
import { PlacementArray, positionElements } from '../util/positioning';
import { listenToTriggers } from '../util/triggers';

/**
 * Configuration service for the XmTooltip directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
@Injectable({ providedIn: 'root' })
export class XmTooltipConfig {
  autoClose: boolean | 'inside' | 'outside' = true;
  placement: PlacementArray = 'auto';
  triggers = 'hover focus';
  container: string;
  disableTooltip = false;
  tooltipClass: string;
  openDelay = 0;
  closeDelay = 0;
}

let nextId = 0;

@Component({
  selector: 'xm-tooltip-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class XmTooltipWindowComponent {
  @Input() tooltipClass: string;

  @HostBinding('attr.role') role = 'tooltip';
  @HostBinding('id') @Input() id: string;

  @HostBinding('class') get classes() {
    return `${this.tooltipClass ? this.tooltipClass : ''} tooltip show`;
  }

  constructor() { }
}

/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
@Directive({ selector: '[xmTooltip]', exportAs: 'xmTooltip' })
export class XmTooltipDirective implements OnInit, OnDestroy {
  /**
   * Indicates whether the tooltip should be closed on Escape key and inside/outside clicks.
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
    * Placement of a tooltip accepts:
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
   * A selector specifying the element the tooltip should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;
  /**
   * A flag indicating if a given tooltip is disabled and should not be displayed.
   *
   * @since 1.1.0
   */
  @Input() disableTooltip: boolean;
  /**
   * An optional class applied to xm-tooltip-window
   *
   * @since 3.2.0
   */
  @Input() tooltipClass: string;
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
   * Emits an event when the tooltip is shown
   */
  @Output() shown = new EventEmitter();
  /**
   * Emits an event when the tooltip is hidden
   */
  @Output() hidden = new EventEmitter();

  private _xmTooltip: string | TemplateRef<any>;
  private _xmTooltipWindowId = `xm-tooltip-${nextId++}`;
  private _popupService: PopupService<XmTooltipWindowComponent>;
  private _windowRef: ComponentRef<XmTooltipWindowComponent>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;

  constructor(
    private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2, injector: Injector,
    componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: XmTooltipConfig,
    private _ngZone: NgZone, @Inject(DOCUMENT) private _document: any, private _changeDetector: ChangeDetectorRef) {
    this.autoClose = config.autoClose;
    this.placement = config.placement;
    this.triggers = config.triggers;
    this.container = config.container;
    this.disableTooltip = config.disableTooltip;
    this.tooltipClass = config.tooltipClass;
    this.openDelay = config.openDelay;
    this.closeDelay = config.closeDelay;
    this._popupService = new PopupService<XmTooltipWindowComponent>(
      XmTooltipWindowComponent, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = _ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        positionElements(
          this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
          this.container === 'body', 'bs-tooltip');
      }
    });
  }

  /**
   * Content to be displayed as tooltip. If falsy, the tooltip won't open.
   */
  @Input()
  set xmTooltip(value: string | TemplateRef<any>) {
    this._xmTooltip = value;
    if (!value && this._windowRef) {
      this.close();
    }
  }

  get xmTooltip() { return this._xmTooltip; }

  /**
   * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   * The context is an optional value to be injected into the tooltip template when it is created.
   */
  open(context?: any) {
    if (!this._windowRef && this._xmTooltip && !this.disableTooltip) {
      this._windowRef = this._popupService.open(this._xmTooltip, context);
      this._windowRef.instance.tooltipClass = this.tooltipClass;
      this._windowRef.instance.id = this._xmTooltipWindowId;

      this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._xmTooltipWindowId);

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
   * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   */
  close(): void {
    if (this._windowRef != null) {
      this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
      this._popupService.close();
      this._windowRef = null;
      this.hidden.emit();
      this._changeDetector.markForCheck();
    }
  }

  /**
   * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   */
  toggle(): void {
    if (this._windowRef) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Returns whether or not the tooltip is currently being shown
   */
  isOpen(): boolean { return this._windowRef != null; }

  ngOnInit() {
    this._unregisterListenersFn = listenToTriggers(
      this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this),
      this.close.bind(this), +this.openDelay, +this.closeDelay);
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
