import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DirectivesModule } from '../../directives/directives.module';
import { SidebarComponent } from './sidebar.component';
import { XmLiComponent } from './xm-li/xm-li.component';
import { XmSubLiComponent } from './xm-li/xm-sub-li/xm-sub-li.component';

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule
  ],
  declarations: [
    SidebarComponent,
    XmLiComponent,
    XmSubLiComponent,
  ],
  exports: [
    SidebarComponent,
    XmLiComponent,
    XmSubLiComponent,
  ],
  providers: []
})
export class SidebarModule { }
