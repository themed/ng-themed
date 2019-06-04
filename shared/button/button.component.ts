import { AfterViewInit, Component, HostBinding, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'xm-button, button[xm]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, AfterViewInit {
  @ViewChild('contentWrapper') contentWrapper;

  @HostBinding('attr.role') role: string;
  @HostBinding('class.xm-icon') xmIcon: boolean;
  @Input() icon?: string;

  constructor(private renderer: Renderer2) {
    this.role = 'button';
  }

  ngOnInit() {
    this.icon ? this.xmIcon = true : this.xmIcon = false;
  }

  ngAfterViewInit(): void {
    let textSpan = this.contentWrapper.nativeElement;
    if (!textSpan.hasChildNodes()) {
      this.renderer.addClass(textSpan, 'hide-text-node');
    } else {
      this.renderer.addClass(textSpan, 'show-text-node');
    }
  }

}
