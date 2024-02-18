import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {WorkspaceCardComponent} from "../workspace-card/workspace-card.component";
import {User} from "../../../../core/types/user";
import {Workspace} from "../../../../core/types/workspace";

@Component({
  selector: 'app-desktop-dashboard-menu',
  standalone: true,
  imports: [
    MatIconModule,
    NgForOf,
    NgIf,
    WorkspaceCardComponent,
    NgClass
  ],
  templateUrl: './desktop-dashboard-menu.component.html',
  styleUrl: './desktop-dashboard-menu.component.css'
})
export class DesktopDashboardMenuComponent {
  @Input() user: User | null = null
  @Input() workspaces: Workspace[] = []

  @Output() onFilterWorkspace = new EventEmitter<string>()

  isMenuOpen = false;

  filterWorkspaces($event: Event) {
    this.onFilterWorkspace.emit(($event.target as HTMLInputElement).value)
  }

  toggleWorkspaceMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }
}
