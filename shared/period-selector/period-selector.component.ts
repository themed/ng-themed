import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedDataService } from '@services/core/shared-data.service';

@Component({
  selector: 'xm-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {
  @Output() periodUpdated = new EventEmitter();
  @Output() refreshStats = new EventEmitter();
  public lastUpdated: Date;
  public now: number;

  public periodOptions: any[] = [
    {
      text: 'Today',
      value: 0
    },
    {
      text: 'Last 7 Days',
      value: 6
    },
    {
      text: 'Last 30 Days',
      value: 30
    }
  ];

  constructor(private sharedData: SharedDataService) { }

  ngOnInit() {
    this.lastUpdated = new Date();
  }

  public updatePeriod(event: any) {
    this.lastUpdated = new Date();
    let daysHistory = (!event ? this.sharedData.daysHistory.value : Number(event.srcElement.value));
    this.sharedData.updateDaysHistory(daysHistory);
    this.periodUpdated.emit(daysHistory);
  }

  public updateStats() {
    this.lastUpdated = new Date();
    this.refreshStats.emit();
  }

}
