import {Injectable} from '@angular/core';
import {ClockInRequest, GetAttendanceResponse, GetAttendancesResponse} from "../../../types/attendance";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaginationData} from "../../../types/http";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAttendanceService {
  private baseUrl = environment.apiURL + "/workspace"

  constructor(private http: HttpClient) {
  }

  clockIn(clockInRequest: ClockInRequest) {
    return this.http.post<GetAttendanceResponse>(`${this.baseUrl}/clock-in`, clockInRequest)
  }

  clockOut() {
    return this.http.post<GetAttendanceResponse>(`${this.baseUrl}/clock-out`, {})
  }

  getAttendances(workspaceId: number, paginationInfo: PaginationData, memberId: number | null) {
    const params: any = {...paginationInfo};
    // @ts-ignore
    if (memberId !== null && memberId !== "null") {
      params.userId = memberId;
    }

    return this.http.get<GetAttendancesResponse>(`${this.baseUrl}/${workspaceId}/attendances`, {
      params
    })
  }
}
