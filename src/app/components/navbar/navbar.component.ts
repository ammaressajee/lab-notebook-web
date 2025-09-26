import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatToolbar, MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-navbar',
  imports: [ MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
   @Output() toggleSidenav = new EventEmitter<void>();

  onMenuClick() {
    this.toggleSidenav.emit();
  }
}
