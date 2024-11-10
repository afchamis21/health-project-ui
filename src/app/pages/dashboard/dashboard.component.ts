import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, of, Subscription, switchMap} from "rxjs";
import {
  CompleteRegistrationDialog,
  CompleteRegistrationDialogComponent
} from "./components/complete-registration-dialog/complete-registration-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {User} from "../../core/types/user";
import {UserService} from "../../core/services/user/user.service";
import {PatientCardComponent} from "./components/patient-card/patient-card.component";
import {DesktopDashboardMenuComponent} from "./components/desktop-dashboard-menu/desktop-dashboard-menu.component";
import {MobileDashboardMenuComponent} from "./components/mobile-dashboard-menu/mobile-dashboard-menu.component";
import {ArrayUtils} from "../../shared/utils/array-utils";
import {
  CreatePatientDialogComponent,
  CreatePatientDialogReturn
} from "./components/create-patient-dialog/create-patient-dialog.component";
import {PaginationData} from "../../core/types/http";
import {SubscriptionUtils} from "../../shared/utils/subscription-utils";
import {WorkspaceComponent} from "./components/workspace/workspace.component";
import {FormControl} from "@angular/forms";
import {UserStateService} from "../../core/services/user/user-state.service";
import {PatientSummary} from "../../core/types/patient";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PatientCardComponent,
    DesktopDashboardMenuComponent,
    MobileDashboardMenuComponent,
    WorkspaceComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  user!: User
  patients: PatientSummary[] = []
  filteredPatients: PatientSummary[] = this.patients

  isMenuOpen = true

  menuPaginationData: PaginationData = {
    page: 0,
    size: 5,
    lastPage: 0,
    maxPages: 5,
    sort: "DESC"
  }

  searchFormControl = new FormControl('')

  localStorageIsMenuOpenKey = "is-dashboard-menu-open"

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private userService: UserService,
    private userStateService: UserStateService
  ) {
  }

  ngOnInit(): void {
    const userSubscription = this.userStateService.user$.subscribe(user => {
      this.user = user!
      if (user && !user.isRegistrationComplete) {
        this.openCompleteRegistrationDialog()
      } else if (user) {
        const patientsSubscription = this.fetchPatients()
        this.subscriptions.push(patientsSubscription)
      }
    })

    const searchSubscription = this.searchFormControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((resultado, _) => {
        return of(resultado);
      })
    ).subscribe(value => {
      this.menuPaginationData.page = 0
      this.fetchPatients(value)
    })

    this.isMenuOpen = localStorage.getItem(this.localStorageIsMenuOpenKey) === 'true'
    this.subscriptions.push(userSubscription, searchSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  fetchPatients(name: string | null = null) {
    if (name == null) {
      name = this.searchFormControl.value || ''
    }

    return this.userService.searchPatients(name, this.menuPaginationData).subscribe({
      next: (value) => {
        ArrayUtils.clearArray(this.patients)
        value.body.data?.forEach(patient => {
          this.patients.push(patient)
        })
        this.menuPaginationData.lastPage = value.body.lastPage
      }
    });
  }

  openCompleteRegistrationDialog() {
    const dialogRef = this.dialog.open(CompleteRegistrationDialogComponent, {
      disableClose: true
    })

    dialogRef.afterClosed().subscribe((value: CompleteRegistrationDialog) => {
      if (!value.complete) {
        return
      }

      this.userStateService.handleCompleteRegistration(value)
    })
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
    localStorage.setItem(this.localStorageIsMenuOpenKey, String(this.isMenuOpen))
  }

  createPatient() {
    const dialogRef = this.dialog.open(CreatePatientDialogComponent, {
      disableClose: true
    })

    dialogRef.afterClosed().subscribe((value: CreatePatientDialogReturn) => {
      if (value.complete) {
        this.userService.createPatient(value.value).subscribe({
          next: () => {
            this.toastr.info(`Paciente ${value.value.name} cadastrado com sucesso!`)
            this.fetchPatients()
          }
        })
      }
    })
  }

  fetchNextPage() {
    this.menuPaginationData.page += 1
    this.fetchPatients()
  }

  fetchPreviousPage() {
    this.menuPaginationData.page -= 1
    this.fetchPatients()
  }

  fetchSpecificPage(page: number) {
    this.menuPaginationData.page = page
    this.fetchPatients()
  }
}
