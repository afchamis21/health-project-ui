import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthResponse, LoginRequest} from "../types/auth";
import {GetUserResponse, User} from "../types/user";
import {environment} from "../../../environments/environment";
import {JwtService} from "./jwt.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiURL + "/auth"

  constructor(private httpClient: HttpClient, private jwtService: JwtService) {
    if (jwtService.accessToken) {
      this.fetchCurrentUser().subscribe({
        next: response => {
          this.userSubject.next(response.body)
        }
      })
    }
  }

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  get user$() {
    return this.userSubject.asObservable()
  }

  updateUser(user: User | null) {
    this.userSubject.next(user)
  }

  refreshTokens() {
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/refresh", {refreshToken: this.jwtService.refreshToken}).pipe(
      tap({
        next: ({body: {accessToken, refreshToken, user}}) => {
          console.log("Body:", accessToken, refreshToken, user)
          this.jwtService.accessToken = accessToken
          this.jwtService.refreshToken = refreshToken
        }
      })
    )
  }

  get isLoggedIn() {
    return this.jwtService.accessToken != null
  }

  login(data: LoginRequest) {
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/login", data).pipe(
      tap({
        next: ({body: {accessToken, refreshToken, user}}) => {
          this.jwtService.accessToken = accessToken
          this.jwtService.refreshToken = refreshToken
          this.userSubject.next(user)
        }
      })
    )
  }

  logout() {
    this.jwtService.deleteAccessToken()
    this.jwtService.deleteRefreshToken()
    this.userSubject.next(null)
  }

  private fetchCurrentUser() {
    return this.httpClient.get<GetUserResponse>(environment.apiURL + "/user")
  }
}
