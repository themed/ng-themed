import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Injectable,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { UserService } from '@services/user.service';
import { Subject, Subscription } from 'rxjs';

import { autoClose } from '../util/autoclose';
import { Placement, PlacementArray, positionElements } from '../util/positioning';

/**
 * Configuration service for the XmDropdown directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
@Injectable({ providedIn: 'root' })
export class XmDropdownConfig {
  autoClose: boolean | 'outside' | 'inside' = true;
  placement: PlacementArray = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
  container: null | 'body';
}

/**
 * A directive you should put put on a dropdown item of a menu.
 *
 * @since 4.1.0
 */
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: '[xmDropdownItem]',
})
export class XmDropdownItemDirective {
  private _disabled = false;

  @HostBinding('class.dropdown-item') dropdownItem = true;
  @HostBinding('class.disabled') get classDisabled() { return this._disabled; }

  @Input()
  set disabled(value: boolean) {
    this._disabled = <any>value === '' || value === true;  // accept an empty attribute as true
  }

  get disabled(): boolean { return this._disabled; }

  constructor(public elementRef: ElementRef<HTMLElement>) { }
}

/**
 */
@Component({
  selector: 'xm-dropdown-menu',
  exportAs: 'xmDropdownMenu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class XmDropdownMenuComponent implements AfterContentInit, OnDestroy {
  placement: Placement = 'bottom';
  isOpen = false;
  themeSub: Subscription;
  currentTheme: string;

  @HostBinding('class.show') get show() { return this.dropdown.isOpen(); }
  @HostBinding('attr.x-placement') get xPlacement() { return this.placement; }
  @HostBinding('class') get classes() {
    return `${this.currentTheme} dropdown-menu`;
  }

  @ContentChildren(XmDropdownItemDirective) menuItems: QueryList<XmDropdownItemDirective>;

  constructor(
    /* tslint:disable-next-line:no-use-before-declare */
    @Inject(forwardRef(() => XmDropdownComponent)) public dropdown,
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2, private userService: UserService) { }

  ngAfterContentInit(): void {
    this.themeSub = this.userService.getPrefs().subscribe(prefs => {
      this.currentTheme = prefs.theme;
    });
  }

  getNativeElement() { return this.elementRef.nativeElement; }

  position(triggerEl, placement) {
    this.applyPlacement(positionElements(triggerEl, this.elementRef.nativeElement, placement));
  }

  applyPlacement(placement: Placement) {
    // remove the current placement classes
    this.renderer.removeClass(this.elementRef.nativeElement.parentNode, 'dropup');
    this.renderer.removeClass(this.elementRef.nativeElement.parentNode, 'dropdown');
    this.placement = placement;
    /**
     * apply the new placement
     * in case of top use up-arrow or down-arrow otherwise
     */
    if (placement.search('^top') !== -1) {
      this.renderer.addClass(this.elementRef.nativeElement.parentNode, 'dropup');
    } else {
      this.renderer.addClass(this.elementRef.nativeElement.parentNode, 'dropdown');
    }
  }

  ngOnDestroy() {
    this.themeSub.unsubscribe();
  }
}

/**
 * Marks an element to which dropdown menu will be anchored. This is a simple version
 * of the XmDropdownToggle directive. It plays the same role as XmDropdownToggle but
 * doesn't listen to click events to toggle dropdown menu thus enabling support for
 * events other than click.
 *
 * @since 1.1.0
 */
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: '[xmDropdownAnchor]',
})
export class XmDropdownAnchorDirective {
  anchorEl;

  @HostBinding('attr.aria-haspopup') ariaHaspopup = true;
  @HostBinding('attr.aria-expanded') get ariaExpanded() { return this.dropdown.isOpen(); }

  constructor(
    /* tslint:disable-next-line:no-use-before-declare */
    @Inject(forwardRef(() => XmDropdownComponent)) public dropdown,
    private _elementRef: ElementRef<HTMLElement>) {
    this.anchorEl = _elementRef.nativeElement;
  }

  getNativeElement() { return this._elementRef.nativeElement; }
}

/**
 * Allows the dropdown to be toggled via click. This directive is optional: you can use XmDropdownAnchor as an
 * alternative.
 */
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: '[xmDropdownToggle]',
  providers: [{ provide: XmDropdownAnchorDirective, useExisting: forwardRef(() => XmDropdownToggleDirective) }]
})
export class XmDropdownToggleDirective extends XmDropdownAnchorDirective {

  @HostBinding('attr.aria-haspopup') ariaHaspopup = true;
  @HostBinding('attr.aria-expanded') get ariaExpanded() { return this.dropdown.isOpen(); }
  @HostListener('click') onClick() { this.toggleOpen(); }

  constructor(
    /* tslint:disable-next-line:no-use-before-declare */
    @Inject(forwardRef(() => XmDropdownComponent)) public dropdown,
    elementRef: ElementRef<HTMLElement>) {
    super(dropdown, elementRef);
  }

  toggleOpen() { this.dropdown.toggle(); }
}

/**
 * Transforms a node into a dropdown.
 */
