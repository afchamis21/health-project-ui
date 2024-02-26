import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, of, Subscription, switchMap} from "rxjs";
import {AuthService} from "../../core/services/auth.service";
import {
  CompleteRegistrationDialog,
  CompleteRegistrationDialogComponent
} from "./components/complete-registration-dialog/complete-registration-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {User} from "../../core/types/user";
import {UserService} from "../../core/services/user.service";
import {Workspace} from "../../core/types/workspace";
import {WorkspaceCardComponent} from "./components/workspace-card/workspace-card.component";
import {DesktopDashboardMenuComponent} from "./components/desktop-dashboard-menu/desktop-dashboard-menu.component";
import {MobileDashboardMenuComponent} from "./components/mobile-dashboard-menu/mobile-dashboard-menu.component";
import {WorkspaceService} from "../../core/services/workspace.service";
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
  activeWorkspace: Workspace | null = null

  isMenuOpen = true
  menuPageSize = 5
  menuCurrentPage = 1
  menuLastPage = 0
  menuMaxPages = 5

  sortMode: "ASC" | "DESC" = "DESC"

  searchFormControl = new FormControl('')

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
      } else {
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
      this.menuCurrentPage = 1
      this.fetchWorkspaces(value)
    })

    this.subscriptions.push(userSubscription, searchSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  fetchWorkspaces(name: string | null = null, paginationData: PaginationData = {
                    page: this.menuCurrentPage,
                    size: this.menuPageSize,
                    sort: this.sortMode
                  }
  ) {
    if (name == null) {
      name = this.searchFormControl.value || ''
    }

    return this.userService.searchWorkspaces(name, {
      ...paginationData,
      page: paginationData.page - 1
    }).subscribe({
      next: (value) => {
        ArrayUtils.clearArray(this.workspaces)
        value.body.data?.forEach(workspace => {
          this.workspaces.push(workspace)
        })
        this.menuLastPage = value.body.lastPage + 1
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
    this.menuCurrentPage += 1
    this.fetchWorkspaces()
  }

  fetchPreviousPage() {
    this.menuCurrentPage -= 1
    this.fetchWorkspaces()
  }

  fetchSpecificPage(page: number) {
    this.menuCurrentPage = page
    this.fetchWorkspaces()
  }
}
