import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MenuItem } from '../sidebar.component';

@Component({
  selector: 'xm-li, li[xm]',
  templateUrl: './xm-li.component.html',
  styleUrls: ['./xm-li.component.scss'],
})
export class XmLiComponent implements OnInit {
  @Input() menuItem: MenuItem;
  @Input() selectedItem: string;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() subItemSelected = new EventEmitter<any>();
  @Input() showMinisidebar: boolean;
  color: string;
  showSubMenu;

  constructor() { }

  ngOnInit() {
    this.setColor(this.menuItem.color);
  }

  emitItemClicked(menuItem: MenuItem) {
    this.itemSelected.emit(menuItem);
  }

  emitSubItemClicked(index, subMenuItem: MenuItem) {
    this.subItemSelected.emit({
      index,
      ...subMenuItem
    });
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
