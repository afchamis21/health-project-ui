import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {GetPatientResponse, GetPatientSummaryResponse, UpdatePatientRequest} from "../../types/patient";
import {VoidResponse} from "../../types/http";

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = environment.apiURL + "/patient"

  constructor(private http: HttpClient) {
  }

  deletePatient(patientId: number) {
    return this.http.delete<VoidResponse>(`${this.baseUrl}`, {
      params: {
        patientId
      }
    })
  } // Na tab gerenciar

  deactivatePatient(patientId: number) {
    return this.http.patch<VoidResponse>(`${this.baseUrl}/deactivate`, {}, {
      params: {
        patientId
      }
    })
  } // Na tab gerenciar

  activatePatient(patientId: number) {
    return this.http.patch<VoidResponse>(`${this.baseUrl}/activate`, {}, {
      params: {
        patientId
      }
    })
  } // Na tab gerenciar

  updatePatient(patientId: number, data: UpdatePatientRequest) {
    return this.http.put<GetPatientSummaryResponse>(`${this.baseUrl}`, data, {
      params: {
        patientId
      }
    })
  } // Na tab gerenciar

  fetchPatient(patientId: number) {
    return this.http.get<GetPatientResponse>(`${this.baseUrl}`, {
      params: {
        patientId
      }
    })
  }  // Na tab gerenciar

  fetchPatientSummary(patientId: number) {
    return this.http.get<GetPatientSummaryResponse>(`${this.baseUrl}/summary`, {
      params: {
        patientId
      }
    })
  }
}
