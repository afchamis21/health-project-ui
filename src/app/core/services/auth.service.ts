import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthResponse, LoginRequest} from "../types/auth";
import {GetUserResponse} from "../types/user";
import {environment} from "../../../environments/environment";
import {JwtService} from "./jwt.service";
import {Router} from "@angular/router";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static ref: AuthService | null
  private baseUrl = environment.apiURL + "/auth"

  constructor(private httpClient: HttpClient, private jwtService: JwtService, private userService: UserService, private router: Router) {
    if (!AuthService.ref) {
      AuthService.ref = this
    }

    if (jwtService.accessToken) {
      this.fetchCurrentUser().subscribe({
        next: response => {
          this.userService.user$ = response.body
        },
        error: () => {
          this.logout().subscribe()
        }
      })
    }
  }

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.jwtService.accessToken)

  get isLoggedIn() {
    return this.isLoggedInSubject.value
  }

  get isLoggedIn$() {
    return this.isLoggedInSubject.asObservable()
  }

  refreshTokens() {
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/refresh", {refreshToken: this.jwtService.refreshToken}).pipe(
      tap({
        next: ({body: {accessToken, refreshToken}}) => {
          this.jwtService.accessToken = accessToken
          this.jwtService.refreshToken = refreshToken
        }
      })
    )
  }

  login(data: LoginRequest) {
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/login", data).pipe(
      tap({
        next: ({body: {accessToken, refreshToken, user}}) => {
          this.jwtService.accessToken = accessToken
          this.jwtService.refreshToken = refreshToken
          this.userService.user$ = user
          this.isLoggedInSubject.next(true)
        }
      })
    )
  }

  logout() {
    return this.httpClient.post(this.baseUrl + "/logout", {}).pipe(
      tap(() => {
        this.jwtService.deleteAccessToken()
        this.jwtService.deleteRefreshToken()
        this.isLoggedInSubject.next(false)
        this.userService.user$ = null
      }),
      catchError(err => {
        this.jwtService.deleteAccessToken()
        this.jwtService.deleteRefreshToken()
        this.isLoggedInSubject.next(false)
        this.userService.user$ = null
        return throwError(() => err)
      })
    )
  }

  public forceLogout() {
    this.jwtService.deleteAccessToken();
    this.jwtService.deleteRefreshToken();
    this.isLoggedInSubject.next(false);
    this.userService.user$ = null

    this.router.navigate(['/login'])
  }

  private fetchCurrentUser() {
    return this.httpClient.get<GetUserResponse>(environment.apiURL + "/user")
  }

  public static getRef() {
    return this.ref
  }
}
