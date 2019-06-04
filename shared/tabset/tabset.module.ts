import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { XmTabContentDirective, XmTabDirective, XmTabsetComponent, XmTabTitleDirective } from './tabset.component';

@NgModule({
  declarations: [
    XmTabsetComponent,
    XmTabDirective,
    XmTabContentDirective,
    XmTabTitleDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    XmTabsetComponent,
    XmTabDirective,
    XmTabContentDirective,
    XmTabTitleDirective
  ]
})
export class TabsetModule { }
