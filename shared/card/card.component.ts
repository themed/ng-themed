import { Component, HostBinding, Input } from '@angular/core';

/**
 * CARD COMPONENT
 * The card component is made up of a header and body.
 * If the header is not present it does not show.
 * The header can host controls (buttons, dropdown, etc). To project control content
 * add the 'xm-card-controls' directive to the content you'd like projected and place
 * it between the xm-card tags.
 *
 * Anything else between the xm-card tags will be projected as xm-card-body content.
 *
 * IMPLEMENTATION STYLE STANDARDS
 * When implemented an xm-card typically has a bottom-margin value of 30px
 *
 * CARD WITH HEADER AND CONTROLS
 *

<xm-card
  [title]="'Map'">
  <header>Map</header>
  <span
    xm-card-controls
    class="button-group">
    <button
      class="btn btn-primary btn-sm"
      (click)="isMapUnlocked = !isMapUnlocked">
      {{isMapUnlocked ? 'Lock' : 'Unlock' }}
      <i class="icon-map-marker"></i>
    </button>
  </span>
  <xm-map
    [center]="detailLocation.geoLocation"
    [mapEnabled]="isMapUnlocked"></xm-map>
</xm-card>

 *
 * CARD WITHOUT HEADER
 *

<xm-card
  [title]="'Map'">
  <xm-map
    [center]="detailLocation.geoLocation"
    [mapEnabled]="isMapUnlocked"></xm-map>
</xm-card

 */

@Component({
  selector: 'xm-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string;
  @Input() removeBorder: boolean = false;
  @HostBinding('class.remove-border') get borderClass() {
    return this.removeBorder;
  }

  constructor() { }
}
