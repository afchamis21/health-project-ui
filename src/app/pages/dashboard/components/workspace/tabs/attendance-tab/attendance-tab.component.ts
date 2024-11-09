import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientCollaboratorName } from "../../../../../../core/types/collaborator";
import { MatIconModule } from "@angular/material/icon";
import { NgForOf, NgIf } from "@angular/common";
import { Subscription } from "rxjs";
import { CollaboratorStateService } from "../../../../../../core/services/patient/member/collaborator-state.service";
import { FormsModule } from "@angular/forms";
import { SubscriptionUtils } from "../../../../../../shared/utils/subscription-utils";
import { AttendanceStateService } from "../../../../../../core/services/patient/attendance/attendance-state.service";
import { DateUtils } from "../../../../../../shared/utils/date-utils";
import { PaginationData } from "../../../../../../core/types/http";
import { PageControllerComponent } from "../../../../../../shared/components/page-controller/page-controller.component";
import { Attendance } from "../../../../../../core/types/attendance";
import { NgxSpinnerComponent, NgxSpinnerService } from "ngx-spinner";
import { formatDuration, intervalToDuration } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-attendance-tab',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    NgForOf,
    FormsModule,
    PageControllerComponent,
    NgxSpinnerComponent
  ],
  templateUrl: './attendance-tab.component.html',
  styleUrl: './attendance-tab.component.css'
})
export class AttendanceTabComponent implements OnInit, OnDestroy {
  members: PatientCollaboratorName[] = [];
  attendances: (Attendance & { 
    duration: string, 
    displayStart: string, 
    displayEnd: string 
  })[] = [];

  subscriptions: Subscription[] = [];

  selectedMemberId: number | null = 0

  paginationData: PaginationData;

  constructor(private collaboratorStateService: CollaboratorStateService,
    private attendanceStateService: AttendanceStateService,
    private spinner: NgxSpinnerService) {
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
        this.attendances = data?.map(att => {
          if (!att.clockOutTime) {
            return { ...att, 
              displayStart: this.formatDate(att.clockInTime), 
              displayEnd: '-', 
              duration: 'Em progresso' 
            }
          }

          return { ...att, 
            displayStart: this.formatDate(att.clockInTime), 
            displayEnd: this.formatDate(att.clockOutTime), 
            duration: this.calculateDuration(att) 
          }
        })
      }
    })

    const loadingAttendancesSubscription = this.attendanceStateService.isLoading$.subscribe(data => {
      if (data) {
        this.spinner.show()
      } else {
        this.spinner.hide()
      }
    })

    this.subscriptions.push(memberSubscription, attendancesSubscription, loadingAttendancesSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
    this.spinner.hide()
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

  calculateDuration({ clockInTime: start, clockOutTime: end }: Attendance) {
    const duration = intervalToDuration({ start, end });

    return formatDuration(duration, { locale: ptBR });
  }
}
