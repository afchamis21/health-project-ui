import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {PatientStateService} from "../patient-state.service";
import {AttendanceService} from "./attendance.service";
import {PaginationData} from "../../../types/http";
import {UserStateService} from "../../user/user-state.service";
import {PatientSummary} from "../../../types/patient";
import {Attendance} from "../../../types/attendance";

@Injectable({
  providedIn: 'root'
})
export class AttendanceStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable()
  }

  private attendanceSubject = new BehaviorSubject<Attendance[]>([])

  get attendance$(): Observable<Attendance[]> {
    return this.attendanceSubject.asObservable();
  }

  private paginationData: PaginationData = {
    page: 0,
    size: 10,
    lastPage: 0,
    maxPages: 5,
    sort: "ASC"
  }

  getPaginationData(): PaginationData {
    return this.paginationData;
  }

  private patientSummary: PatientSummary | null = null;

  constructor(patientStateService: PatientStateService, private attendanceService: AttendanceService,
              private userStateService: UserStateService) {
    patientStateService.patientSummary$.subscribe(value => {
      this.patientSummary = value
      this.resetState()
    })
  }

  private resetState() {
    if (this.patientSummary && this.userStateService.currentUserValue?.userId === this.patientSummary.ownerId) {
      this.fetchAttendances()
    } else {
      this.attendanceSubject.next([])
    }
  }

  fetchAttendances(memberId: number | null = null) {
    if (!this.patientSummary) {
      return
    }

    this.loadingSubject.next(true)

    const sub = this.attendanceService.getAttendances(
      this.patientSummary.patientId, this.paginationData, memberId === 0 ? null : memberId
    ).subscribe({
      next: (data) => {
        this.attendanceSubject.next(data.body.data)
        this.paginationData.lastPage = data.body.lastPage

        this.loadingSubject.next(false)

        sub.unsubscribe()
      }
    })
  }
}
