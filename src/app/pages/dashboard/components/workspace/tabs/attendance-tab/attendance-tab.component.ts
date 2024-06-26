import {Component, OnDestroy, OnInit} from '@angular/core';
import {PatientCollaboratorName} from "../../../../../../core/types/collaborator";
import {MatIconModule} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {CollaboratorStateService} from "../../../../../../core/services/patient/member/collaborator-state.service";
import {FormsModule} from "@angular/forms";
import {SubscriptionUtils} from "../../../../../../shared/utils/subscription-utils";
import {AttendanceStateService} from "../../../../../../core/services/patient/attendance/attendance-state.service";
import {DateUtils} from "../../../../../../shared/utils/date-utils";
import {SpinnerComponent} from "../../../../../../shared/components/loader/spinner/spinner.component";
import {PaginationData} from "../../../../../../core/types/http";
import {PageControllerComponent} from "../../../../../../shared/components/page-controller/page-controller.component";
import {Attendance} from "../../../../../../core/types/attendance";

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
  members: PatientCollaboratorName[] = [];
  attendances: Attendance[] = [];

  subscriptions: Subscription[] = [];

  selectedMemberId: number | null = 0
  isLoadingAttendances: boolean = true;

  paginationData: PaginationData;

  constructor(private collaboratorStateService: CollaboratorStateService, private attendanceStateService: AttendanceStateService) {
    this.paginationData = this.attendanceStateService.getPaginationData()
  }

  ngOnInit(): void {
    const memberSubscription = this.collaboratorStateService.memberNames$.subscribe({
      next: data => {
        this.members = data
      }
    })

    const attendancesSubscription = this.attendanceStateService.attendance$.subscribe({
      next: data => {
        this.attendances = data
      }
    })

    const loadingAttendancesSubscription = this.attendanceStateService.isLoading$.subscribe(data => {
      this.isLoadingAttendances = data
    })

    this.subscriptions.push(memberSubscription, attendancesSubscription, loadingAttendancesSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  handleFilterAttendances() {
    this.attendanceStateService.fetchAttendances(this.selectedMemberId)
    this.selectedMemberId = 0
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

    this.attendanceStateService.fetchAttendances(this.selectedMemberId)
  }
}
