import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {HeaderComponent} from "./shared/components/header/header.component";
import {FooterComponent} from "./shared/components/footer/footer.component";
import {MatIconRegistry} from "@angular/material/icon";
import {NgxSpinnerComponent} from "ngx-spinner";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, RouterLink, HeaderComponent, FooterComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'health-project-ui';

  constructor(matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass("material-symbols-outlined")
  }
}
