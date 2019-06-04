import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { XmModal } from './modal';
import { XmModalBackdropComponent } from './modal-backdrop.component';
import { XmModalWindowComponent } from './modal-window.component';

export { XmModal } from './modal';
export { XmModalConfig, XmModalOptions } from './modal-config';
export { XmModalRef, XmActiveModal } from './modal-ref';
export { ModalDismissReasons } from './modal-dismiss-reasons';

@NgModule({
  declarations: [XmModalBackdropComponent, XmModalWindowComponent],
  entryComponents: [XmModalBackdropComponent, XmModalWindowComponent],
  imports: [
    CommonModule
  ],
  providers: [XmModal],
})
export class ModalModule { }
