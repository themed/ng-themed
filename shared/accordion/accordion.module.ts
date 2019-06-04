import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from 'app/directives/directives.module';

import { AccordionHeaderComponent } from './accordion-panel/accordion-header/accordion-header.component';
import { AccordionPanelComponent } from './accordion-panel/accordion-panel.component';
import { AccordionComponent } from './accordion.component';

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule
  ],
  declarations: [
    AccordionComponent,
    AccordionHeaderComponent,
    AccordionPanelComponent,
  ],
  exports: [
    AccordionPanelComponent,
    AccordionComponent
  ]
})
export class AccordionModule { }
