import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { XmCollapseComponent, XmCollapseContentComponent, XmCollapseToggleDirective } from './collapse';

export { XmCollapseComponent, XmCollapseToggleDirective, XmCollapseContentComponent } from './collapse';

@NgModule({
  declarations: [XmCollapseComponent, XmCollapseToggleDirective, XmCollapseContentComponent],
  imports: [
    CommonModule,
  ],
  exports: [XmCollapseComponent, XmCollapseToggleDirective, XmCollapseContentComponent]
})
export class CollapseModule { }
