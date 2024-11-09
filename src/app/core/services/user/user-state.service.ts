import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {AttendanceService} from "../patient/attendance/attendance.service";
import {BehaviorSubject, firstValueFrom, map, Observable} from "rxjs";
import {CompleteRegistrationRequest, UpdateUserRequest, User} from "../../types/user";
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

  constructor(private userService: UserService, private attendanceService: AttendanceService,
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

  handleClockIn(patientId: number) {
    if (!this.userSubject.value) {
      return
    }

    this.attendanceService.clockIn(patientId).subscribe({
      next: (data) => {
        if (!this.userSubject.value) {
          return
        }

        this.userSubject.next({
          ...this.userSubject.value,
          isClockedIn: true,
          clockedInAt: data.body.patientId
        })
      }
    })
  }

  async handleClockOut() {
    if (!this.userSubject.value) {
      return
    }

    const sub = this.attendanceService.clockOut()
    await firstValueFrom(sub)
    this.userSubject.next({
      ...this.userSubject.value,
      isClockedIn: false,
      clockedInAt: undefined
    });
  }

  handleUpdateUser(data: UpdateUserRequest) {
    return this.userService.updateUser(data).pipe(
      map((res) => {
        this.toastr.info("Usuário atualizado com sucesso!")
        if (res.body.forcedLogOut) {
          this.authService.forceLogout()
          this.userSubject.next(null)
        }
      })
    )
  }

  handleCompleteRegistration(data: CompleteRegistrationRequest) {
    this.userService.completeRegistration(data).subscribe({
      next: () => {
        this.toastr.info("Usuário atualizado com sucesso!")
        this.authService.forceLogout()
      }
    })
  }
}
