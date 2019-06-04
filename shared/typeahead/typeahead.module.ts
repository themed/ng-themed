import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { XmHighlightComponent } from './highlight';
import { XmTypeaheadDirective } from './typeahead';
import { XmTypeaheadWindowComponent } from './typeahead-window.component';

export { XmHighlightComponent } from './highlight';
export { XmTypeaheadWindowComponent } from './typeahead-window.component';
export { XmTypeaheadConfig, XmTypeaheadDirective, XmTypeaheadSelectItemEvent } from './typeahead';

@NgModule({
  declarations: [XmTypeaheadDirective, XmHighlightComponent, XmTypeaheadWindowComponent],
  exports: [XmTypeaheadDirective, XmHighlightComponent],
  imports: [CommonModule],
  entryComponents: [XmTypeaheadWindowComponent]
})
export class TypeaheadModule { }
