import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private localStorageKey = "health-project-"
  private accessTokenKey = this.localStorageKey + "access-token"
  private refreshTokenKey = this.localStorageKey + "refresh-token"

  constructor() {
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey)
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey)
  }

  set accessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token)
  }

  set refreshToken(token: string) {
    localStorage.setItem(this.refreshTokenKey, token)
  }

  deleteAccessToken() {
    localStorage.removeItem(this.accessTokenKey)
  }

  deleteRefreshToken() {
    localStorage.removeItem(this.refreshTokenKey)
  }
}
