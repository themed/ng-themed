import {
  AfterContentChecked,
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Injectable,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';

import { Key } from '../util/key';

let nextId = 0;

@Injectable({ providedIn: 'root' })
export class XmTabsetConfig {
  justify: 'start' | 'center' | 'end' | 'fill' | 'justified' = 'start';
  type: 'tabs' | 'pills' = 'tabs';
}

/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
@Directive({ selector: 'ng-template[xmTabTitle]' })
export class XmTabTitleDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({ selector: 'ng-template[xmTabContent]' })
export class XmTabContentDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * A directive representing an individual tab.
 */
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'xm-tab'
})
export class XmTabDirective implements AfterContentChecked {
  /**
   * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
   */
  @Input() id = `xm-tab-${nextId++}`;
  /**
   * Simple (string only) title. Use the "XmTabTitle" directive for more complex use-cases.
   */
  @Input() title: string;
  /**
   * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
   */
  @Input() disabled = false;

  titleTpl: XmTabTitleDirective | null;
  contentTpl: XmTabContentDirective | null;
  titleRootNode: HTMLElement;

  @ContentChildren(XmTabTitleDirective, { descendants: false }) titleTpls: QueryList<XmTabTitleDirective>;
  @ContentChildren(XmTabContentDirective, { descendants: false }) contentTpls: QueryList<XmTabContentDirective>;

  ngAfterContentChecked() {
    // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
    // only @ContentChildren allows us to specify the {descendants: false} option.
    this.titleTpl = this.titleTpls.first;
    this.contentTpl = this.contentTpls.first;
    if (this.titleTpl) {
      let embedView = this.titleTpl.templateRef.createEmbeddedView(null);
      this.titleRootNode = embedView.rootNodes[0];
    }
  }
}

/**
 * The payload of the change event fired right before the tab change
 */
export interface XmTabChangeEvent {
  /**
   * Id of the currently active tab
   */
  activeId: string;

  /**
   * Id of the newly selected tab
   */
  nextId: string;

  /**
   * Title of the newly selected tab
   */
  nextTitle: string;

  /**
   * Function that will prevent tab switch if called
   */
  preventDefault: () => void;
}

/**
 * A component that makes it easy to create tabbed interface.
 */
@Component({
  selector: 'xm-tabset',
  exportAs: 'xmTabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class XmTabsetComponent implements AfterContentChecked {
  justifyClass: string;

  @ContentChildren(XmTabDirective) tabs: QueryList<XmTabDirective>;

  /**
   * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
   */
  @Input() activeId: string;

  /**
   * Whether the closed tabs should be hidden without destroying them
   */
  @Input() destroyOnHide = true;

  /**
   * The horizontal alignment of the nav with flexbox utilities. Can be one of 'start', 'center', 'end', 'fill' or
   * 'justified'
   * The default value is 'start'.
   */
  @Input()
  set justify(className: 'start' | 'center' | 'end' | 'fill' | 'justified') {
    if (className === 'fill' || className === 'justified') {
      this.justifyClass = `tabs-${className}`;
    } else {
      this.justifyClass = `justify-content-${className}`;
    }
  }

  /**
   * Type of navigation to be used for tabs.
   */
  @Input() type: 'tabs' | 'pills' | string;

  /**
   * A tab change event fired right before the tab selection happens. See XmTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<XmTabChangeEvent>();

  constructor(config: XmTabsetConfig) {
    this.type = config.type;
    this.justify = config.justify;
  }

  /**
   * Selects the tab with the given id and shows its associated pane.
   * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
   * Can call from component with ViewChild and ngAfterViewInit.
   */
  select(tabId: string) {
    let selectedTab = this._getTabById(tabId);
    if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
      let defaultPrevented = false;
      this.tabChange.emit({
        activeId: this.activeId,
        nextId: selectedTab.id,
        nextTitle: selectedTab.titleRootNode.innerText,
        preventDefault: () => { defaultPrevented = true; }
      });
      if (!defaultPrevented) {
        this.activeId = selectedTab.id;
      }
    }
  }

  onKeydown(keyEvent: KeyboardEvent) {
    let allTabs: XmTabDirective[] = [];
    this.tabs.map(element => { allTabs.push(element); });
    if (keyEvent.keyCode === Key.ArrowLeft) {
      this._previousTab(allTabs);
    } else if (keyEvent.keyCode === Key.ArrowRight) {
      this._nextTab(allTabs);
    }
  }

  ngAfterContentChecked() {
    // auto-correct activeId that might have been set incorrectly as input
    let activeTab = this._getTabById(this.activeId);
    this.activeId = activeTab ? activeTab.id : (this.tabs.length ? this.tabs.first.id : null);
  }

  private _previousTab(tabs) {
    for (const [index, value] of tabs.entries()) {
      if (value.id === this.activeId) {
        if (index > 0) {
          this.select(tabs[index - 1].id);
          return;
        }
      }
    }
  }

  private _nextTab(tabs) {
    let tabsLimit = tabs.length - 1;
    for (const [index, value] of tabs.entries()) {
      if (value.id === this.activeId) {
        if (index < tabsLimit) {
          this.select(tabs[index + 1].id);
          return;
        }
      }
    }
  }

  private _getTabById(id: string): XmTabDirective {
    let tabsWithId: XmTabDirective[] = this.tabs.filter(tab => tab.id === id);
    return tabsWithId.length ? tabsWithId[0] : null;
  }
}
