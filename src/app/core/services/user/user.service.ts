import {Injectable} from '@angular/core';
import {CompleteRegistrationRequest, GetUserResponse, UpdateUserRequest, UpdateUserResponse} from "../../types/user";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CreatePatientRequest, GetPatientSummariesResponse, GetPatientSummaryResponse} from "../../types/patient";
import {BaseResponse, PaginationData} from "../../types/http";
import {CreateCollaboratorRequest, GetCollaboratorResponse, UpdateCollaboratorRequest} from "../../types/collaborator";

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
    return this.httpClient.put<UpdateUserResponse>(this.baseUrl + "/update", data)
  }

  completeRegistration(request: CompleteRegistrationRequest) {
    return this.httpClient.put<GetUserResponse>(this.baseUrl + "/complete-registration", request)
  }

  searchPatients(name: string, paginationData: PaginationData) {
    return this.httpClient.get<GetPatientSummariesResponse>(this.baseUrl + '/patient', {
      params: {
        name,
        ...paginationData
      }
    })
  }

  createPatient(data: CreatePatientRequest) {
    return this.httpClient.post<GetPatientSummaryResponse>(this.baseUrl + "/patient", data)
  }

  addCollaboratorToPatient(data: CreateCollaboratorRequest) {
    return this.httpClient.post<GetCollaboratorResponse>(`${this.baseUrl}/patient/collaborator`, data)
  }

  updateCollaborator(data: UpdateCollaboratorRequest) {
    return this.httpClient.put<BaseResponse<void>>(`${this.baseUrl}/patient/collaborator`, data)
  }
}
