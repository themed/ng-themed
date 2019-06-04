import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { XmProgressbarComponent } from './progressbar';

export { XmProgressbarComponent, XmProgressbarConfig } from './progressbar';

@NgModule({
  declarations: [XmProgressbarComponent],
  exports: [XmProgressbarComponent],
  imports: [CommonModule]
})
export class ProgressbarModule { }
