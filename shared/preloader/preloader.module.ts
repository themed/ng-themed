import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DirectivesModule } from '../../directives/directives.module';
import { PreloaderComponent } from './preloader.component';

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule
  ],
  declarations: [PreloaderComponent],
  exports: [PreloaderComponent]
})
export class PreloaderModule { }
