import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {DeletePatientResponse, GetPatientResponse, UpdatePatientRequest} from "../../types/patient";

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = environment.apiURL + "/patient"

  constructor(private http: HttpClient) {
  }

  deletePatient(patientId: number) {
    return this.http.delete<DeletePatientResponse>(`${this.baseUrl}/delete`, {
      params: {
        patientId
      }
    })
  } // Na tab gerenciar

  deactivatePatient(patientId: number) {
    return this.http.patch<DeletePatientResponse>(`${this.baseUrl}/deactivate`, {}, {
      params: {
        patientId
      }
    })
  } // Na tab gerenciar

  activatePatient(patientId: number) {
    return this.http.patch<DeletePatientResponse>(`${this.baseUrl}/activate`, {}, {
      params: {
        patientId
      }
    })
  } // Na tab gerenciar

  updatePatient(patientId: number, data: UpdatePatientRequest) {
    return this.http.put<DeletePatientResponse>(`${this.baseUrl}/update`, data, {
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
  }
}
