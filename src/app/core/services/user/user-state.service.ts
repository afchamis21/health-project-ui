import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {WorkspaceAttendanceService} from "../workspace/attendance/workspace-attendance.service";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {CompleteRegistrationRequest, UpdateUserRequest, User} from "../../types/user";
import {ClockInRequest} from "../../types/attendance";
import {AuthService} from "../auth/auth.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get currentUserValue() {
    return this.userSubject.value
  }

  constructor(private userService: UserService, private workspaceAttendanceService: WorkspaceAttendanceService,
              private authService: AuthService, private toastr: ToastrService
  ) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        userService.fetchCurrentUser().subscribe({
          next: data => {
            this.userSubject.next(data.body)
          },
          error: () => {
            this.authService.forceLogout()
          }
        });
      } else {
        this.userSubject.next(null)
      }
    })
  }

  handleClockIn(data: ClockInRequest) {
    if (!this.userSubject.value) {
      return
    }

    this.workspaceAttendanceService.clockIn(data).subscribe({
      next: (data) => {
        if (!this.userSubject.value) {
          return
        }

        this.userSubject.next({
          ...this.userSubject.value,
          isClockedIn: true,
          clockedInAt: data.body.workspaceId
        })
      }
    })
  }

  async handleClockOut() {
    if (!this.userSubject.value) {
      return
    }

    const sub = this.workspaceAttendanceService.clockOut()
    await firstValueFrom(sub)
    this.userSubject.next({
      ...this.userSubject.value,
      isClockedIn: false,
      clockedInAt: undefined
    });
  }

  handleUpdateUser(data: UpdateUserRequest) {
    this.userService.updateUser(data).subscribe({
      next: () => {
        this.toastr.success("Usuário atualizado com sucesso!")
        this.authService.forceLogout()
      }
    })
  }

  handleCompleteRegistration(data: CompleteRegistrationRequest) {
    this.userService.completeRegistration(data).subscribe({
      next: () => {
        this.toastr.success("Usuário atualizado com sucesso!")
        this.authService.forceLogout()
      }
    })
  }
}
