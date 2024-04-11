import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  DeleteWorkspaceResponse,
  GetWorkspaceResponse,
  UpdateWorkspaceRequest
} from "../../types/workspace";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private baseUrl = environment.apiURL + "/workspace"

  constructor(private http: HttpClient) {
  }

  createWorkspace(data: CreateWorkspaceRequest) {
    return this.http.post<CreateWorkspaceResponse>(this.baseUrl + "/create", data)
  }

  deleteWorkspace(workspaceId: number) {
    return this.http.delete<DeleteWorkspaceResponse>(`${this.baseUrl}/${workspaceId}/delete`)
  } // Na tab gerenciar

  deactivateWorkspace(workspaceId: number) {
    return this.http.patch<DeleteWorkspaceResponse>(`${this.baseUrl}/${workspaceId}/deactivate`, {})
  } // Na tab gerenciar

  activateWorkspace(workspaceId: number) {
    return this.http.patch<DeleteWorkspaceResponse>(`${this.baseUrl}/${workspaceId}/activate`, {})
  } // Na tab gerenciar

  updateWorkspace(workspaceId: number, data: UpdateWorkspaceRequest) {
    return this.http.put<DeleteWorkspaceResponse>(`${this.baseUrl}/${workspaceId}/update`, data)
  } // Na tab gerenciar

  fetchWorkspace(workspaceId: number) {
    return this.http.get<GetWorkspaceResponse>(`${this.baseUrl}/${workspaceId}`)
  }
}
