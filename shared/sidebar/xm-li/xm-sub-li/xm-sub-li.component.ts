import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MenuItem } from '../../sidebar.component';

@Component({
  selector: 'xm-sub-li, li[xm-sub]',
  templateUrl: './xm-sub-li.component.html',
  styleUrls: ['./xm-sub-li.component.scss'],
})
export class XmSubLiComponent implements OnInit {
  @Input() menuItem: MenuItem;
  @Input() selectedItem: string;
  @Input() showMinisidebar: boolean;
  @Output() subItemSelected = new EventEmitter<any>();
  color: string;
  showSubMenu;

  constructor() { }

  ngOnInit() {
    this.setColor(this.menuItem.color);
  }

  emitSubItemClicked() {
    this.subItemSelected.emit();
  }

  private setColor(color) {
    if (!color) {
      return;
    }
    try {
      if (color.a) {
        this.color = `rgba(${color.r},${color.g},${color.b},${color.a})`;
      } else {
        this.color = `rgb(${color.r},${color.g},${color.b})`;
      }
    } catch (error) {
      console.error('Unable to set rgb/rgba color');
    }
  }
}
