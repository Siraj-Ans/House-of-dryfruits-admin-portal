import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent {
  onLogout(): void {}
}
