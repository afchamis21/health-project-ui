import {Injectable} from '@angular/core';
import {GetAttendanceResponse, GetAttendancesResponse} from "../../../types/attendance";
import {HttpClient} from "@angular/common/http";
import {PaginationData} from "../../../types/http";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = environment.apiURL

  constructor(private http: HttpClient) {
  }

  clockIn(patientId: number) {
    return this.http.post<GetAttendanceResponse>(`${this.baseUrl}/user/clock-in`, {}, {
      params: {
        patientId
      }
    })
  }

  clockOut() {
    return this.http.post<GetAttendanceResponse>(`${this.baseUrl}/user/clock-out`, {})
  }

  getAttendances(patientId: number, paginationInfo: PaginationData, memberId: number | null) {
    const params: any = {...paginationInfo, patientId};
    // @ts-ignore
    if (memberId !== null && memberId !== "null") {
      params.userId = memberId;
    }

    return this.http.get<GetAttendancesResponse>(`${this.baseUrl}/patient/attendance`, {
      params
    })
  }
}
