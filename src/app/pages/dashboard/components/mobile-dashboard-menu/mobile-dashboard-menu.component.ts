import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {PatientCardComponent} from "../patient-card/patient-card.component";
import {User} from "../../../../core/types/user";
import {Menu} from "../menu";
import {PageControllerComponent} from "../../../../shared/components/page-controller/page-controller.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {PaginationData} from "../../../../core/types/http";
import {PatientSummary} from "../../../../core/types/patient";

@Component({
  selector: 'app-mobile-dashboard-menu',
  standalone: true,
  imports: [
    MatIconModule,
    NgClass,
    NgIf,
    NgForOf,
    PatientCardComponent,
    PageControllerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './mobile-dashboard-menu.component.html',
  styleUrl: './mobile-dashboard-menu.component.css'
})
export class MobileDashboardMenuComponent implements Menu {
  @Input() user!: User
  @Input() patientSummaries: PatientSummary[] = []
  @Input() isMenuOpen = false

  @Input() paginationData!: PaginationData

  @Input() searchFormControl!: FormControl<string | null>

  @Output() onCreatePatient = new EventEmitter<void>()
  @Output() onToggleMenu = new EventEmitter<void>()

  @Output() onSpecificPage = new EventEmitter<number>()
  @Output() onPreviousPage = new EventEmitter<void>()
  @Output() onNextPage = new EventEmitter<void>()

  createPatient() {
    this.onCreatePatient.emit()
  }

  toggleMenu() {
    this.onToggleMenu.emit()
  }
}
