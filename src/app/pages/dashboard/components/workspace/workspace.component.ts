import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Tab} from "../../../../core/types/tab";
import {User} from "../../../../core/types/user";
import {Workspace} from "../../../../core/types/workspace";
import {NgForOf, NgIf} from "@angular/common";
import {WorkspaceService} from "../../../../core/services/workspace.service";
import {WorkspaceStateService} from "../../../../core/services/workspace-state.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../shared/utils/subscription-utils";
import {TabsComponent} from "./tabs/tabs.component";
import {UserService} from "../../../../core/services/user.service";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    TabsComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  @Input() user?: User;
  workspace: Workspace | null = null;

  selectedTab: Tab | null = null;
  clockedIn = false

  subscriptions: Subscription[] = []

  constructor(private workspaceService: WorkspaceService, private workspaceStateService: WorkspaceStateService, private userService: UserService) {
  }

  ngOnInit(): void {
    const workspaceSubscription = this.workspaceStateService.workspace$.subscribe(value => {
      this.workspace = value

      if (value?.ownerId === this.user?.userId) {
        this.clockedIn = true
      } else this.clockedIn = !!(this.user?.isClockedIn && this.user.clockedInAt === this.workspace?.workspaceId);
    })

    this.subscriptions.push(workspaceSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  clockIn(workspaceId: number) {
    if (this.user?.isClockedIn) {
      this.clockOut()
    }

    this.workspaceService.clockIn({workspaceId}).subscribe({
      next: (value) => {
        this.clockedIn = true
        this.userService.clockIn(value.body.workspaceId)
      }
    })
  }

  clockOut() {
    this.workspaceService.clockOut().subscribe({
      next: () => {
        this.clockedIn = false
        this.selectedTab = null
        this.userService.clockOut()
      }
    })
  }

  selectTab(tab: Tab) {
    this.selectedTab = tab
  }
}
