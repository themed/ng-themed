import { AfterContentInit, Component, ContentChildren, Input, OnDestroy, OnInit, Output, QueryList } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AccordionPanelComponent } from './accordion-panel/accordion-panel.component';

@Component({
  selector: 'xm-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, AfterContentInit, OnDestroy {
  @ContentChildren(AccordionPanelComponent) accordionPanels: QueryList<AccordionPanelComponent>;
  @Output() accordionStatus$: Observable<{}[]>;
  @Output() clickEvents$: Observable<number>;
  @Input() closeOthers = false;
  private subs: Subscription[] = [];
  @Input() disableTransition = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.subs.push(this.accordionPanels.changes.pipe(startWith(this.accordionPanels)).subscribe((accordionPanels) => {
      this.watchChildren(accordionPanels);
      this.trackClicks(accordionPanels);
      this.collapsePanelHandling(accordionPanels, this.clickEvents$);
      this.setTransition(accordionPanels);
    }));
  }

  toggleAll(collapseExpand?: 'collapse' | 'expand') {
    this.accordionPanels.forEach((accordionPanel, index) => {
      accordionPanel.toggle(collapseExpand);
    });
  }

  private watchChildren(accordionPanels) {
    this.accordionStatus$ = combineLatest(
      accordionPanels.reduce((panelStatuses: BehaviorSubject<string>[], panelInstance: AccordionPanelComponent) => {
        if (!panelStatuses) {
          panelStatuses = [];
        }
        panelStatuses.push(panelInstance.panelStatus$);
        return panelStatuses;
      }, []));
  }

  private setTransition(accordionPanels: AccordionPanelComponent[]) {
    if (this.disableTransition) {
      accordionPanels.forEach(accordionPanel => {
        accordionPanel.disableTransition = true;
        accordionPanel.isLoading = false;
        accordionPanel.isCollapsed = true;
        accordionPanel.elementView.nativeElement.style.maxHeight = null;
      });
    }
  }

  private trackClicks(accordionPanels) {
    this.clickEvents$ = merge(
      ...accordionPanels.reduce((clickEvents: Observable<number>[], panelInstance: AccordionPanelComponent, index) => {
        if (!clickEvents) {
          clickEvents = [];
        }
        clickEvents.push(panelInstance.onClicked.pipe(map(() => index)));
        return clickEvents;
      }, []));
  }

  private collapsePanelHandling(accordionPanels, clickEvents$: Observable<number>) {
    this.subs.push(clickEvents$.subscribe(clickedPanelIndex => {
      if (this.closeOthers) {
        accordionPanels.forEach((accordionPanel, index) => {
          if (index !== clickedPanelIndex) {
            accordionPanel.toggle('collapse');
          }
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
