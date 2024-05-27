import {Injectable} from '@angular/core';
import {PaginationData} from "../../../types/http";
import {GetCollaboratorsNamesResponse, GetCollaboratorsResponse} from "../../../types/collaborator";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceMemberService {
  private baseUrl = environment.apiURL + "/patient/collaborators"

  constructor(private http: HttpClient) {
  }

  getMembers(patientId: number, paginationData: PaginationData) {
    return this.http.get<GetCollaboratorsResponse>(`${this.baseUrl}`, {
      params: {
        ...paginationData,
        patientId
      }
    })
  }

  activateMember(patientId: number, userId: number) {
    return this.http.patch(`${this.baseUrl}/activate`, {}, {
      params: {
        userId,
        patientId
      }
    })
  }

  deactivateMember(patientId: number, userId: number) {
    return this.http.patch(`${this.baseUrl}/deactivate`, {}, {
      params: {
        userId,
        patientId
      }
    })
  }

  getMembersNames(patientId: number) {
    return this.http.get<GetCollaboratorsNamesResponse>(`${this.baseUrl}/names`, {
      params: {
        patientId
      }
    })

  }
}
