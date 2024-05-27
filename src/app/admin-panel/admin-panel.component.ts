import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logOut();
  }
}
