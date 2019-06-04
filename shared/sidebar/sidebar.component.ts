import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

export class MenuItem {
  constructor(
    position: number,
    title: string,
    icon?: string,
    route?: {
      url: string,
      params?: {},
      isExternal?: boolean,
    },
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    },
    tooltip?: string,
    object?: Object,
    subMenuItems?: MenuItem[],
  ) {
    this.position = position;
    this.title = title;
    this.icon = icon;
    this.color = color;
    this.tooltip = tooltip;
    this.route = route;
    this.object = object;
    this.subMenuItems = subMenuItems;
  }
  position: number;
  title: string;
  icon?: string;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  route?: {
    url: string,
    params?: {},
    isExternal?: boolean,
  };
  tooltip?: string;
  object?: Object;
  subMenuItems?: MenuItem[];
}

@Component({
  selector: 'xm-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  _menuItems: MenuItem[];
  @Input() position: 'left' | 'right' = 'left';
  @Input() showMinisidebar: boolean;
  selectedItem = '';
  selectedItemIndex;
  selectedSubItem = '';
  selectedSubItemIndex;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() subItemSelected = new EventEmitter<any>();

  // menuItems are sorted by postion and set.
  @Input() set menuItems(value: MenuItem[]) {
    this._menuItems = value.sort((a, b) => a.position - b.position).map(menuItem =>
      ({
        ...menuItem,
        subMenuItems: menuItem.subMenuItems ? menuItem.subMenuItems.sort((a, b) => a.position - b.position) : menuItem.subMenuItems
      })
    );
  }
  get menuItems() {
    return this._menuItems;
  }
  constructor() { }

  ngOnInit() { }

  setItemAndEmit(index, menuItem) {
    this.selectedItemIndex = index;
    this.selectedSubItem = '';
    this.itemSelected.emit({
      index,
      ...menuItem
    });
    if (this.selectedItem === menuItem.title || (this.showMinisidebar && !(menuItem.subMenuItems && menuItem.subMenuItems.length === 0))) {
      this.selectedItem = '';
    } else {
      this.selectedItem = menuItem.title;
    }
  }

  setSubItemAndEmit(index, menuItem, subMenuItem) {
    this.selectedSubItemIndex = subMenuItem.index;
    this.selectedItemIndex = index;
    this.subItemSelected.emit(subMenuItem);
    this.selectedItem = '';
    if (this.selectedSubItem === subMenuItem.title) {
      this.selectedSubItem = '';
    } else {
      this.selectedSubItem = subMenuItem.title;
    }

    this.updateSidebarItemByIndex(menuItem, this.selectedItemIndex);
  }

  updateSidebarItemByIndex(newItem, index, parentMenuIndex?) {
    if (parentMenuIndex) {
      this._menuItems[parentMenuIndex].subMenuItems[index] = { ...newItem };
    } else {
      this._menuItems[index] = { ...newItem };
    }
  }

  appendSidebarItemByTitle(newItem: MenuItem, parentMenuItemTitle?) {
    if (parentMenuItemTitle) {
      const parentIndex = this._menuItems.findIndex(menuItem => menuItem.title === parentMenuItemTitle);
      this._menuItems[parentIndex].subMenuItems.splice(newItem.position, 0, { ...newItem });
    } else {
      this._menuItems.push({ ...newItem });
    }
  }

  updateSidebarItemByTitle(updateItem, oldItemTitle?, parentMenuItemTitle?) {
    if (parentMenuItemTitle) {
      const parentIndex = this._menuItems.findIndex(menuItem => menuItem.title === parentMenuItemTitle);
      const childIndex = this._menuItems[parentIndex].subMenuItems.findIndex(menuItem => menuItem.title === oldItemTitle);
      this._menuItems[parentIndex].subMenuItems[childIndex] = { ...updateItem };
    } else {
      const index = this._menuItems.findIndex(menuItem => menuItem.title === oldItemTitle);
      this._menuItems[index] = { ...updateItem };
    }
  }

  deleteSidebarItemByTitle(deleteTitle: string, parentMenuItemTitle?) {
    if (parentMenuItemTitle) {
      const parentIndex = this._menuItems.findIndex(menuItem => menuItem.title === parentMenuItemTitle);
      const childIndex = this._menuItems[parentIndex].subMenuItems.findIndex(menuItem => menuItem.title === deleteTitle);
      this._menuItems[parentIndex].subMenuItems.splice(childIndex, 1);
    } else {
      const index = this._menuItems.findIndex(menuItem => menuItem.title === deleteTitle);
      this._menuItems.splice(index, 1);
    }
  }

}
