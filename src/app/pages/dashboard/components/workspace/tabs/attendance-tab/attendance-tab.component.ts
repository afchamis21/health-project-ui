import {Component, OnDestroy, OnInit} from '@angular/core';
import {WorkspaceMemberName} from "../../../../../../core/types/workspace-member";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {
  WorkspaceMemberStateService
} from "../../../../../../core/services/workspace/member/workspace-member-state.service";
import {FormsModule} from "@angular/forms";
import {SubscriptionUtils} from "../../../../../../shared/utils/subscription-utils";
import {
  WorkspaceAttendanceStateService
} from "../../../../../../core/services/workspace/attendance/workspace-attendance-state.service";
import {AttendanceWithUsername} from "../../../../../../core/types/attendance";
import {DateUtils} from "../../../../../../shared/utils/date-utils";
import {SpinnerComponent} from "../../../../../../shared/components/loader/spinner/spinner.component";
import {PaginationData} from "../../../../../../core/types/http";
import {PageControllerComponent} from "../../../../../../shared/components/page-controller/page-controller.component";

@Component({
  selector: 'app-attendance-tab',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    NgForOf,
    FormsModule,
    SpinnerComponent,
    PageControllerComponent
  ],
  templateUrl: './attendance-tab.component.html',
  styleUrl: './attendance-tab.component.css'
})
export class AttendanceTabComponent implements OnInit, OnDestroy {
  members: WorkspaceMemberName[] = [];
  attendances: AttendanceWithUsername[] = [];

  subscriptions: Subscription[] = [];

  selectedMemberId: number | null = null
  isLoadingAttendances: boolean = true;

  paginationData: PaginationData;

  constructor(private workspaceMemberStateService: WorkspaceMemberStateService, private workspaceAttendanceStateService: WorkspaceAttendanceStateService) {
    this.paginationData = this.workspaceAttendanceStateService.getPaginationData()
  }

  ngOnInit(): void {
    const memberSubscription = this.workspaceMemberStateService.memberNames$.subscribe({
      next: data => {
        this.members = data
      }
    })

    const attendancesSubscription = this.workspaceAttendanceStateService.attendance$.subscribe({
      next: data => {
        this.attendances = data
      }
    })

    const loadingAttendancesSubscription = this.workspaceAttendanceStateService.isLoading$.subscribe(data => {
      this.isLoadingAttendances = data
    })

    this.subscriptions.push(memberSubscription, attendancesSubscription, loadingAttendancesSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  handleFilterAttendances() {
    this.workspaceAttendanceStateService.fetchAttendances(this.selectedMemberId)
  }

  formatDate(date: Date) {
    return DateUtils.formatDate(date)
  }

  handleNextPage() {
    this.handleSpecificPage(this.paginationData.page + 1)
  }

  handlePreviousPage() {
    this.handleSpecificPage(this.paginationData.page - 1)
  }

  handleSpecificPage(page: number) {
    this.paginationData.page = page;

    this.workspaceAttendanceStateService.fetchAttendances(this.selectedMemberId)
  }
}
