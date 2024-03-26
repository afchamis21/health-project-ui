import {Injectable} from '@angular/core';
import {CompleteRegistrationRequest, GetUserResponse, UpdateUserRequest, User} from "../types/user";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {GetWorkspacesResponse} from "../types/workspace";
import {PaginationData} from "../types/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiURL + "/user"
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  set user$(user: User | null) {
    this.userSubject.next(user);
  }

  constructor(private httpClient: HttpClient) {
  }

  updateUser(data: UpdateUserRequest) {
    return this.httpClient.put<GetUserResponse>(this.baseUrl + "/update", data)
  }

  completeRegistration(request: CompleteRegistrationRequest) {
    return this.httpClient.put<GetUserResponse>(this.baseUrl + "/complete-registration", request).pipe(
      tap((response) => {
        if (response.body) {
          this.user$ = response.body
        }
      })
    )
  }

  getWorkspaces(paginationData: PaginationData) {
    return this.httpClient.get<GetWorkspacesResponse>(this.baseUrl + '/workspaces', {
      params: {
        ...paginationData
      }
    })
  }

  searchWorkspaces(name: string, paginationData: PaginationData) {
    return this.httpClient.get<GetWorkspacesResponse>(this.baseUrl + '/workspaces/search', {
      params: {
        name,
        ...paginationData
      }
    })
  }

  clockIn(workspaceId: number) {
    this.userSubject.next(this.userSubject.value
      ?
      {
        ...this.userSubject.value,
        clockedInAt: workspaceId,
        isClockedIn: true
      }
      : null)
  }

  clockOut() {
    this.userSubject.next(this.userSubject.value
      ?
      {
        ...this.userSubject.value,
        clockedInAt: undefined,
        isClockedIn: false
      }
      : null)
  }
}
