import {Component, OnDestroy, OnInit} from '@angular/core';
import {Tab, tabs} from "../../../../core/types/tab";
import {User} from "../../../../core/types/user";
import {Workspace} from "../../../../core/types/workspace";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {WorkspaceStateService} from "../../../../core/services/workspace/workspace-state.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../shared/utils/subscription-utils";
import {TabsComponent} from "./tabs/tabs.component";
import {MembersTabComponent} from "./tabs/members-tab/members-tab.component";
import {AttendanceTabComponent} from "./tabs/attendance-tab/attendance-tab.component";
import {UserStateService} from "../../../../core/services/user/user-state.service";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    TabsComponent,
    NgSwitchCase,
    NgSwitch,
    NgSwitchDefault,
    MembersTabComponent,
    AttendanceTabComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  user: User | null = null;
  workspace: Workspace | null = null;

  initialTab: Tab = tabs.members;

  selectedTab: Tab | null = this.initialTab;

  subscriptions: Subscription[] = []
  isClockedIn: boolean = false;

  constructor(private workspaceStateService: WorkspaceStateService,
              private userStateService: UserStateService
  ) {
  }

  ngOnInit(): void {
    const userSubscription = this.userStateService.user$.subscribe(user => {
      this.user = user
      this.getIsClockedIn()
    })

    const workspaceSubscription = this.workspaceStateService.workspace$.subscribe(workspace => {
      this.workspace = workspace
      this.selectedTab = null
      this.getIsClockedIn()
    })

    this.subscriptions.push(workspaceSubscription, userSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  getIsClockedIn() {
    this.isClockedIn = this.user?.userId === this.workspace?.ownerId
      || !!(this.user?.isClockedIn && this.user.clockedInAt === this.workspace?.workspaceId)
  }

  async clockIn(workspaceId: number) {
    if (this.user?.isClockedIn) {
      await this.userStateService.handleClockOut()
    }

    this.userStateService.handleClockIn({workspaceId})
  }

  selectTab(tab: Tab | null) {
    this.selectedTab = tab
  }
}
