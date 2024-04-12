import {Injectable} from '@angular/core';
import {CompleteRegistrationRequest, GetUserResponse, UpdateUserRequest} from "../../types/user";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GetWorkspacesResponse} from "../../types/workspace";
import {PaginationData} from "../../types/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiURL + "/user"

  constructor(private httpClient: HttpClient) {
  }

  fetchCurrentUser() {
    return this.httpClient.get<GetUserResponse>(this.baseUrl)
  }

  updateUser(data: UpdateUserRequest) {
    return this.httpClient.put<GetUserResponse>(this.baseUrl + "/update", data)
  }

  completeRegistration(request: CompleteRegistrationRequest) {
    return this.httpClient.put<GetUserResponse>(this.baseUrl + "/complete-registration", request)
  }

  searchWorkspaces(name: string, paginationData: PaginationData) {
    return this.httpClient.get<GetWorkspacesResponse>(this.baseUrl + '/workspaces/search', {
      params: {
        name,
        ...paginationData
      }
    })
  }
}
