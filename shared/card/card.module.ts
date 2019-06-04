import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardBodyComponent } from './card-body/card-body.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule { }
