import {Injectable} from '@angular/core';
import {PaginationData} from "../../../types/http";
import {
  CreateWorkspaceMemberRequest,
  CreateWorkspaceMemberResponse,
  GetWorkspaceMembersNamesResponse,
  GetWorkspaceMembersResponse
} from "../../../types/workspace-member";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceMemberService {
  private baseUrl = environment.apiURL + "/workspace"

  constructor(private http: HttpClient) {
  }

  getMembers(workspaceId: number, paginationData: PaginationData) {
    return this.http.get<GetWorkspaceMembersResponse>(`${this.baseUrl}/${workspaceId}/members`, {
      params: {
        ...paginationData
      }
    })
  }

  addMember(workspaceId: number, data: CreateWorkspaceMemberRequest) {
    return this.http.post<CreateWorkspaceMemberResponse>(`${this.baseUrl}/${workspaceId}/members`, data)
  }

  activateMember(workspaceId: number, userId: number) {
    return this.http.patch(`${this.baseUrl}/${workspaceId}/members/activate`, {}, {
      params: {
        userId
      }
    })
  }

  deactivateMember(workspaceId: number, userId: number) {
    return this.http.patch(`${this.baseUrl}/${workspaceId}/members/deactivate`, {}, {
      params: {
        userId
      }
    })
  }

  getMembersNames(workspaceId: number) {
    return this.http.get<GetWorkspaceMembersNamesResponse>(`${this.baseUrl}/${workspaceId}/members/names`)

  }
}
