import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
  animations: [
    trigger('expandContent', [
      state('collapsed', style({ width: '0%', height: '0%' })),
      state('expanded', style({ width: '100%', height: '100%' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class AdminPanelComponent {
  isMenuOpen = false;
  state = 'collapsed';

  constructor(private authService: AuthService) {}

  toggleIcon(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.state = this.isMenuOpen ? 'expanded' : 'collapsed';
  }

  onSelect(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.state = this.isMenuOpen ? 'expanded' : 'collapsed';
  }

  onLogout(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.state = this.isMenuOpen ? 'expanded' : 'collapsed';
    this.authService.logOut();
  }
}
