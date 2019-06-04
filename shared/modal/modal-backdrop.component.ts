import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'xm-modal-backdrop',
  template: '',
  styleUrls: ['./modal-backdrop.component.scss']
})
export class XmModalBackdropComponent {

  @HostBinding('style.z-index') zIndex = '1050';

  @HostBinding('class') get classes() {
    return `${this.backdropClass ? this.backdropClass : ''} modal-backdrop fade show`;
  }

  @Input() backdropClass: string;
}
