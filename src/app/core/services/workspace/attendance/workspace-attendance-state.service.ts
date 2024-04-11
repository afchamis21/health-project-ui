import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Workspace} from "../../../types/workspace";
import {WorkspaceStateService} from "../workspace-state.service";
import {Attendance} from "../../../types/attendance";
import {WorkspaceAttendanceService} from "./workspace-attendance.service";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAttendanceStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable()
  }

  private attendanceSubject = new BehaviorSubject<Attendance[]>([])

  get attendance$(): Observable<Attendance[]> {
    return this.attendanceSubject.asObservable();
  }

  set attendance$(members: Attendance[]) {
    this.attendanceSubject.next(members);
  }

  private workspace: Workspace | null = null;

  constructor(workspaceStateService: WorkspaceStateService, private workspaceAttendanceService: WorkspaceAttendanceService) {
    workspaceStateService.workspace$.subscribe(workspace => {
      this.workspace = workspace
      this.resetState()
    })
  }

  private resetState() {
    this.attendanceSubject.next([])
  }

  fetchAttendances() {

  }
}
