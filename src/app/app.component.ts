import { Component, NgModule, ViewChild } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MatListModule } from "@angular/material/list";
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  imports: [
    BrowserAnimationsModule, 
    MatSidenavModule,
    BrowserModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
  ],
})
export class AppModule {}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterModule, MatSidenavModule, NavbarComponent, MatListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
 @ViewChild('sidenav') sidenav!: MatSidenav;

  onToggleSidenav() {
    this.sidenav.toggle();
  }

}
