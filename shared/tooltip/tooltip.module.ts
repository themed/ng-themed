import { NgModule } from '@angular/core';

import { XmTooltipDirective, XmTooltipWindowComponent } from './tooltip';

export { XmTooltipConfig, XmTooltipDirective } from './tooltip';
export { Placement } from '../util/positioning';

@NgModule({
  declarations: [XmTooltipDirective, XmTooltipWindowComponent],
  exports: [XmTooltipDirective],
  entryComponents: [XmTooltipWindowComponent],
})
export class TooltipModule { }
