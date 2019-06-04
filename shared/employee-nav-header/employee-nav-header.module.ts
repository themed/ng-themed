import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@shared/button/button.module';

import { EmployeeNavHeaderComponent } from './employee-nav-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
  ],

  declarations: [EmployeeNavHeaderComponent],
  exports: [EmployeeNavHeaderComponent]
})
export class EmployeeNavHeaderModule { }
