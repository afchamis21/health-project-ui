import {Component, OnDestroy, OnInit} from '@angular/core';
import {Tab, tabs} from "../../../../core/types/tab";
import {User} from "../../../../core/types/user";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {PatientStateService} from "../../../../core/services/patient/patient-state.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../shared/utils/subscription-utils";
import {TabsComponent} from "./tabs/tabs.component";
import {MembersTabComponent} from "./tabs/members-tab/members-tab.component";
import {AttendanceTabComponent} from "./tabs/attendance-tab/attendance-tab.component";
import {UserStateService} from "../../../../core/services/user/user-state.service";
import {PatientSummary} from "../../../../core/types/patient";

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
  patientSummary: PatientSummary | null = null;

  initialTab: Tab = tabs.members;

  selectedTab: Tab | null = this.initialTab;

  subscriptions: Subscription[] = []
  isClockedIn: boolean = false;

  constructor(private patientStateService: PatientStateService,
              private userStateService: UserStateService
  ) {
  }

  ngOnInit(): void {
    const user$ = this.userStateService.user$.subscribe(user => {
      this.user = user
      this.getIsClockedIn()
    })

    const patient$ = this.patientStateService.patientSummary$.subscribe(value => {
      this.patientSummary = value
      this.selectedTab = null
      this.getIsClockedIn()
    })

    this.subscriptions.push(user$, patient$)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  getIsClockedIn() {
    this.isClockedIn = this.user?.userId === this.patientSummary?.ownerId
      || !!(this.user?.isClockedIn && this.user.clockedInAt === this.patientSummary?.patientId)
  }

  async clockIn(patientId: number) {
    if (this.user?.isClockedIn) {
      await this.userStateService.handleClockOut()
    }

    this.userStateService.handleClockIn(patientId)
  }

  selectTab(tab: Tab | null) {
    this.selectedTab = tab
  }
}
