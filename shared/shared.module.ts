import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TechDataService } from '@services/tech-data.service';
import { DatepickerModule } from '@shared/datepicker/datepicker.module';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { EmployeeNavHeaderModule } from '@shared/employee-nav-header/employee-nav-header.module';
import { PeriodSelectorComponent } from '@shared/period-selector/period-selector.component';
import { PopoverModule } from '@shared/popover/popover.module';
import { SidebarModule } from '@shared/sidebar/sidebar.module';
import { TabsetModule } from '@shared/tabset/tabset.module';
import { TooltipModule } from '@shared/tooltip/tooltip.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { LottieAnimationViewModule } from 'ng-lottie';

import { AccordionModule } from './accordion/accordion.module';
import { CalendarSelectorComponent } from './calendar-selector/calendar-selector.component';
import { CardModule } from './card/card.module';


@NgModule({
  imports: [
    AccordionModule,
    CardModule,
    CommonModule,
    DropdownModule,
    EmployeeNavHeaderModule,
    FormsModule,
    LottieAnimationViewModule,
    ReactiveFormsModule,
    RoundProgressModule,
    RouterModule,
    SidebarModule,
    TabsetModule,
    AccordionModule,
    DropdownModule,
    TooltipModule,
    PopoverModule,
    DatepickerModule,
  ],
  declarations: [
    PeriodSelectorComponent,
    CalendarSelectorComponent,
  ],
  exports: [
    AccordionModule,
    AccordionModule,
    EmployeeNavHeaderModule,
    PeriodSelectorComponent,
    CalendarSelectorComponent
  ],
  providers: [
    FormBuilder,
    TechDataService
  ]
})
export class SharedModule { }
