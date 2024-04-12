import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthResponse, LoginRequest} from "../../types/auth";
import {environment} from "../../../../environments/environment";
import {JwtService} from "./jwt.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static ref: AuthService | null
  private baseUrl = environment.apiURL + "/auth"

  constructor(private httpClient: HttpClient, private jwtService: JwtService, private router: Router) {
    if (!AuthService.ref) {
      AuthService.ref = this
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
        next: ({body: {accessToken, refreshToken}}) => {
          this.jwtService.accessToken = accessToken
          this.jwtService.refreshToken = refreshToken
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
      }),
      catchError(err => {
        this.jwtService.deleteAccessToken()
        this.jwtService.deleteRefreshToken()
        this.isLoggedInSubject.next(false)
        return throwError(() => err)
      })
    )
  }

  public forceLogout() {
    this.jwtService.deleteAccessToken();
    this.jwtService.deleteRefreshToken();
    this.isLoggedInSubject.next(false);

    this.router.navigate(['/login'])
  }

  public static getRef() {
    return this.ref
  }
}