@Component({
  selector: 'xm-dropdown',
  exportAs: 'xmDropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class XmDropdownComponent implements OnInit, OnDestroy, OnChanges {
  private _closed$ = new Subject<void>();
  private _zoneSubscription: Subscription;
  private _bodyContainer: HTMLElement;

  @HostBinding('class.show') get show() {
    return this.isOpen();
  }

  @ContentChild(XmDropdownMenuComponent) private _menu: XmDropdownMenuComponent;
  @ContentChild(XmDropdownMenuComponent, { read: ElementRef }) private _menuElement: ElementRef;

  @ContentChild(XmDropdownAnchorDirective) private _anchor: XmDropdownAnchorDirective;

  /**
   * Indicates that dropdown should be closed when selecting one of dropdown items (click) or pressing ESC.
   * When it is true (default) dropdowns are automatically closed on both outside and inside (menu) clicks.
   * When it is false dropdowns are never automatically closed.
   * When it is 'outside' dropdowns are automatically closed on outside clicks but not on menu clicks.
   * When it is 'inside' dropdowns are automatically on menu clicks but not on outside clicks.
   */
  @Input() autoClose: boolean | 'outside' | 'inside';

  /**
   *  Defines whether or not the dropdown-menu is open initially.
   */
  @Input() _open = false;

  /**
   * Placement of a popover accepts:
   *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
   *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
   *  array or a space separated string of above values
   */
  @Input() placement: PlacementArray;

  /**
   * A selector specifying the element the dropdown should be appended to.
   * Currently only supports "body".
   *
   * @since 4.1.0
   */
  @Input() container: null | 'body';

  /**
   *  An event fired when the dropdown is opened or closed.
   *  Event's payload equals whether dropdown is open.
   */
  @Output() openChange = new EventEmitter();

  constructor(
    private _changeDetector: ChangeDetectorRef, config: XmDropdownConfig, @Inject(DOCUMENT) private _document: any,
    private _ngZone: NgZone, private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2) {
    this.placement = config.placement;
    this.container = config.container;
    this.autoClose = config.autoClose;
    this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positionMenu(); });
  }

  ngOnInit() {
    this._applyPlacementClasses();
    if (this._open) {
      this._setCloseHandlers();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.container && this._open) {
      this._applyContainer(this.container);
    }

    if (changes.placement && !changes.placement.isFirstChange) {
      this._applyPlacementClasses();
    }
  }

  /**
   * Checks if the dropdown menu is open or not.
   */
  isOpen(): boolean { return this._open; }

  /**
   * Opens the dropdown menu of a given navbar or tabbed navigation.
   */
  open(): void {
    if (!this._open) {
      this._open = true;
      this._applyContainer(this.container);
      this._positionMenu();
      this.openChange.emit(true);
      this._setCloseHandlers();
    }
  }

  private _setCloseHandlers() {
    autoClose(
      this._ngZone, this._document, this.autoClose, () => this.close(), this._closed$,
      this._menu ? [this._menu.getNativeElement()] : [], this._anchor ? [this._anchor.getNativeElement()] : []);
  }

  /**
   * Closes the dropdown menu of a given navbar or tabbed navigation.
   */
  close(): void {
    if (this._open) {
      this._open = false;
      this._resetContainer();
      this._closed$.next();
      this.openChange.emit(false);
      this._changeDetector.markForCheck();
    }
  }

  /**
   * Toggles the dropdown menu of a given navbar or tabbed navigation.
   */
  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  ngOnDestroy() {
    this._resetContainer();

    this._closed$.next();
    this._zoneSubscription.unsubscribe();
  }

  private _positionMenu() {
    if (this.isOpen() && this._menu) {
      this._applyPlacementClasses(
        positionElements(
          this._anchor.anchorEl, this._bodyContainer || this._menuElement.nativeElement, this.placement,
          this.container === 'body'));
    }
  }

  private _resetContainer() {
    const renderer = this._renderer;
    if (this._menuElement) {
      const dropdownElement = this._elementRef.nativeElement;
      const dropdownMenuElement = this._menuElement.nativeElement;

      renderer.appendChild(dropdownElement, dropdownMenuElement);
      renderer.removeStyle(dropdownMenuElement, 'position');
      renderer.removeStyle(dropdownMenuElement, 'transform');
    }
    if (this._bodyContainer) {
      renderer.removeChild(this._document.body, this._bodyContainer);
      this._bodyContainer = null;
    }
  }

  private _applyContainer(container: null | 'body' = null) {
    this._resetContainer();
    if (container === 'body') {
      const renderer = this._renderer;
      const dropdownMenuElement = this._menuElement.nativeElement;
      const bodyContainer = this._bodyContainer = this._bodyContainer || renderer.createElement('div');

      // Override some styles to have the positionning working
      renderer.setStyle(bodyContainer, 'position', 'absolute');
      renderer.setStyle(dropdownMenuElement, 'position', 'static');

      renderer.appendChild(bodyContainer, dropdownMenuElement);
      renderer.appendChild(this._document.body, bodyContainer);
    }
  }

  private _applyPlacementClasses(placement?: Placement) {
    if (this._menu) {
      if (!placement) {
        placement = Array.isArray(this.placement) ? this.placement[0] : this.placement as Placement;
      }

      const renderer = this._renderer;
      const dropdownElement = this._elementRef.nativeElement;

      // remove the current placement classes
      renderer.removeClass(dropdownElement, 'dropup');
      renderer.removeClass(dropdownElement, 'dropdown');
      this.placement = placement;
      this._menu.placement = placement;

      /*
      * apply the new placement
      * in case of top use up-arrow or down-arrow otherwise
      */
      const dropdownClass = placement.search('^top') !== -1 ? 'dropup' : 'dropdown';
      renderer.addClass(dropdownElement, dropdownClass);

      const bodyContainer = this._bodyContainer;
      if (bodyContainer) {
        renderer.removeClass(bodyContainer, 'dropup');
        renderer.removeClass(bodyContainer, 'dropdown');
        renderer.addClass(bodyContainer, dropdownClass);
      }
    }
  }
}
