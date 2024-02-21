import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    WorkspaceCardComponent,
    DesktopDashboardMenuComponent,
    MobileDashboardMenuComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  user: User | null = null
  workspaces: Workspace[] = []
  filteredWorkspaces = this.workspaces
  activeWorkspace: Workspace | null = null

  isMenuOpen = true
  menuPageSize = 5
  menuCurrentPage = 1
  menuLastPage = 0
  menuMaxPages = 5

  sortMode: "ASC" | "DESC" = "DESC"

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    const userSubscription = this.userService.user$.subscribe(user => {
      this.user = user
      if (user && !user.isRegistrationComplete) {
        this.openCompleteRegistrationDialog()
      } else {
        const workspacesSubscription = this.fetchWorkspaces()
        this.subscriptions.push(workspacesSubscription)
      }
    })

    this.subscriptions.push(userSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  fetchWorkspaces(paginationData: PaginationData = {
                    page: this.menuCurrentPage,
                    size: this.menuPageSize,
                    sort: this.sortMode
                  }
  ) {
    return this.userService.getWorkspaces({
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

  filterWorkspaces(value: string) {
    this.filteredWorkspaces = this.workspaces.filter(
      (workspace) => workspace.name.toLowerCase().startsWith(value.toLowerCase())
    )
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
