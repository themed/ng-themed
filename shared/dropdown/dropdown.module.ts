import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  XmDropdownAnchorDirective,
  XmDropdownComponent,
  XmDropdownItemDirective,
  XmDropdownMenuComponent,
  XmDropdownToggleDirective,
} from './dropdown';


export {
  XmDropdownComponent,
  XmDropdownAnchorDirective,
  XmDropdownToggleDirective,
  XmDropdownMenuComponent,
  XmDropdownItemDirective
} from './dropdown';

const XM_DROPDOWN_DIRECTIVES = [
  XmDropdownComponent,
  XmDropdownAnchorDirective,
  XmDropdownToggleDirective,
  XmDropdownMenuComponent,
  XmDropdownItemDirective
];

@NgModule({
  declarations: [
    XM_DROPDOWN_DIRECTIVES
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    XM_DROPDOWN_DIRECTIVES
  ]
})
export class DropdownModule { }
