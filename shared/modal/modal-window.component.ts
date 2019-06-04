import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UserService } from '@services/user.service';
import { Subscription } from 'rxjs';

import { getFocusableBoundaryElements } from '../util/focus-trap';
import { ModalDismissReasons } from './modal-dismiss-reasons';

@Component({
  selector: 'xm-modal-window',
  template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>`,
  styleUrls: ['./modal-window.component.scss']
})
export class XmModalWindowComponent implements OnInit, AfterContentInit,
  AfterViewInit, OnDestroy {
  private _elWithFocus: Element;  // element that is focused prior to modal opening

  @HostBinding('attr.role') role = 'dialog';
  @HostBinding('attr.tabindex') tabIndex = '-1';
  @HostBinding('attr.aria-modal') ariaModal = true;
  @HostBinding('attr.aria-labelledby') @Input() ariaLabelledBy: string;

  @HostBinding('class') get classes() {
    return `${this.windowClass ? this.windowClass : ''} ${this.currentTheme} modal fade show d-block`;
  }

  @Input() backdrop: boolean | string = true;
  @Input() centered: string;
  @Input() keyboard = true;
  @Input() size: string;
  @Input() windowClass: string;

  @Output() dismissEvent = new EventEmitter();

  private themeSub: Subscription;
  private currentTheme: string;

  @HostListener('click', ['$event']) onClick(event) {
    this.backdropClick(event);
  }

  @HostListener('keyup.esc', ['$event']) onKeyup(event) {
    this.escKey(event);
  }

  constructor(@Inject(DOCUMENT) private _document: any, private _elRef: ElementRef<HTMLElement>, private userService: UserService) { }

  backdropClick($event): void {
    if (this.backdrop === true && this._elRef.nativeElement === $event.target) {
      this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  escKey($event): void {
    if (this.keyboard && !$event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  ngOnInit() { this._elWithFocus = this._document.activeElement; }

  ngAfterViewInit() {
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      const autoFocusable = this._elRef.nativeElement.querySelector(`[Autofocus]`) as HTMLElement;
      const firstFocusable = getFocusableBoundaryElements(this._elRef.nativeElement)[0];

      const elementToFocus = autoFocusable || firstFocusable || this._elRef.nativeElement;
      elementToFocus.focus();
    }
  }

  ngAfterContentInit(): void {
    this.themeSub = this.userService.getPrefs().subscribe(prefs => {
      this.currentTheme = prefs.theme;
    });
  }

  ngOnDestroy() {
    const body = this._document.body;
    const elWithFocus = this._elWithFocus;

    let elementToFocus;
    if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
      elementToFocus = elWithFocus;
    } else {
      elementToFocus = body;
    }
    elementToFocus.focus();
    this._elWithFocus = null;
    this.themeSub.unsubscribe();
  }
}
