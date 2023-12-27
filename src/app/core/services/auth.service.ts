import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthResponse, LoginRequest} from "../types/auth";
import {GetUserResponse, User} from "../types/user";
import {environment} from "../../../environments/environment";
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
    if (jwtService.accessToken) {
      this.fetchCurrentUser().subscribe({
        next: response => {
          this.userSubject.next(response.body)
        }
      })
    }
  }

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.jwtService.accessToken)

  get user$() {
    return this.userSubject.asObservable()
  }

  get isLoggedIn() {
    return this.isLoggedInSubject.value
  }

  get isLoggedIn$() {
    return this.isLoggedInSubject.asObservable()
  }

  updateUser(user: User | null) {
    this.userSubject.next(user)
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
          this.userSubject.next(user)
          this.isLoggedInSubject.next(true)
        }
      })
    )
  }

  logout() {
    this.jwtService.deleteAccessToken()
    this.jwtService.deleteRefreshToken()
    this.isLoggedInSubject.next(false)
    this.userSubject.next(null)
    this.httpClient.post(this.baseUrl + "/logout", {})
    this.router.navigate(['/login'])
  }

  private fetchCurrentUser() {
    return this.httpClient.get<GetUserResponse>(environment.apiURL + "/user")
  }

  public static getRef() {
    return this.ref
  }
}
