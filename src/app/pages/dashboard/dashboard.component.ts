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
  workspaces: Workspace[] = [
    {
      workspaceId: 1,
      createDt: new Date(),
      name: "Danilo Fernandes",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 2,
      createDt: new Date(),
      name: "Jane Alice Niess",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 3,
      createDt: new Date(),
      name: "Bruna Paola Bertagnon Fernandes",
      isActive: false,
      ownerId: 2
    },
    {
      workspaceId: 1,
      createDt: new Date(),
      name: "Danilo Fernandes",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 2,
      createDt: new Date(),
      name: "Jane Alice Niess",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 3,
      createDt: new Date(),
      name: "Bruna Paola Bertagnon Fernandes",
      isActive: false,
      ownerId: 2
    },
    {
      workspaceId: 1,
      createDt: new Date(),
      name: "Danilo Fernandes",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 2,
      createDt: new Date(),
      name: "Jane Alice Niess",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 3,
      createDt: new Date(),
      name: "Bruna Paola Bertagnon Fernandes",
      isActive: false,
      ownerId: 2
    },
    {
      workspaceId: 1,
      createDt: new Date(),
      name: "Danilo Fernandes",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 2,
      createDt: new Date(),
      name: "Jane Alice Niess",
      isActive: true,
      ownerId: 2
    },
    {
      workspaceId: 3,
      createDt: new Date(),
      name: "Bruna Paola Bertagnon Fernandes",
      isActive: false,
      ownerId: 2
    },
  ]

  filteredWorkspaces = this.workspaces

  activeWorkspace: Workspace | null = null

  isWorkspaceMenuOpen = true;

  constructor(private authService: AuthService, private userService: UserService, private dialog: MatDialog, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    const userSubscription = this.userService.user$.subscribe(user => {
      this.user = user
      if (user && !user.isRegistrationComplete) {
        this.openCompleteRegistrationDialog()
      }
    })


    this.subscriptions.push(userSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
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
}
