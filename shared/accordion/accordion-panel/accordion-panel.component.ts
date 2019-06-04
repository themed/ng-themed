import { AfterContentInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'xm-accordion-panel, div[xm-accordion-panel]',
  templateUrl: './accordion-panel.component.html',
  styleUrls: ['./accordion-panel.component.scss']
})
export class AccordionPanelComponent implements AfterContentInit {
  @ViewChild('bodyContainer') elementView: ElementRef;
  @Input() bodyHeight: number;
  private _isCollapsed = true;
  /**
  * the accordions need to be expaned for a split second to get the hight.
  * isLoading hides that moment by relocating the body off-screen. Hacky? oh yes.
  */
  isLoading = true;
  @Input() disableTransition = false;
  @Input() title: string;
  @Output() panelStatus$ = new BehaviorSubject<string>('collapsed');
  @Output() onClicked = new EventEmitter<any>();
  @Input() set isCollapsed(value) {
    this._isCollapsed = value;
    this.setPanelStatus(this._isCollapsed);
  }

  get isCollapsed() {
    return this._isCollapsed;
  }

  constructor() { }

  ngAfterContentInit() {
    if (!this.disableTransition) { this.setBodyHeight(); }
  }

  setBodyHeight() {
    /**
     * resize directive returns a resize event. Here, we only reset the accordion heights if the width has changed.
     */
    if (!this.disableTransition) {
      this._isCollapsed = false;
      this.isLoading = true;
      setTimeout(() => {
        /**
         * a change cycle is necessary to get the heights
         */
        this.bodyHeight = this.elementView.nativeElement.offsetHeight;
        if (this.bodyHeight > 1 && this.isLoading) {
          this.elementView.nativeElement.style.maxHeight = `${this.bodyHeight + 100}px`;
          this._isCollapsed = true;
          this.isLoading = false;
        }
      }, 0);
    } else {
      this._isCollapsed = true;
      this.isLoading = false;
    }
  }

  toggle(collapseExpand?: 'collapse' | 'expand') {
    switch (collapseExpand) {
      case 'collapse':
        this._isCollapsed = true;
        break;
      case 'expand':
        this._isCollapsed = false;
        break;
      default:
        this._isCollapsed = !this._isCollapsed;
    }
    this.setPanelStatus(this._isCollapsed);
  }

  clicked() {
    this.onClicked.emit();
  }

  setPanelStatus(collapseExpand: boolean) {
    if (collapseExpand) {
      this.panelStatus$.next('collapsed');
    } else {
      this.panelStatus$.next('expanded');
    }
  }

}
