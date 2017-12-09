import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'x-badge',
  templateUrl: './badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  @Input() badgeCss: string;
  @Input() text: string;
}
