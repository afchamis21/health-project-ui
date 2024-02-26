import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {WorkspaceCardComponent} from "../workspace-card/workspace-card.component";
import {User} from "../../../../core/types/user";
import {Workspace} from "../../../../core/types/workspace";
import {Menu} from "../menu";
import {PageControllerComponent} from "../../../../shared/components/page-controller/page-controller.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-mobile-dashboard-menu',
  standalone: true,
  imports: [
    MatIconModule,
    NgClass,
    NgIf,
    NgForOf,
    WorkspaceCardComponent,
    PageControllerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './mobile-dashboard-menu.component.html',
  styleUrl: './mobile-dashboard-menu.component.css'
})
export class MobileDashboardMenuComponent implements Menu {
  @Input() user!: User
  @Input() workspaces: Workspace[] = []
  @Input() isMenuOpen = false

  @Input() currentPage = 0
  @Input() lastPage = 0
  @Input() maxPages = 0

  @Input() searchFormControl!: FormControl<string | null>

  @Output() onCreateWorkspace = new EventEmitter<void>()
  @Output() onToggleMenu = new EventEmitter<void>()

  @Output() onSpecificPage = new EventEmitter<number>()
  @Output() onPreviousPage = new EventEmitter<void>()
  @Output() onNextPage = new EventEmitter<void>()

  createWorkspace() {
    this.onCreateWorkspace.emit()
  }

  toggleMenu() {
    this.onToggleMenu.emit()
  }
}
