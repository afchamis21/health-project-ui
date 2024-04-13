import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Workspace} from "../../../types/workspace";
import {WorkspaceStateService} from "../workspace-state.service";
import {AttendanceWithUsername} from "../../../types/attendance";
import {WorkspaceAttendanceService} from "./workspace-attendance.service";
import {PaginationData} from "../../../types/http";
import {UserStateService} from "../../user/user-state.service";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAttendanceStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable()
  }

  private attendanceSubject = new BehaviorSubject<AttendanceWithUsername[]>([])

  get attendance$(): Observable<AttendanceWithUsername[]> {
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

  private workspace: Workspace | null = null;

  constructor(workspaceStateService: WorkspaceStateService, private workspaceAttendanceService: WorkspaceAttendanceService,
              private userStateService: UserStateService) {
    workspaceStateService.workspace$.subscribe(workspace => {
      this.workspace = workspace
      this.resetState()
    })
  }

  private resetState() {
    if (this.workspace && this.userStateService.currentUserValue?.userId === this.workspace.ownerId) {
      this.fetchAttendances()
    } else {
      this.attendanceSubject.next([])
    }
  }

  fetchAttendances(memberId: number | null = null) {
    if (!this.workspace) {
      return
    }

    this.loadingSubject.next(true)

    const sub = this.workspaceAttendanceService.getAttendances(
      this.workspace.workspaceId, this.paginationData, memberId === 0 ? null : memberId
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
