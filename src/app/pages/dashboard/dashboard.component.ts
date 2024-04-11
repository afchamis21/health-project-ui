import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, of, Subscription, switchMap} from "rxjs";
import {AuthService} from "../../core/services/auth/auth.service";
import {
  CompleteRegistrationDialog,
  CompleteRegistrationDialogComponent
} from "./components/complete-registration-dialog/complete-registration-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {User} from "../../core/types/user";
import {UserService} from "../../core/services/user/user.service";
import {Workspace} from "../../core/types/workspace";
import {WorkspaceCardComponent} from "./components/workspace-card/workspace-card.component";
import {DesktopDashboardMenuComponent} from "./components/desktop-dashboard-menu/desktop-dashboard-menu.component";
import {MobileDashboardMenuComponent} from "./components/mobile-dashboard-menu/mobile-dashboard-menu.component";
import {WorkspaceService} from "../../core/services/workspace/workspace.service";
import {ArrayUtils} from "../../shared/utils/array-utils";
import {
  CreateWorkspaceDialogComponent,
  CreateWorkspaceDialogReturn
} from "./components/create-workspace-dialog/create-workspace-dialog.component";
import {PaginationData} from "../../core/types/http";
import {SubscriptionUtils} from "../../shared/utils/subscription-utils";
import {WorkspaceComponent} from "./components/workspace/workspace.component";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    WorkspaceCardComponent,
    DesktopDashboardMenuComponent,
    MobileDashboardMenuComponent,
    WorkspaceComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  user!: User
  workspaces: Workspace[] = []
  filteredWorkspaces: Workspace[] = this.workspaces

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
    private authService: AuthService,
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    const userSubscription = this.userService.user$.subscribe(user => {
      this.user = user!
      if (user && !user.isRegistrationComplete) {
        this.openCompleteRegistrationDialog()
      } else if (user) {
        const workspacesSubscription = this.fetchWorkspaces()
        this.subscriptions.push(workspacesSubscription)
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
      this.fetchWorkspaces(value)
    })

    this.isMenuOpen = localStorage.getItem(this.localStorageIsMenuOpenKey) === 'true'
    this.subscriptions.push(userSubscription, searchSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  fetchWorkspaces(name: string | null = null) {
    if (name == null) {
      name = this.searchFormControl.value || ''
    }

    return this.userService.searchWorkspaces(name, this.menuPaginationData).subscribe({
      next: (value) => {
        ArrayUtils.clearArray(this.workspaces)
        value.body.data?.forEach(workspace => {
          this.workspaces.push(workspace)
        })
        this.menuPaginationData.lastPage = value.body.lastPage
      }
    });
  }

  openCompleteRegistrationDialog() {
    const dialogRef = this.dialog.open(CompleteRegistrationDialogComponent)

    dialogRef.afterClosed().subscribe((value: CompleteRegistrationDialog) => {
      console.log("Form Submitted:")
      console.table(value)
      if (!value.complete) {
        return
      }

      this.userService.completeRegistration({
        ...value
      }).subscribe({
        next: () => {
          this.toastr.success("Usuário atualizado com sucesso!")
          this.authService.forceLogout()
        }
      })
    })
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
    localStorage.setItem(this.localStorageIsMenuOpenKey, String(this.isMenuOpen))
  }

  createWorkspace() {
    const dialogRef = this.dialog.open(CreateWorkspaceDialogComponent)

    dialogRef.afterClosed().subscribe((value: CreateWorkspaceDialogReturn) => {
      if (value.complete) {
        this.workspaceService.createWorkspace({name: value.value.name}).subscribe({
          next: () => {
            this.toastr.success(`Paciente ${value.value.name} cadastrado com sucesso!`)
            this.fetchWorkspaces()
          }
        })
      }
    })
  }

  fetchNextPage() {
    this.menuPaginationData.page += 1
    this.fetchWorkspaces()
  }

  fetchPreviousPage() {
    this.menuPaginationData.page -= 1
    this.fetchWorkspaces()
  }

  fetchSpecificPage(page: number) {
    this.menuPaginationData.page = page
    this.fetchWorkspaces()
  }
}
